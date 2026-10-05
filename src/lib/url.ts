// The site is served from a sub-path (/website), so every internal link and
// asset must include it. Always build internal URLs with this helper.
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function url(path = "/"): string {
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
