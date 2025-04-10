/**
 * Kopierer tekst til utklippstavle.
 *
 * @param tekst Tekst som skal kopieres til utklippstavle.
 */
export async function kopierTilUtklippstavle(
  tekst: string
): Promise<void> {
  try {
    await navigator.clipboard.writeText(tekst);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Kunne ikke kopiere til utklippstavle med Clipboard APIet",
        err
      );
    }

    // Fallback for når Clipboard APIet ikke fungerer eller eksisterer
    const kopierTast = /mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl";
    const melding = `Kopier til utklippstavle: ${kopierTast}+C, Enter`;
    window.prompt(melding, tekst);
  }
}
