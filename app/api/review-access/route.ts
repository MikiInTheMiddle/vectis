import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, accessConfigured, accessCookieValue, isReviewer, validAccessPassword } from "@/lib/review-auth";

export async function GET() {
  return NextResponse.json({ configured: accessConfigured(), unlocked: await isReviewer() });
}

export async function POST(request: NextRequest) {
  if (!accessConfigured()) return NextResponse.json({ error: "Accesso review non configurato" }, { status: 503 });
  const { password } = await request.json() as { password?: string };
  if (!password || !validAccessPassword(password)) return NextResponse.json({ error: "Password non valida" }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, accessCookieValue(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
