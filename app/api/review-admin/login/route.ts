import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfigured, adminCookieValue, validPassword } from "@/lib/review-auth";

export async function POST(request: NextRequest) {
  if (!adminConfigured()) return NextResponse.json({ error: "Admin non configurato" }, { status: 503 });
  const { password } = await request.json() as { password?: string };
  if (!password || !validPassword(password)) return NextResponse.json({ error: "Password non valida" }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminCookieValue(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 12 });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
