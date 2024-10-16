import { headers } from "next/headers";
import { parseAcceptLanguage } from "./parseAcceptLanguage";
import { defaultLang, supportedLanguages } from ".";

export function getBestLanguageFromHeaders() {
  const requestHeaders = headers();
  const acceptLanguage = requestHeaders.get("accept-language") || "";

  const parsedLanguages = parseAcceptLanguage(acceptLanguage);

  return (
    parsedLanguages.find((lang) => supportedLanguages.includes(lang.language))
      ?.language || defaultLang
  );
}
