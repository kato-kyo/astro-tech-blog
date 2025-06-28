---
title: "AWS Lambda サーバーレス実践"
description: "AWS Lambdaを使用したサーバーレスアーキテクチャの設計、実装、運用のベストプラクティスを詳しく解説します。"
pubDate: 2024-01-11
heroImage: "/images/aws-lambda.jpg"
tags: ["AWS", "Lambda", "サーバーレス", "クラウド"]
category: "クラウド"
draft: false
---

# AWS Lambda サーバーレス実践

AWS Lambdaを活用したサーバーレスアーキテクチャの実装と運用について解説します。

## 基本的なLambda関数

```javascript
// index.js
exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const { httpMethod, pathParameters, body } = event;
  
  try {
    switch (httpMethod) {
      case 'GET':
        return await handleGet(pathParameters);
      case 'POST':
        return await handlePost(JSON.parse(body));
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function handleGet(pathParameters) {
  const { id } = pathParameters || {};
  
  // データベースからデータ取得
  const result = await dynamoDB.get({
    TableName: 'Users',
    Key: { id }
  }).promise();
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(result.Item)
  };
}
```

## SAMテンプレート

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 30
    Runtime: nodejs18.x
    Environment:
      Variables:
        TABLE_NAME: !Ref UsersTable

Resources:
  ApiGateway:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      Cors:
        AllowMethods: "'GET,POST,PUT,DELETE'"
        AllowHeaders: "'Content-Type,X-Amz-Date,Authorization'"
        AllowOrigin: "'*'"

  UserFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/
      Handler: users.handler
      Events:
        GetUser:
          Type: Api
          Properties:
            RestApiId: !Ref ApiGateway
            Path: /users/{id}
            Method: get
        CreateUser:
          Type: Api
          Properties:
            RestApiId: !Ref ApiGateway
            Path: /users
            Method: post
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref UsersTable

  UsersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH
```

## DynamoDB操作

```javascript
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

class UserService {
  static async createUser(userData) {
    const user = {
      id: generateId(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    await dynamoDB.put({
      TableName: process.env.TABLE_NAME,
      Item: user,
      ConditionExpression: 'attribute_not_exists(id)'
    }).promise();
    
    return user;
  }
  
  static async getUser(id) {
    const result = await dynamoDB.get({
      TableName: process.env.TABLE_NAME,
      Key: { id }
    }).promise();
    
    return result.Item;
  }
  
  static async updateUser(id, updates) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    
    Object.keys(updates).forEach(key => {
      updateExpression.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = updates[key];
    });
    
    const result = await dynamoDB.update({
      TableName: process.env.TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }).promise();
    
    return result.Attributes;
  }
  
  static async deleteUser(id) {
    await dynamoDB.delete({
      TableName: process.env.TABLE_NAME,
      Key: { id }
    }).promise();
    
    return { deleted: true };
  }
}
```

## 非同期処理とSQS

```javascript
// producer.js
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  const messages = event.Records.map(record => ({
    Id: record.messageId,
    MessageBody: JSON.stringify({
      userId: record.dynamodb.Keys.id.S,
      eventName: record.eventName,
      timestamp: new Date().toISOString()
    })
  }));
  
  if (messages.length > 0) {
    await sqs.sendMessageBatch({
      QueueUrl: process.env.QUEUE_URL,
      Entries: messages
    }).promise();
  }
};

// consumer.js
exports.handler = async (event) => {
  const promises = event.Records.map(async (record) => {
    const message = JSON.parse(record.body);
    
    try {
      await processMessage(message);
      console.log('Message processed successfully:', message);
    } catch (error) {
      console.error('Error processing message:', error);
      throw error; // SQSでリトライされる
    }
  });
  
  await Promise.all(promises);
};

async function processMessage(message) {
  // メール送信、データ同期などの処理
  switch (message.eventName) {
    case 'INSERT':
      await sendWelcomeEmail(message.userId);
      break;
    case 'MODIFY':
      await updateExternalSystem(message.userId);
      break;
    case 'REMOVE':
      await cleanupUserData(message.userId);
      break;
  }
}
```

## S3イベント処理

```javascript
// s3-processor.js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const sharp = require('sharp');

exports.handler = async (event) => {
  const promises = event.Records.map(async (record) => {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;
    
    // 画像リサイズ処理
    if (key.match(/\.(jpg|jpeg|png)$/i)) {
      await resizeImage(bucket, key);
    }
    
    // ログファイル処理
    if (key.endsWith('.log')) {
      await processLogFile(bucket, key);
    }
  });
  
  await Promise.all(promises);
};

async function resizeImage(bucket, key) {
  try {
    const object = await s3.getObject({
      Bucket: bucket,
      Key: key
    }).promise();
    
    const resized = await sharp(object.Body)
      .resize(800, 600, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();
    
    await s3.putObject({
      Bucket: bucket,
      Key: key.replace(/(\.[^.]+)$/, '_resized$1'),
      Body: resized,
      ContentType: 'image/jpeg'
    }).promise();
    
    console.log(`Resized image: ${key}`);
  } catch (error) {
    console.error(`Error resizing image ${key}:`, error);
    throw error;
  }
}
```

## ステップ関数統合

```json
{
  "Comment": "ユーザー登録ワークフロー",
  "StartAt": "ValidateUser",
  "States": {
    "ValidateUser": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:region:account:function:validateUser",
      "Next": "CreateUser",
      "Catch": [{
        "ErrorEquals": ["ValidationError"],
        "Next": "ValidationFailed"
      }]
    },
    "CreateUser": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:region:account:function:createUser",
      "Next": "SendNotification"
    },
    "SendNotification": {
      "Type": "Parallel",
      "Branches": [
        {
          "StartAt": "SendEmail",
          "States": {
            "SendEmail": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:region:account:function:sendEmail",
              "End": true
            }
          }
        },
        {
          "StartAt": "SendSMS",
          "States": {
            "SendSMS": {
              "Type": "Task",
              "Resource": "arn:aws:lambda:region:account:function:sendSMS",
              "End": true
            }
          }
        }
      ],
      "End": true
    },
    "ValidationFailed": {
      "Type": "Fail",
      "Error": "ValidationError",
      "Cause": "ユーザーデータの検証に失敗しました"
    }
  }
}
```

## 監視とロギング

```javascript
const AWS = require('aws-sdk');
const cloudWatch = new AWS.CloudWatch();

// カスタムメトリクス送信
async function sendMetric(metricName, value, unit = 'Count') {
  await cloudWatch.putMetricData({
    Namespace: 'MyApp/Lambda',
    MetricData: [{
      MetricName: metricName,
      Value: value,
      Unit: unit,
      Timestamp: new Date()
    }]
  }).promise();
}

// 構造化ログ
function logger(level, message, metadata = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata,
    requestId: context.awsRequestId
  }));
}

exports.handler = async (event, context) => {
  const startTime = Date.now();
  
  try {
    logger('INFO', 'Function started', { event });
    
    const result = await processRequest(event);
    
    await sendMetric('SuccessfulRequests', 1);
    logger('INFO', 'Function completed successfully', { result });
    
    return result;
  } catch (error) {
    await sendMetric('FailedRequests', 1);
    logger('ERROR', 'Function failed', { error: error.message, stack: error.stack });
    throw error;
  } finally {
    const duration = Date.now() - startTime;
    await sendMetric('ExecutionDuration', duration, 'Milliseconds');
  }
};
```

AWS Lambdaを適切に活用することで、スケーラブルで費用効率の良いサーバーレスアプリケーションを構築できます。 