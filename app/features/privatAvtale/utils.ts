import { sporHendelse } from "~/utils/analytics";

export const sporPrivatAvtaleSpørsmålBesvart =
  (spørsmål: string) =>
  (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.value) {
      sporHendelse({
        hendelsetype: "skjema spørsmål besvart",
        skjemaId: "barnebidrag-privat-avtale-under-18",
        spørsmålId: event.target.name,
        spørsmål,
      });
    }
  };
