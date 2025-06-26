module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async (config) => {
    const baseUrl = process.env.SITE_URL || "http://localhost:3000";

    try {
      // Fetch all restaurants from your public API
      const restaurants = await fetch(`${baseUrl}/public_api/restaurants`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }).then((res) => res.json());

      // Generate paths for each restaurant
      const restaurantPaths = restaurants.map((restaurant) =>
        config.transform(config, `/restaurants/${restaurant.slug}`),
      );

      // Generate paths for restaurant menu pages
      const menuPaths = restaurants.map((restaurant) =>
        config.transform(config, `/restaurants/${restaurant.slug}/menu`),
      );

      return [
        await config.transform(config, "/"),
        await config.transform(config, "/restaurants"),
        ...(await Promise.all(restaurantPaths)),
        ...(await Promise.all(menuPaths)),
      ];
    } catch (error) {
      console.error("Error fetching restaurants for sitemap:", error);
      // Fallback to just the main restaurants page
      return [await config.transform(config, "/restaurants")];
    }
  },
};
