import type { Metadata } from "next";
import ReviewAdmin from "./review-admin";

export const metadata: Metadata = { title: "Review Admin", robots: { index: false, follow: false } };
export default function ReviewAdminPage() { return <ReviewAdmin />; }
