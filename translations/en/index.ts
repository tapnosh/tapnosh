import categories from "./categories.json";
import common from "./common.json";
import home from "./home.json";
import dashboard from "./management/dashboard.json";
import pageBuilder from "./management/page-builder.json";
import scannableMenu from "./management/scannable-menu.json";
import settings from "./management/settings.json";
import map from "./map.json";
import navigation from "./navigation.json";
import restaurantBrowse from "./restaurants/browse.json";
import restaurantDetails from "./restaurants/details.json";
import restaurantFormErrors from "./restaurants/form/errors.json";
import restaurantFormFields from "./restaurants/form/fields.json";
import restaurantLists from "./restaurants/lists.json";

const en = {
  categories,
  common,
  home,
  navigation,
  map,

  management: {
    pageBuilder,
    scannableMenu,
    settings,
    dashboard,
  },

  restaurants: {
    browse: restaurantBrowse,
    details: restaurantDetails,
    lists: restaurantLists,
    form: {
      errors: restaurantFormErrors,
      fields: restaurantFormFields,
    },
  },
};

export default en;
