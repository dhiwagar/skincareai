import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../src/index.css";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://skin.chat"),
  title: "Skincare AI | AI Skin Analysis and Personalized Routine",
  description:
    "Scan your face with Skincare AI to identify acne, dark spots, oiliness, dryness, and get a personalized AM/PM skincare routine.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Skincare AI",
    title: "Skincare AI | AI Skin Analysis and Personalized Routine",
    description:
      "Scan your face with Skincare AI to identify acne, dark spots, oiliness, dryness, and get a personalized AM/PM skincare routine.",
    url: "/",
  },
  twitter: {
    title: "Skincare AI | AI Skin Analysis and Personalized Routine",
    description:
      "Scan your face with Skincare AI to identify acne, dark spots, oiliness, dryness, and get a personalized AM/PM skincare routine.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
