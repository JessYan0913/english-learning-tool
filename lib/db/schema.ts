import type { InferSelectModel } from 'drizzle-orm';
import { index, pgTable, timestamp, uuid, varchar, boolean, integer, decimal } from 'drizzle-orm/pg-core';

export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const document = pgTable(
  'Document',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    content: varchar('content', { length: 65535 }), // 支持长文本
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    metadata: varchar('metadata', { length: 8192 }), // JSON 格式元数据，如 { "author": "...", "category": "..." }
  },
  (table) => [index('document_user_idx').on(table.userId), index('document_created_at_idx').on(table.createdAt)]
);

export type Document = InferSelectModel<typeof document>;

// 知识点表结构
export const knowledgePoint = pgTable(
  'KnowledgePoint',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 1024 }),
    documentId: uuid('document_id').references(() => document.id, { onDelete: 'set null' }), // 知识点可选关联文档
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('knowledge_point_title_idx').on(table.title)]
);

export type KnowledgePoint = InferSelectModel<typeof knowledgePoint>;

// 用户学习进度表结构
export const userProgress = pgTable(
  'UserProgress',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    knowledgePointId: uuid('knowledge_point_id')
      .notNull()
      .references(() => knowledgePoint.id, { onDelete: 'cascade' }),
    masteryLevel: varchar('mastery_level', { length: 50 }).notNull(), // 如 'beginner', 'intermediate', 'advanced'
    totalAttempts: integer('total_attempts').notNull().default(0), // 总尝试次数
    correctAttempts: integer('correct_attempts').notNull().default(0), // 正确次数
    averageScore: decimal('average_score', { precision: 5, scale: 2 }).notNull().default('0.00'), // 平均分数
    lastReviewedAt: timestamp('last_reviewed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('user_progress_user_kp_idx').on(table.userId, table.knowledgePointId),
    index('user_progress_mastery_idx').on(table.masteryLevel),
  ]
);

export type UserProgress = InferSelectModel<typeof userProgress>;

// 用户练习记录表
export const userExerciseAttempt = pgTable(
  'UserExerciseAttempt',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    knowledgePointId: uuid('knowledge_point_id')
      .notNull()
      .references(() => knowledgePoint.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 50 }).notNull(), // 'multiple_choice', 'fill_blank', 'translation'
    question: varchar('question', { length: 2048 }).notNull(),
    options: varchar('options', { length: 4096 }), // JSON格式存储选项
    correctAnswer: varchar('correct_answer', { length: 1024 }).notNull(),
    explanation: varchar('explanation', { length: 2048 }),
    difficulty: varchar('difficulty', { length: 20 }).notNull(), // 'easy', 'medium', 'hard'
    userAnswer: varchar('user_answer', { length: 1024 }),
    isCorrect: boolean('is_correct').notNull(),
    timeSpent: integer('time_spent'), // 练习用时（秒）
    attemptedAt: timestamp('attempted_at').notNull().defaultNow(),
  },
  (table) => [
    index('user_exercise_user_idx').on(table.userId),
    index('user_exercise_kp_idx').on(table.knowledgePointId),
  ]
);

export type UserExerciseAttempt = InferSelectModel<typeof userExerciseAttempt>;

// 文档学习进度表
export const userDocumentProgress = pgTable(
  'UserDocumentProgress',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    documentId: uuid('document_id')
      .notNull()
      .references(() => document.id, { onDelete: 'cascade' }),
    totalKnowledgePoints: integer('total_knowledge_points').notNull(),
    completedKnowledgePoints: integer('completed_knowledge_points').notNull().default(0),
    progressPercentage: decimal('progress_percentage', { precision: 5, scale: 2 }).notNull().default('0.00'),
    lastAccessedAt: timestamp('last_accessed_at').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [index('user_doc_progress_user_doc_idx').on(table.userId, table.documentId)]
);

export type UserDocumentProgress = InferSelectModel<typeof userDocumentProgress>;
