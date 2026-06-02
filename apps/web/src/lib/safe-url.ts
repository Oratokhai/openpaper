/**
 * URL scheme sanitizers for rendering user-authored content (article links,
 * images) in the reader and in emails. Blocks javascript:/data:/vbscript: etc.
 * which would otherwise enable stored XSS.
 */

const LINK_SCHEMES = ["http:", "https:", "mailto:"];
const IMAGE_SCHEMES = ["http:", "https:"];

function vet(raw: unknown, schemes: string[]): string {
  if (typeof raw !== "string") return "";
  const v = raw.trim();
  if (!v) return "";
  // Allow same-origin relative paths and in-page anchors.
  if (v.startsWith("/") || v.startsWith("#")) return v;
  try {
    const u = new URL(v);
    return schemes.includes(u.protocol.toLowerCase()) ? v : "";
  } catch {
    return "";
  }
}

/** Safe href for links — falls back to "#" if the scheme isn't allowed. */
export function safeHref(raw: unknown): string {
  return vet(raw, LINK_SCHEMES) || "#";
}

/** Safe image src — returns "" (caller should skip the image) if unsafe. */
export function safeImageSrc(raw: unknown): string {
  return vet(raw, IMAGE_SCHEMES);
}
