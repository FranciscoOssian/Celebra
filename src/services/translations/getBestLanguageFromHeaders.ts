import { headers } from "next/headers";
import { parseAcceptLanguage } from "./parseAcceptLanguage";

export function getBestLanguageFromHeaders() {
  const requestHeaders = headers();
  const acceptLanguage = requestHeaders.get("accept-language") || "";

  const supportedLanguages = ["en", "pt", "pt-BR"];
  const parsedLanguages = parseAcceptLanguage(acceptLanguage);

  return (
    parsedLanguages.find((lang) => supportedLanguages.includes(lang.language))
      ?.language || "en"
  );
}
