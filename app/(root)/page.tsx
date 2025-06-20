import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, ChefHat, Utensils } from "lucide-react";
import { RestaurantList } from "@/components/restaurant/restaurant-list";

export default function RestaurantLanding() {
  return (
    <>
      {/* Hero Section */}
      <section className="section section-primary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Discover Amazing Restaurants Near You
                </h1>
                <p className="text-primary-foreground/80 text-lg md:text-xl">
                  Join our platform to explore the best dining experiences in
                  your city. Restaurant owners can showcase their venues and
                  connect with food lovers.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/restaurants/add"> List Your Restaurant</Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/restaurants">Browse Restaurants</Link>
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
              Why tapnosh?
            </h2>
            <p className="text-muted-foreground max-w-2xl text-xl">
              Whether you&apos;re a food lover or restaurant owner, we provide
              the tools and community to enhance your dining experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Utensils className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold">Discover Great Food</h3>
              <p className="text-muted-foreground">
                Browse through hundreds of restaurants with detailed menus,
                photos, and authentic reviews from fellow diners.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <ChefHat className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">For Restaurant Owners</h3>
              <p className="text-muted-foreground">
                Showcase your restaurant with beautiful photos, manage your
                menu, and connect with customers in your area.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Community Driven</h3>
              <p className="text-muted-foreground">
                Join a community of food enthusiasts sharing honest reviews and
                discovering hidden culinary gems together.
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
              Featured Restaurants
            </h2>
            <p className="text-muted-foreground text-xl">
              Explore some of the amazing restaurants already on our platform
            </p>
          </div>

          <RestaurantList />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-16 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="">
              <h3 className="font-logo text-lg font-semibold">tapnosh</h3>
              <p className="text-primary-foreground/80">
                Connecting food lovers with amazing restaurants in their
                community.
              </p>
            </div>
          </div>
          <div className="text-primary-foreground/80 border-primary-foreground/50 mt-8 border-t pt-8 text-center">
            <p>&copy; 2025 tapnosh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
