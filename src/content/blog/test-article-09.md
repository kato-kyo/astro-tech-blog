---
title: "MongoDB アグリゲーション完全ガイド"
description: "MongoDBのアグリゲーションパイプラインを使用した高度なデータ処理と分析クエリの実装方法を詳しく解説します。"
pubDate: 2024-01-12
heroImage: "/images/mongodb-aggregation.jpg"
tags: ["MongoDB", "NoSQL", "データベース", "アグリゲーション"]
category: "データベース"
draft: false
---

# MongoDB アグリゲーション完全ガイド

MongoDBのアグリゲーションパイプラインは、複雑なデータ処理と分析を効率的に行うための強力な機能です。

## 基本的なパイプライン

```javascript
// 基本的な集計クエリ
db.orders.aggregate([
  { $match: { status: "shipped" } },
  { $group: {
    _id: "$customerId",
    totalAmount: { $sum: "$amount" },
    orderCount: { $sum: 1 }
  }},
  { $sort: { totalAmount: -1 } },
  { $limit: 10 }
]);
```

## $lookup (Join操作)

```javascript
// 複数コレクションの結合
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  },
  {
    $project: {
      orderDate: 1,
      amount: 1,
      customerName: "$customer.name",
      customerEmail: "$customer.email"
    }
  }
]);
```

## 日付集計

```javascript
// 月別売上集計
db.orders.aggregate([
  {
    $match: {
      orderDate: {
        $gte: new Date("2024-01-01"),
        $lt: new Date("2025-01-01")
      }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: "$orderDate" },
        month: { $month: "$orderDate" }
      },
      totalSales: { $sum: "$amount" },
      orderCount: { $sum: 1 },
      avgOrderValue: { $avg: "$amount" }
    }
  },
  {
    $sort: { "_id.year": 1, "_id.month": 1 }
  }
]);
```

## 配列操作

```javascript
// 商品別売上分析
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      totalQuantity: { $sum: "$items.quantity" },
      totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
      orderCount: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  {
    $project: {
      productName: { $arrayElemAt: ["$product.name", 0] },
      totalQuantity: 1,
      totalRevenue: 1,
      avgRevenuePerOrder: { $divide: ["$totalRevenue", "$orderCount"] }
    }
  }
]);
```

## $facet (複数パイプライン)

```javascript
// 複数の分析を同時実行
db.orders.aggregate([
  {
    $facet: {
      "salesByStatus": [
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$amount" }
          }
        }
      ],
      "salesByRegion": [
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customer"
          }
        },
        { $unwind: "$customer" },
        {
          $group: {
            _id: "$customer.region",
            totalSales: { $sum: "$amount" }
          }
        }
      ],
      "topCustomers": [
        {
          $group: {
            _id: "$customerId",
            totalSpent: { $sum: "$amount" }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 }
      ]
    }
  }
]);
```

## テキスト検索

```javascript
// 全文検索とスコアリング
db.products.aggregate([
  {
    $match: {
      $text: { $search: "スマートフォン カメラ" }
    }
  },
  {
    $addFields: {
      score: { $meta: "textScore" }
    }
  },
  {
    $sort: { score: { $meta: "textScore" } }
  },
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "productId",
      as: "reviews"
    }
  },
  {
    $addFields: {
      avgRating: { $avg: "$reviews.rating" },
      reviewCount: { $size: "$reviews" }
    }
  }
]);
```

## 地理空間クエリ

```javascript
// 近隣店舗検索
db.stores.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [139.6917, 35.6895] // 東京駅
      },
      distanceField: "distance",
      maxDistance: 5000, // 5km以内
      spherical: true
    }
  },
  {
    $lookup: {
      from: "inventory",
      localField: "_id",
      foreignField: "storeId",
      as: "inventory"
    }
  },
  {
    $match: {
      "inventory.productId": ObjectId("...")
    }
  },
  {
    $project: {
      name: 1,
      address: 1,
      distance: 1,
      hasProduct: { $gt: [{ $size: "$inventory" }, 0] }
    }
  }
]);
```

## パフォーマンス最適化

```javascript
// インデックス活用とパイプライン最適化
db.orders.aggregate([
  // 早い段階でのフィルタリング
  {
    $match: {
      orderDate: { $gte: new Date("2024-01-01") },
      status: { $in: ["shipped", "delivered"] }
    }
  },
  // 必要なフィールドのみ選択
  {
    $project: {
      customerId: 1,
      amount: 1,
      orderDate: 1
    }
  },
  // インデックスを活用したソート
  { $sort: { orderDate: -1 } },
  // 早期の結果制限
  { $limit: 1000 },
  {
    $group: {
      _id: "$customerId",
      totalAmount: { $sum: "$amount" },
      lastOrderDate: { $max: "$orderDate" }
    }
  }
]);

// 推奨インデックス
db.orders.createIndex({ orderDate: -1, status: 1 });
db.orders.createIndex({ customerId: 1, orderDate: -1 });
```

## ウィンドウ関数

```javascript
// ランキングと累積計算
db.sales.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$region",
      sortBy: { amount: -1 },
      output: {
        rank: { $rank: {} },
        runningTotal: {
          $sum: "$amount",
          window: { documents: ["unbounded preceding", "current"] }
        }
      }
    }
  },
  {
    $match: { rank: { $lte: 3 } }
  }
]);
```

MongoDBのアグリゲーション機能を活用することで、複雑なデータ分析とレポート生成を効率的に実行できます。 