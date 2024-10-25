/**
 * Middleware to add Content Security Policy headers to matched requests.
 */

import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Exceptions:
     * /api/auth, /api/webhooks, /api/proxy_route, /api/gdpr, /_next,
     * /_proxy, /_auth, /_static, /_vercel, /public (/favicon.ico, etc)
     */
    "/((?!api/auth|api/webhooks|api/proxy_route|api/gdpr|_next|_proxy|_auth|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export function middleware(request: NextRequest) {
  const {
    nextUrl: { search },
  } = request;

  const urlSearchParams = new URLSearchParams(search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const shop = params.shop || "*.myshopify.com";

  const res = NextResponse.next();
  res.headers.set(
    "Content-Security-Policy",
    `frame-ancestors https://${shop} https://admin.shopify.com;`
  );

  return res;
}