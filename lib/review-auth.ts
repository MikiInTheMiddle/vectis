import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "vectis_review_admin";
const digest = (value: string) => createHash("sha256").update(value).digest("hex");

export function adminConfigured() { return Boolean(process.env.REVIEW_ADMIN_PASSWORD); }
export function validPassword(value: string) {
  const password = process.env.REVIEW_ADMIN_PASSWORD || "";
  const a = Buffer.from(digest(value)); const b = Buffer.from(digest(password));
  return Boolean(password) && timingSafeEqual(a, b);
}
export function adminCookieValue() { return digest(`vectis:${process.env.REVIEW_ADMIN_PASSWORD || ""}`); }
export async function isAdmin() { return (await cookies()).get(ADMIN_COOKIE)?.value === adminCookieValue() && adminConfigured(); }
