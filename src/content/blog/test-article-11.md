---
title: "TypeScript 高度な型定義テクニック"
description: "TypeScriptの高度な型定義、ジェネリクス、条件型、テンプレートリテラル型を活用した実践的なテクニックを解説します。"
pubDate: 2024-01-10
heroImage: "/images/typescript-advanced.jpg"
tags: ["TypeScript", "型定義", "ジェネリクス", "プログラミング"]
category: "プログラミング"
draft: false
---

# TypeScript 高度な型定義テクニック

TypeScriptの型システムを最大限活用するための高度なテクニックを紹介します。

## 条件型 (Conditional Types)

```typescript
// 基本的な条件型
type IsString<T> = T extends string ? true : false;

type Test1 = IsString<string>; // true
type Test2 = IsString<number>; // false

// より実用的な例
type NonNullable<T> = T extends null | undefined ? never : T;

type ApiResponse<T> = T extends string
  ? { message: T }
  : T extends number
  ? { count: T }
  : { data: T };
```

## テンプレートリテラル型

```typescript
// 文字列の結合
type Greeting<T extends string> = `Hello, ${T}!`;
type Message = Greeting<"World">; // "Hello, World!"

// URL パス生成
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = "users" | "posts" | "comments";
type ApiPath<M extends HttpMethod, E extends Endpoint> = `${M} /api/${E}`;

type UserEndpoints = 
  | ApiPath<"GET", "users">    // "GET /api/users"
  | ApiPath<"POST", "users">   // "POST /api/users"
  | ApiPath<"PUT", "users">    // "PUT /api/users"
  | ApiPath<"DELETE", "users"> // "DELETE /api/users"

// CSS プロパティ生成
type CSSProperty<T extends string> = `--${T}`;
type ThemeVariables = {
  [K in CSSProperty<"primary" | "secondary" | "accent">]: string;
};
```

## マップ型とキー再マッピング

```typescript
// オブジェクトのキーを変換
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type UserGetters = Getters<User>;
// {
//   getName: () => string;
//   getAge: () => number;
//   getEmail: () => string;
// }

// オプショナルプロパティの作成
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UpdateUser = PartialBy<User, "age" | "email">;
// {
//   name: string;
//   age?: number;
//   email?: string;
// }
```

## 再帰型

```typescript
// ネストしたオブジェクトの型定義
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Config {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  api: {
    version: string;
    endpoints: string[];
  };
}

type PartialConfig = DeepPartial<Config>;

// パスの型定義
type Path<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? K | `${K}.${Path<T[K]>}`
    : K
  : never;

type ConfigPath = Path<Config>;
// "database" | "api" | "database.host" | "database.port" | "database.credentials" | "database.credentials.username" | ...
```

## 関数オーバーロードの型定義

```typescript
// 関数シグネチャのオーバーロード
interface Repository {
  find(id: string): Promise<User | null>;
  find(ids: string[]): Promise<User[]>;
  find(query: { name?: string; email?: string }): Promise<User[]>;
}

type RepositoryFindMethod = {
  (id: string): Promise<User | null>;
  (ids: string[]): Promise<User[]>;
  (query: { name?: string; email?: string }): Promise<User[]>;
};

// 実装例
class UserRepository implements Repository {
  async find(
    param: string | string[] | { name?: string; email?: string }
  ): Promise<User | User[] | null> {
    if (typeof param === "string") {
      return this.findById(param);
    } else if (Array.isArray(param)) {
      return this.findByIds(param);
    } else {
      return this.findByQuery(param);
    }
  }

  private async findById(id: string): Promise<User | null> {
    // 実装
  }

  private async findByIds(ids: string[]): Promise<User[]> {
    // 実装
  }

  private async findByQuery(query: { name?: string; email?: string }): Promise<User[]> {
    // 実装
  }
}
```

## 型ガードと判別ユニオン

```typescript
// 判別ユニオン型
type ApiResult<T> = 
  | { status: "success"; data: T }
  | { status: "error"; error: string }
  | { status: "loading" };

// 型ガード関数
function isSuccess<T>(result: ApiResult<T>): result is { status: "success"; data: T } {
  return result.status === "success";
}

function isError<T>(result: ApiResult<T>): result is { status: "error"; error: string } {
  return result.status === "error";
}

// 使用例
function handleApiResult<T>(result: ApiResult<T>) {
  if (isSuccess(result)) {
    console.log(result.data); // 型安全にアクセス可能
  } else if (isError(result)) {
    console.error(result.error); // 型安全にアクセス可能
  } else {
    console.log("Loading..."); // result.status は "loading"
  }
}
```

## ユーティリティ型の自作

```typescript
// 深いPickとOmit
type DeepPick<T, K extends string> = K extends `${infer K1}.${infer K2}`
  ? K1 extends keyof T
    ? { [P in K1]: DeepPick<T[K1], K2> }
    : never
  : K extends keyof T
  ? { [P in K]: T[P] }
  : never;

type UserNameOnly = DeepPick<Config, "database.credentials.username">;

// 配列の要素型取得
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type StringArray = string[];
type Element = ArrayElement<StringArray>; // string

// 関数の戻り値型取得
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser(): Promise<User> {
  return Promise.resolve({} as User);
}

type UserPromise = ReturnTypeOf<typeof getUser>; // Promise<User>
```

## 高度なジェネリクス

```typescript
// 制約付きジェネリクス
interface Identifiable {
  id: string;
}

class EntityRepository<T extends Identifiable> {
  private entities: T[] = [];

  add(entity: T): void {
    this.entities.push(entity);
  }

  findById(id: string): T | undefined {
    return this.entities.find(entity => entity.id === id);
  }

  update(id: string, updates: Partial<Omit<T, "id">>): T | undefined {
    const entity = this.findById(id);
    if (entity) {
      Object.assign(entity, updates);
    }
    return entity;
  }
}

// 使用例
interface Product extends Identifiable {
  name: string;
  price: number;
  category: string;
}

const productRepo = new EntityRepository<Product>();
productRepo.add({ id: "1", name: "Laptop", price: 1000, category: "Electronics" });
const product = productRepo.findById("1"); // Product | undefined
```

これらの高度な型定義テクニックにより、TypeScriptの型安全性を最大限活用した堅牢なアプリケーションを構築できます。 