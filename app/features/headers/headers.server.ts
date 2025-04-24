import type { Språk } from "~/utils/i18n";
import { lagCspHeader } from "./csp.server";

export async function lagHeaders(språk: Språk) {
  const cspHeader = await lagCspHeader();
  return {
    // Sikkerhetsheaders
    "Content-Security-Policy": cspHeader,
    "Referrer-Policy": "same-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), display-capture=(), fullscreen=(), usb=(), screen-wake-lock=(), clipboard-read=self, clipboard-write=self",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "credentialless",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-Permitted-Cross-Domain-Policies": "none",
    "X-Content-Type-Options": "nosniff",

    // Andre headers
    "Cache-Control": "max-age=60, stale-while-revalidate=86400",
    "Content-Language": språk,
    "Accept-CH":
      "Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Arch, Sec-CH-Prefers-Color-Scheme",
    Vary: "Accept-Encoding, Accept-Language",
    "X-DNS-Prefetch-Control": "on",
    NEL: '{"report_to":"default","max_age":31536000,"include_subdomains":true}',
  };
}
