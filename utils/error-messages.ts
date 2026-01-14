export const ERROR_MESSAGES = {
  // Generic errors
  Required: "required.generic",

  // BuilderSchema.ts
  "Only one image is allowed": "maxItems.menuItemImage",
  "Menu group name is required": "required.menuGroupName",
  "Time from is required": "required.timeFrom",
  "Time to is required": "required.timeTo",

  // Menu.ts - Item
  "Name is required": "required.itemName",
  "Name must be less than 100 characters": "maxLength.name",
  "Amount must be provided": "required.price",
  "Amount must be a positive number": "invalid.price",

  // Create.ts (Restaurant) - Address
  "Address is required": "required.address",
  "Invalid address selected. Please select a different address with complete details.":
    "invalid.address",
  "Street number is required": "required.streetNumber",
  "Street is required": "required.street",
  "City is required": "required.city",
  "State is required": "required.state",
  "Country is required": "required.country",
  "Country code is required": "required.countryCode",
  "Postal code is required": "required.postalCode",

  // Create.ts (Restaurant) - Basic Info
  "Restaurant name is required": "required.restaurantName",
  "Description must be at least 10 characters": "minLength.description",
  "Description must be less than 250 characters": "maxLength.description",
  "Theme color is required": "required.theme",
  "Theme ID must be a valid UUID format": "invalid.theme",

  // Create.ts (Restaurant) - Images & Categories
  "At least one image must be added": "required.restaurantImages",
  "You can upload up to 5 images": "maxItems.restaurantImages",
  "At least one cuisine must be selected": "required.cuisines",
  "You can select up to 5 cuisines": "maxItems.cuisines",

  // Create.ts (Restaurant) - URLs
  "Please enter a valid URL": "invalid.url",
  "Price range is required": "required.priceRange",

  // Create.ts (Theme)
  "Invalid color format. Must be a 7-character hex code (e.g., #RRGGBB).":
    "invalid.colorFormat",
} as const;
