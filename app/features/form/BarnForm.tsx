import { Button, Heading } from "@navikt/ds-react";
import type { FormApi } from "@rvf/react";
import { Slider } from "~/components/ui/slider";
import { useDebounceCallback } from "~/hooks/useDebounceCallback";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "./FormattertTallTextField";
type BarnFormProps = {
  item: FormApi<{ alder: string; samværsgrad: string }>;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
};

export function BarnForm({ item, index, canRemove, onRemove }: BarnFormProps) {
  const { t } = useOversettelse();
  const sporSamværsgrad = useDebounceCallback((value: string) => {
    sporHendelse("samværsgrad justert", {
      samværsgrad: value,
    });
  }, 4000);

  const samværsgrad = Number(item.field("samværsgrad").value());
  const samværsgradBeskrivelse =
    samværsgrad === 1 ? t(tekster.enNatt) : t(tekster.netter(samværsgrad));

  return (
    <div className="border p-4 rounded-md space-y-4">
      {canRemove && (
        <Heading size="small" level="2">
          {t(tekster.barn)} {index + 1}
        </Heading>
      )}
      <div className="flex gap-4">
        <FormattertTallTextField
          {...item.field("alder").getControlProps()}
          label={t(tekster.barnetsAlder)}
          error={item.field("alder").error()}
        />
      </div>

      <Slider
        {...item.field("samværsgrad").getControlProps()}
        onChange={(value) => {
          item.field("samværsgrad").onChange(value);
          sporSamværsgrad(value);
        }}
        label={t(tekster.samværsgradLabel)}
        description={t(tekster.samværsgradBeskrivelse)}
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

      {canRemove && (
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={onRemove}
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
  samværsgradLabel: {
    nb: "Hvor mye vil barnet bo sammen med deg?",
    en: "How much will the child live with you?",
    nn: "Kor mykje vil barnet bo saman med deg?",
  },
  samværsgradBeskrivelse: {
    nb: "Estimér hvor mange netter barnet vil bo sammen med deg i snitt per måned",
    en: "Estimate how many nights the child will live with you on average per month",
    nn: "Estimér kor mange netter barnet vil bo saman med deg i snitt per måned",
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
