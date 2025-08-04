import { defineCollection, z } from 'astro:content';

// ブログ記事のスキーマ定義
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    emoji: z.string().optional(),
    tags: z.array(z.string()),
    category: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// スキルカテゴリ定義
const SkillCategory = z.union([
  z.literal('frontend'),
  z.literal('backend'),
  z.literal('database'),
  z.literal('infrastructure'),
  z.literal('tools'),
  z.literal('other'),
]);

// 経歴タイプ定義
const ExperienceType = z.union([
  z.literal('work'), // 職歴
  z.literal('education'), // 学歴
  z.literal('project'), // プロジェクト
  z.literal('certification'), // 資格
]);

// ページ（About等）のスキーマ定義
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    // 基本情報
    title: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date(),

    // プロフィール情報
    profile: z.object({
      name: z.string(),
      role: z.string(),
      location: z.string().optional(),
      avatar: z.string().optional(),
      bio: z.string(),
      greeting: z.string(),
    }),

    // スキル情報
    skills: z.array(
      z.object({
        name: z.string(),
        category: SkillCategory,
        description: z.string().optional(),
        skillIcon: z.string().optional(), // Skill Icons の識別子
        color: z.string().optional(),
      })
    ),

    // 経歴情報
    experiences: z.array(
      z.object({
        type: ExperienceType,
        title: z.string(),
        organization: z.string(),
        location: z.string().optional(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        current: z.boolean().default(false),
        description: z.string(),
        technologies: z.array(z.string()).optional(),
        achievements: z.array(z.string()).optional(),
      })
    ),

    // ソーシャルリンク
    social: z
      .object({
        github: z.string().url().optional(),
        twitter: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional(),
      })
      .optional(),

    // SEO設定
    seo: z
      .object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        ogImage: z.string().optional(),
      })
      .optional(),
  }),
});

// サイト設定用のスキーマ定義
const site = defineCollection({
  type: 'data',
  schema: z.object({
    // 基本情報
    title: z.string(),
    subtitle: z.string(),
    url: z.string().url(),
    locale: z.string(),
    author: z.string(),

    // SEO設定
    seo: z.object({
      description: z.string(),
      homeDescription: z.string(),
      defaultOgImage: z.string(),
      titleSeparator: z.string(),
      siteName: z.string(),
    }),

    // ナビゲーション
    nav: z.object({
      headerTitle: z.string(),
    }),

    // ページ表示設定
    pages: z.object({
      showAbout: z.boolean(),
      showContact: z.boolean(),
    }),

    // RSS設定
    rss: z.object({
      title: z.string(),
      description: z.string(),
    }),

    // ページネーション
    pagination: z.object({
      postsPerPage: z.number(),
    }),

    // Aboutページ
    about: z.object({
      description: z.string(),
      greeting: z.string(),
    }),

    // フッター情報
    footer: z.object({
      siteName: z.string(),
      description: z.string(),
      extendedDescription: z.string(),
      copyright: z.string(),
    }),

    // ソーシャルメディア
    social: z.object({
      twitter: z.string(),
      github: z.string().url(),
    }),
  }),
});

export const collections = {
  blog,
  pages,
  site, // サイト設定コレクション
};
