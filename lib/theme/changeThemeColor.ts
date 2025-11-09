export const changeThemeColor = (color: string) => {
  let themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
  if (themeColorMetaTag) {
    themeColorMetaTag.setAttribute("content", color);
  } else {
    themeColorMetaTag = document.createElement("meta");
    themeColorMetaTag.setAttribute("name", "theme-color");
    themeColorMetaTag.setAttribute("content", color);
    document.head.appendChild(themeColorMetaTag);
  }
};
