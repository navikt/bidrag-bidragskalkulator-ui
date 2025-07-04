export const erResponse = (resultat: unknown): resultat is Response => {
  return (
    resultat instanceof Response ||
    (!!resultat &&
      typeof resultat === "object" &&
      "headers" in resultat &&
      "status" in resultat)
  );
};
