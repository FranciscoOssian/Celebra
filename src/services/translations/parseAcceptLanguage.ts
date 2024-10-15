export function parseAcceptLanguage(acceptLanguage: string) {
  return acceptLanguage
    .split(",")
    .map((lang) => {
      const [language, quality] = lang.split(";");
      return {
        language: language.trim(),
        quality: quality ? parseFloat(quality.split("=")[1]) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);
}
