function decode(str: string) {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

/**
 * Parser en `Cookie` HTTP header verdi til et objekt
 *
 * Implementation adapted from https://gist.github.com/rendro/525bbbf85e84fa9042c2?permalink_comment_id=3084097#gistcomment-3084097
 */
export function parseCookie(cookies: string) {
  const obj = Object.create(null) as Record<string, string | undefined>;

  const list = cookies.split(";");

  for (const cookie of list) {
    if (cookie === "") {
      continue;
    }

    const eq = cookie.indexOf("=");

    const key = (eq > 0 ? cookie.slice(0, eq) : cookie).trim();
    const value = eq > 0 ? decode(cookie.slice(eq + 1).trim()) : undefined;

    if (!(key in obj)) {
      obj[key] = value;
    }
  }

  return obj;
}
