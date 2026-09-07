import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vectislegal.eu"),
  title: { default: "Vectis — Content Wireframe", template: "%s | Vectis Wireframe" },
  description: "Vectis è lo studio legale AI-first per il mondo corporate. Tecnologia, metodo e giudizio professionale per decisioni migliori.",
  icons: { icon: "/favicon.png" },
  openGraph: { title: "Vectis — Intelligence with judgment", description: "Lo studio legale AI-first per il mondo corporate.", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Vectis — Intelligence with judgment", description: "Lo studio legale AI-first per il mondo corporate.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="it"><body><div className="wireframeStamp">CONTENT WIREFRAME <span>UI TO BE DESIGNED</span></div>{children}</body></html>; }
