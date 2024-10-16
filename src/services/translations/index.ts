export * from "./translations";
export * from "./parseAcceptLanguage";

import translationsJSON from "./translations.json";

export const translations: typeof translationsJSON = translationsJSON;

export const supportedLanguages = ["en", "pt-BR"],
  defaultLang = "en";
