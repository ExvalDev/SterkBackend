import i18next from "i18next";
import Backend from "i18next-fs-backend";

i18next.use(Backend).init({
  fallbackLng: "en",
  preload: ["en", "de"],
  backend: {
    loadPath: "./src/lang/{{lng}}.json",
  },
});

export default i18next;
