import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about tapnosh - the platform connecting food lovers with amazing restaurants. Discover our mission, vision, and how we're revolutionizing the dining experience.",
  keywords: [
    "about tapnosh",
    "restaurant platform",
    "dining experience",
    "food discovery",
    "mission",
    "vision",
  ],
  openGraph: {
    title: "About Us | tapnosh",
    description:
      "Learn more about tapnosh - the platform connecting food lovers with amazing restaurants.",
    url: "https://tapnosh.com/about",
  },
  twitter: {
    title: "About Us | tapnosh",
    description:
      "Learn more about tapnosh - the platform connecting food lovers with amazing restaurants.",
  },
  alternates: {
    canonical: "https://tapnosh.com/about",
  },
};

export default function About() {
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      This is about page
    </div>
  );
}
