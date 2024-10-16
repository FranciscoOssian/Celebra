import { defaultLang, translations as translationsObj } from "./index";

export function translate(
  defaultLang: string,
  lang: string,
  key: string,
  translations: { [key: string]: { [key: string]: string } }
): string {
  if (lang === defaultLang || !(lang in translations)) {
    return key;
  }
  return translations[lang][key] ?? key;
}

export const getTranslations = (
  bestLanguage: string,
  translations: typeof translationsObj
) => {
  type TranslationKeys =
    | keyof (typeof translationsObj)["pt-BR"]
    | (string & {});

  return (s: TranslationKeys) => {
    const translatedValue = translate(
      defaultLang,
      bestLanguage,
      s,
      translations
    );

    return translatedValue;
  };
};
