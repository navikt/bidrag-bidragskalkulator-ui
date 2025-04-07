import { Button, Heading, Select, TextField } from "@navikt/ds-react";
import { useField, type FormApi } from "@rvf/react";
import { Slider } from "~/components/ui/slider";
import { useDebounceCallback } from "~/hooks/useDebounceCallback";
import { cn } from "~/lib/utils";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
type BarnFormProps = {
  barn: FormApi<{
    alder: string;
    bostatus: string;
    samværsgrad: string;
  }>;
  index: number;
  kanFjernes: boolean;
  onFjern: () => void;
};

export function BarnForm({ barn, index, kanFjernes, onFjern }: BarnFormProps) {
  const { t } = useOversettelse();
  const sporSamværsgrad = useDebounceCallback((value: string) => {
    sporHendelse("samværsgrad justert", {
      samværsgrad: value,
    });
  }, 4000);

  const samværsgrad = Number(barn.field("samværsgrad").value());
  const samværsgradBeskrivelse =
    samværsgrad === 1 ? t(tekster.enNatt) : t(tekster.netter(samværsgrad));
  const barnNummer = index + 1;

  const samværsgradField = useField(barn.scope("samværsgrad"), {
    validationBehavior: {
      initial: "onChange",
      whenTouched: "onChange",
      whenSubmitted: "onChange",
    },
  });

  return (
    <div className="border p-4 rounded-md space-y-4 focus:outline-none focus-visible:outline-1">
      <Heading
        size="small"
        level="2"
        className={cn({ "sr-only": !kanFjernes })}
        id={`barn-${barnNummer}-heading`}
      >
        {t(tekster.barn)} {barnNummer}
      </Heading>
      <TextField
        {...barn.field("alder").getInputProps()}
        label={t(tekster.barnetsAlder)}
        error={barn.field("alder").error()}
        aria-describedby={`barn-${barnNummer}-heading`}
        inputMode="numeric"
        autoComplete="off"
        htmlSize={5}
      />

      <Select
        {...barn.field("bostatus").getInputProps()}
        error={barn.field("bostatus").error()}
        label={t(tekster.bostatus.label)}
      >
        <option value="" disabled>
          {t(tekster.bostatus.valg.velg)}
        </option>
        <option value="HOS_FORELDER_1">
          {t(tekster.bostatus.valg.hosDeg)}
        </option>
        <option value="DELT_BOSTED">
          {t(tekster.bostatus.valg.deltBosted)}
        </option>
        <option value="HOS_FORELDER_2">
          {t(tekster.bostatus.valg.hosDenAndre)}
        </option>
      </Select>

      {["HOS_FORELDER_1", "HOS_FORELDER_2"].includes(
        barn.field("bostatus").value()
      ) && (
        <Slider
          {...samværsgradField.getControlProps()}
          onChange={(value) => {
            samværsgradField.onChange(value);
            sporSamværsgrad(value);
          }}
          label={t(tekster.samværsgradLabel)}
          description={t(tekster.samværsgradBeskrivelse)}
          error={barn.field("samværsgrad").error()}
          min={0}
          max={30}
          step={1}
          list={[
            { label: t(tekster.samværsgrader.ingenNetterHosDeg), value: 0 },
            {
              label: t(tekster.samværsgrader.halvpartenAvTidenHosDeg),
              value: 15,
            },
            { label: t(tekster.samværsgrader.alleNetterHosDeg), value: 30 },
          ]}
          valueDescription={samværsgradBeskrivelse}
        />
      )}

      {kanFjernes && (
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={onFjern}
          aria-label={`${t(tekster.fjernBarn)} ${barnNummer}`}
        >
          {t(tekster.fjernBarn)}
        </Button>
      )}
    </div>
  );
}

const tekster = definerTekster({
  barn: {
    nb: "Barn",
    en: "Child",
    nn: "Barn",
  },
  fjernBarn: {
    nb: "Fjern barn",
    en: "Remove child",
    nn: "Fjern barn",
  },
  barnetsAlder: {
    nb: "Barnets alder",
    en: "Child's age",
    nn: "Barnets alder",
  },
  bostatus: {
    label: {
      nb: "Hvor skal barnet bo fast?",
      en: "Where will the child have a permanent address?",
      nn: "Kvar skal barnet bo fast?",
    },
    valg: {
      velg: {
        nb: "Velg hvor barnet skal bo",
        en: "Select where the child will live",
        nn: "Velg kvar barnet skal bo",
      },
      hosDeg: {
        nb: "Barnet bor hos deg",
        en: "The child lives with you",
        nn: "Barnet bor hos deg",
      },
      deltBosted: {
        nb: "Vi har avtale om delt bosted",
        en: "We have an agreement on shared custody",
        nn: "Vi har avtale om delt bosted",
      },
      hosDenAndre: {
        nb: "Barnet bor hos den andre forelderen",
        en: "The child lives with the other parent",
        nn: "Barnet bor hos den andre forelderen",
      },
    },
  },
  samværsgradLabel: {
    nb: "Hvor mye vil barnet være sammen med deg?",
    en: "How much will the child stay with you?",
    nn: "Kor mykje vil barnet være saman med deg?",
  },
  samværsgradBeskrivelse: {
    nb: "Estimér hvor mange netter barnet vil være hos deg i snitt per måned",
    en: "Estimate how many nights the child will stay with you on average per month",
    nn: "Estimér kor mange netter barnet vil være hos deg i snitt per måned",
  },
  netter: (antall) => ({
    nb: `${antall} netter`,
    en: `${antall} nights`,
    nn: `${antall} netter`,
  }),
  enNatt: {
    nb: "1 natt",
    en: "1 night",
    nn: "1 natt",
  },
  samværsgrader: {
    ingenNetterHosDeg: {
      nb: "Ingen netter hos deg",
      en: "No nights with you",
      nn: "Ingen netter hos deg",
    },
    halvpartenAvTidenHosDeg: {
      nb: "Halvparten av tiden hos deg",
      en: "Half the nights with you",
      nn: "Halvparten av tiden hos deg",
    },
    alleNetterHosDeg: {
      nb: "Alle netter hos deg",
      en: "All the nights with you",
      nn: "Alle netter hos deg",
    },
  },
});
