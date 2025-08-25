/**
 * Formatterer et fødselsnummer i bolker på 6+5
 *
 * @example
 * ```tsx
 * formatterFødselsnummer("12345678901")
 * // -> "123456 78901"
 */
export const formatterFødselsnummer = (fnr?: string) => {
  if (!fnr) {
    return "";
  }
  if (fnr.length !== 11) {
    return fnr;
  }
  return fnr.replace(/(\d{6})(\d{5})/, "$1 $2");
};
