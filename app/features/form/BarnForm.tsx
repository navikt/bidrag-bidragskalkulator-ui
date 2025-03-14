import { Button, Heading } from "@navikt/ds-react";
import type { FormApi } from "@rvf/react";
import { Slider } from "~/components/ui/slider";
import { useDebounceCallback } from "~/hooks/useDebounceCallback";
import { sporHendelse } from "~/utils/analytics";
import { FormattertTallTextField } from "./FormattertTallTextField";
import { lagSamværsgradbeskrivelse } from "./utils";

type BarnFormProps = {
  item: FormApi<{ alder: string; samværsgrad: string }>;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
};

export function BarnForm({ item, index, canRemove, onRemove }: BarnFormProps) {
  const sporSamværsgrad = useDebounceCallback((value: string) => {
    sporHendelse("samværsgrad justert", {
      samværsgrad: value,
    });
  }, 4000);

  return (
    <div className="border p-4 rounded-md space-y-4">
      {canRemove && (
        <Heading size="small" level="2">
          Barn {index + 1}
        </Heading>
      )}
      <div className="flex gap-4">
        <FormattertTallTextField
          {...item.field("alder").getControlProps()}
          label="Barnets alder"
          error={item.field("alder").error()}
        />
      </div>

      <Slider
        {...item.field("samværsgrad").getControlProps()}
        onChange={(value) => {
          item.field("samværsgrad").onChange(value);
          sporSamværsgrad(value);
        }}
        label="Hvor mye vil barnet bo sammen med deg?"
        description="Estimér hvor mange netter barnet vil bo sammen med deg i snitt per måned"
        min={0}
        max={30}
        step={1}
        list={[
          { label: "Ingen netter hos deg", value: 0 },
          { label: "Halvparten av tiden hos deg", value: 15 },
          { label: "Alle netter hos deg", value: 30 },
        ]}
        valueDescription={lagSamværsgradbeskrivelse(
          Number(item.field("samværsgrad").value())
        )}
      />

      {canRemove && (
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={onRemove}
        >
          Fjern barn
        </Button>
      )}
    </div>
  );
}
