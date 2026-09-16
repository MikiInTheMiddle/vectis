import { neon } from "@neondatabase/serverless";

export type StoredReply = { id: string; author: string; body: string; createdAt: string };
export type StoredComment = {
  id: string; path: string; anchor: string; label: string; quote?: string;
  author: string; body: string; createdAt: string; resolved: boolean; replies: StoredReply[];
};

function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
}

export function hasDatabase() { return Boolean(databaseUrl()); }

function client() {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_NOT_CONFIGURED");
  return neon(url);
}

export async function ensureReviewTable() {
  const sql = client();
  await sql`CREATE TABLE IF NOT EXISTS review_comments (
    id TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    anchor TEXT NOT NULL,
    label TEXT NOT NULL,
    quote TEXT,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    replies JSONB NOT NULL DEFAULT '[]'::jsonb
  )`;
  await sql`CREATE INDEX IF NOT EXISTS review_comments_path_idx ON review_comments(path)`;
  await sql`CREATE TABLE IF NOT EXISTS review_comment_deletions (
    id TEXT PRIMARY KEY,
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}

function mapRow(row: Record<string, unknown>): StoredComment {
  return {
    id: String(row.id), path: String(row.path), anchor: String(row.anchor), label: String(row.label),
    quote: row.quote ? String(row.quote) : undefined, author: String(row.author), body: String(row.body),
    createdAt: new Date(String(row.created_at)).toISOString(), resolved: Boolean(row.resolved),
    replies: Array.isArray(row.replies) ? row.replies as StoredReply[] : [],
  };
}

export async function listComments(path?: string) {
  await ensureReviewTable();
  const sql = client();
  const rows = path
    ? await sql`SELECT * FROM review_comments WHERE path = ${path} ORDER BY created_at ASC`
    : await sql`SELECT * FROM review_comments ORDER BY created_at DESC`;
  return rows.map((row) => mapRow(row as Record<string, unknown>));
}

export async function insertComment(comment: StoredComment) {
  await ensureReviewTable();
  const sql = client();
  const replies = JSON.stringify(comment.replies || []);
  await sql`INSERT INTO review_comments (id,path,anchor,label,quote,author,body,created_at,resolved,replies)
    SELECT ${comment.id},${comment.path},${comment.anchor},${comment.label},${comment.quote || null},${comment.author},${comment.body},${comment.createdAt},${comment.resolved},${replies}::jsonb
    WHERE NOT EXISTS (SELECT 1 FROM review_comment_deletions WHERE id=${comment.id})
    ON CONFLICT (id) DO NOTHING`;
  return comment;
}

export async function updateComment(id: string, resolved: boolean, replies: StoredReply[]) {
  await ensureReviewTable();
  const sql = client();
  const encoded = JSON.stringify(replies);
  const rows = await sql`UPDATE review_comments SET resolved=${resolved}, replies=${encoded}::jsonb WHERE id=${id} RETURNING *`;
  return rows[0] ? mapRow(rows[0] as Record<string, unknown>) : null;
}

export async function appendCommentReply(id: string, reply: StoredReply) {
  await ensureReviewTable();
  const sql = client();
  const encoded = JSON.stringify([reply]);
  const rows = await sql`UPDATE review_comments SET replies=replies || ${encoded}::jsonb WHERE id=${id} RETURNING *`;
  return rows[0] ? mapRow(rows[0] as Record<string, unknown>) : null;
}

export async function deleteComment(id: string) {
  await ensureReviewTable();
  const sql = client();
  await sql`INSERT INTO review_comment_deletions (id) VALUES (${id}) ON CONFLICT (id) DO NOTHING`;
  await sql`DELETE FROM review_comments WHERE id=${id}`;
}
