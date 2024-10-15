export function translate(
  defaultLang: string,
  lang: string,
  key: string,
  translations: { [key: string]: { [key: string]: string } }
): string {
  // Return the key if the current language is the default language
  if (lang === defaultLang || !(lang in translations)) {
    return key; // Or some fallback, if preferred
  }

  // Return the translation or the key if not found
  return translations[lang][key] ?? key;
}

// Higher-order function to get translation function based on provided translations
export const getTranslation =
  (
    bestLanguage: string,
    translations: { [key: string]: { [key: string]: string } }
  ) =>
  (strings: TemplateStringsArray, ...values: string[]): string => {
    // Build the final string with additional values
    const finalString = strings.reduce((acc, curr, index) => {
      return acc + curr + (values[index] || ""); // Append the value if it exists
    }, "");

    // Get the translation of the final string
    const translatedValue = translate(
      "en",
      bestLanguage,
      finalString,
      translations
    );

    return translatedValue; // Return the translated string
  };
