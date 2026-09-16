import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "vectis_review_admin";
export const ACCESS_COOKIE = "vectis_review_access";
const digest = (value: string) => createHash("sha256").update(value).digest("hex");

export function adminConfigured() { return Boolean(process.env.REVIEW_ADMIN_PASSWORD); }
export function validPassword(value: string) {
  const password = process.env.REVIEW_ADMIN_PASSWORD || "";
  const a = Buffer.from(digest(value)); const b = Buffer.from(digest(password));
  return Boolean(password) && timingSafeEqual(a, b);
}
export function adminCookieValue() { return digest(`vectis:${process.env.REVIEW_ADMIN_PASSWORD || ""}`); }
export async function isAdmin() { return (await cookies()).get(ADMIN_COOKIE)?.value === adminCookieValue() && adminConfigured(); }
export function accessConfigured() { return Boolean(process.env.REVIEW_ACCESS_PASSWORD); }
export function validAccessPassword(value: string) {
  const password = process.env.REVIEW_ACCESS_PASSWORD || "";
  const a = Buffer.from(digest(value)); const b = Buffer.from(digest(password));
  return Boolean(password) && timingSafeEqual(a, b);
}
export function accessCookieValue() { return digest(`vectis:review:${process.env.REVIEW_ACCESS_PASSWORD || ""}`); }
export async function isReviewer() {
  const cookieStore = await cookies();
  return (accessConfigured() && cookieStore.get(ACCESS_COOKIE)?.value === accessCookieValue()) || isAdmin();
}
