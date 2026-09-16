import { NextRequest, NextResponse } from "next/server";
import { appendCommentReply, deleteComment, hasDatabase, insertComment, listComments, StoredComment, updateComment } from "@/lib/review-db";
import { isAdmin, isReviewer } from "@/lib/review-auth";

export const dynamic = "force-dynamic";
const unavailable = () => NextResponse.json({ configured: false, comments: [] }, { status: 503 });

export async function GET(request: NextRequest) {
  if (!hasDatabase()) return unavailable();
  const all = request.nextUrl.searchParams.get("all") === "1";
  if (all && !(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!all && !(await isReviewer())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const path = all ? undefined : request.nextUrl.searchParams.get("path") || "/";
  return NextResponse.json({ configured: true, comments: await listComments(path) });
}

export async function POST(request: NextRequest) {
  if (!hasDatabase()) return unavailable();
  if (!(await isReviewer())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const value = await request.json() as StoredComment;
  if (!value.id || !value.path || !value.anchor || !value.author?.trim() || !value.body?.trim()) return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
  const comment: StoredComment = { ...value, author: value.author.trim().slice(0, 80), body: value.body.trim().slice(0, 4000), quote: value.quote?.slice(0, 600), replies: [], resolved: false };
  return NextResponse.json({ configured: true, comment: await insertComment(comment) }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!hasDatabase()) return unavailable();
  const admin = await isAdmin();
  if (!admin && !(await isReviewer())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const value = await request.json() as { id: string; resolved: boolean; replies: StoredComment["replies"] };
  if (!value.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const comment = admin
    ? await updateComment(value.id, Boolean(value.resolved), value.replies || [])
    : value.replies?.length ? await appendCommentReply(value.id, value.replies[value.replies.length - 1]) : null;
  return NextResponse.json({ configured: true, comment });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteComment(id);
  return NextResponse.json({ ok: true });
}
