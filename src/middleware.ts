import { NextResponse, NextRequest } from "next/server";
import { getBestLanguageFromHeaders } from "./services/translations/getBestLanguageFromHeaders";
import { supportedLanguages } from "./services/translations";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    supportedLanguages.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )
  ) {
    return NextResponse.next();
  }

  const locale = getBestLanguageFromHeaders();

  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: "/((?!_next|api).*)", // Match all paths except for internal Next.js paths and API routes
};
