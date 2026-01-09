// CHANGED: Added generateMetadata for i18n translations
import { Users, ChefHat, Utensils } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/forms/button";
import { RestaurantList } from "@/features/restaurant/restaurant-list";
import { Link } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home.page");

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: `${t("title")} | tapnosh`,
      description: t("ogDescription"),
      url: "https://tapnosh.com",
    },
    twitter: {
      title: `${t("title")} | tapnosh`,
      description: t("ogDescription"),
    },
    alternates: {
      canonical: "https://tapnosh.com",
    },
  };
}

export default function RestaurantLanding() {
  const t = useTranslations("home");
  const tFooter = useTranslations("common.footer");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "tapnosh",
    description:
      "Discover amazing restaurants near you. Join our platform to explore the best dining experiences in your city.",
    url: "https://tapnosh.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://tapnosh.com/restaurants?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "Organization",
      name: "tapnosh",
      description: "A platform connecting food lovers with amazing restaurants",
      url: "https://tapnosh.com",
      logo: "https://tapnosh.com/images/logo.png",
      sameAs: [
        "https://twitter.com/tapnosh",
        "https://facebook.com/tapnosh",
        "https://instagram.com/tapnosh",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        availableLanguage: "English",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="section section-primary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  {t("hero.title")}
                </h1>
                <p className="text-primary-foreground/80 text-lg md:text-xl">
                  {t("hero.subtitle")}
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/restaurants/add">
                    {" "}
                    {t("hero.cta.listYourRestaurant")}{" "}
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/restaurants">
                    {t("hero.cta.browseRestaurants")}{" "}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section mt-12 mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("why.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl text-xl">
              {t("why.subtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Utensils className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold">
                {t("why.cards.discover.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("why.cards.discover.text")}
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <ChefHat className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">
                {t("why.cards.owners.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("why.cards.owners.text")}
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">
                {t("why.cards.community.title")}
              </h3>
              <p className="text-muted-foreground">
                {t("why.cards.community.text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Listings Section */}
      <section className="section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("featured.title")}
            </h2>
            <p className="text-muted-foreground text-xl">
              {t("featured.subtitle")}
            </p>
          </div>

          <RestaurantList />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-16 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-xs gap-8">
            <h3 className="font-logo text-2xl font-semibold">tapnosh</h3>
            <p className="text-primary-foreground/80 text-sm">
              {tFooter("description")}
            </p>
          </div>
          <div className="text-primary-foreground/80 mt-4 text-center text-sm">
            &copy; {new Date().getFullYear()} tapnosh. {tFooter("copyright")}
          </div>
        </div>
      </footer>
    </>
  );
}
