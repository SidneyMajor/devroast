import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const languageEnum = pgEnum("language", [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "sql",
  "html",
  "css",
  "swift",
  "kotlin",
  "c",
  "cpp",
  "other",
]);

export const severityEnum = pgEnum("severity", [
  "critical",
  "warning",
  "good",
  "verdict",
]);

export const diffTypeEnum = pgEnum("diff_type", [
  "added",
  "removed",
  "context",
]);

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  language: varchar("language", { length: 50 }).notNull().default("javascript"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roasts = pgTable("roasts", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id),
  feedback: text("feedback").notNull(),
  score: decimal("score", { precision: 3, scale: 2 }).notNull(),
  roastMode: boolean("roast_mode").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const issues = pgTable("issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  roastId: uuid("roast_id")
    .notNull()
    .references(() => roasts.id),
  severity: severityEnum("severity").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const diffs = pgTable("diffs", {
  id: uuid("id").defaultRandom().primaryKey(),
  roastId: uuid("roast_id")
    .notNull()
    .references(() => roasts.id),
  diffType: diffTypeEnum("diff_type").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const stats = pgTable("stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  totalSubmissions: decimal("total_submissions", { precision: 10, scale: 0 })
    .notNull()
    .default("0"),
  avgScore: decimal("avg_score", { precision: 3, scale: 2 }).notNull().default("0"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
export type Diff = typeof diffs.$inferSelect;
export type NewDiff = typeof diffs.$inferInsert;
export type Stats = typeof stats.$inferSelect;
export type NewStats = typeof stats.$inferInsert;
