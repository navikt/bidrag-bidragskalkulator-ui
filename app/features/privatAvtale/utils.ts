import type { PrivatAvtaleSpørsmålId } from "~/types/analyse";
import { sporHendelse } from "~/utils/analytics";

export const sporPrivatAvtaleSpørsmålBesvart =
  (spørsmålId: PrivatAvtaleSpørsmålId, spørsmål: string) =>
  (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (event.target.value) {
      sporHendelse({
        hendelsetype: "skjema spørsmål besvart",
        skjemaId: "barnebidrag-privat-avtale-under-18",
        spørsmålId,
        spørsmål,
      });
    }
  };
