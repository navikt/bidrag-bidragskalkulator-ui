import {
  Alert,
  BodyLong,
  Button,
  GuidePanel,
  Heading,
  Link,
  List,
  TextField,
} from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import {
  isValidationErrorResponse,
  useFieldArray,
  useForm,
  validationError,
} from "@rvf/react-router";
import { withZod } from "@rvf/zod";
import { useRef } from "react";
import { useActionData, type ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { Slider } from "~/components/ui/slider";
import { env } from "~/config/env.server";
import type { Route } from "./+types/home";

const validator = withZod(
  z.object({
    barn: z
      .array(
        z.object({
          alder: z
            .string()
            .nonempty("Alder må oppgis")
            .pipe(
              z.coerce
                .number()
                .min(0, "Alder må være et positivt tall")
                .step(1, { message: "Oppgi alder i hele år" })
            ),
          samværsgrad: z
            .string()
            .nonempty("Samværsgrad må oppgis")
            .pipe(
              z.coerce
                .number()
                .min(0, "Samværsgrad må være minst 0")
                .max(100, "Samværsgrad må være høyst 100")
            ),
        })
      )
      .min(1, "Minst ett barn må legges til")
      .max(10, "Maks 10 barn kan legges til"),
    inntektForelder1: z
      .string()
      .nonempty("Inntekt må oppgis")
      .pipe(
        z.coerce
          .number()
          .min(0, "Inntekt må være et positivt tall")
          .step(1, { message: "Oppgi inntekt i hele kroner" })
      ),
    inntektForelder2: z
      .string()
      .nonempty("Inntekt må oppgis")
      .pipe(
        z.coerce
          .number()
          .min(0, "Inntekt må være et positivt tall")
          .step(1, { message: "Oppgi inntekt i hele kroner" })
      ),
  })
);

const responseSchema = z.object({
  resultater: z.array(
    z.object({
      sum: z.number(),
      barnetsAlder: z.number(),
    })
  ),
});

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Barnebidragskalkulator" },
    {
      name: "description",
      content:
        "Barnebidragskalkulatoren hjelper deg å regne ut hvor stort et barnebidrag er.",
    },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const requestData = {
    ...result.data,
    barn: result.data.barn.map((barn) => ({
      alder: barn.alder,
      samværsklasse: kalkulerSamværsklasse(barn.samværsgrad),
    })),
  };

  try {
    const response = await fetch(
      `${env.SERVER_URL}/api/v1/beregning/barnebidrag`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      return {
        error: "Det oppstod en feil under beregningen. Vennligst prøv igjen.",
      };
    }
    const json = await response.json();
    const parsed = responseSchema.safeParse(json);

    if (!parsed.success) {
      return {
        error:
          "Vi mottok et ugyldig svar fra beregningsmotoren. Vennligst prøv igjen.",
      };
    }

    return parsed.data;
  } catch (error) {
    console.error(error);
    return {
      error: "Det oppstod en feil under beregningen. Vennligst prøv igjen.",
    };
  }
}

export default function Barnebidragskalkulator() {
  const actionData = useActionData<typeof action>();
  const form = useForm({
    validator,
    method: "post",
    defaultValues: {
      barn: [{ alder: "", samværsgrad: "15" }],
      inntektForelder1: "",
      inntektForelder2: "",
    },
    onSubmitSuccess: () => {
      resultatRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  });
  const barnFields = useFieldArray(form.scope("barn"));
  const resultatRef = useRef<HTMLDivElement>(null);

  const totalSum =
    actionData && "resultater" in actionData
      ? actionData.resultater.reduce((sum, neste) => sum + neste.sum, 0)
      : undefined;

  return (
    <div className="max-w-xl mx-auto p-4 mt-8">
      <Heading size="xlarge" level="1" spacing align="center">
        Barnebidragskalkulator
      </Heading>

      <GuidePanel poster>
        <Heading spacing size="small">
          Hva kan du forvente av barnebidragskalkulatoren?
        </Heading>
        <BodyLong spacing>
          Denne kalkulatoren gir deg en estimert beregning av barnebidrag basert
          på:
        </BodyLong>
        <List>
          <ListItem>Alder på hvert barn</ListItem>
          <ListItem>Tid barna tilbringer hos deg</ListItem>
          <ListItem>Inntekten til både deg og den andre forelderen</ListItem>
        </List>
        <BodyLong spacing>
          Vær oppmerksom på at dette er en forenklet beregning. Det endelige
          bidraget kan variere basert på flere faktorer og bør avtales mellom
          foreldrene eller fastsettes av Nav.
        </BodyLong>
      </GuidePanel>

      <form {...form.getFormProps()} className="space-y-4 mt-6">
        {barnFields.map((key, item, index) => (
          <div key={key} className="border p-4 rounded-md space-y-4">
            {barnFields.length() > 1 && (
              <Heading size="small" level="2">
                Barn {index + 1}
              </Heading>
            )}
            <div className="flex gap-4">
              <TextField
                {...item.field("alder").getInputProps()}
                label="Barnets alder"
                type="number"
                error={item.field("alder").error()}
              />
            </div>

            <Slider
              {...item.field("samværsgrad").getControlProps()}
              label="Hvor mye vil barnet bo sammen med deg?"
              description="Estimér hvor mange netter barnet vil bo sammen med deg i snitt per måned"
              min={0}
              max={30}
              step={1}
              list={[
                { label: "Ingen netter hos deg", value: 0 },
                { label: "Halvparten av tiden", value: 15 },
                { label: "Alle netter hos deg", value: 30 },
              ]}
              valueDescription={lagSamværsgradbeskrivelse(
                Number(item.field("samværsgrad").value())
              )}
            />
            {barnFields.length() > 1 && (
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={() => barnFields.remove(index)}
              >
                Fjern barn
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={() => barnFields.push({ alder: "", samværsgrad: "15" })}
        >
          Legg til barn
        </Button>
        <div className="flex flex-col gap-4">
          <TextField
            {...form.field("inntektForelder1").getInputProps()}
            label="Hva er inntekten din?"
            type="number"
            error={form.field("inntektForelder1").error()}
            className="max-w-sm"
          />
          <TextField
            {...form.field("inntektForelder2").getInputProps()}
            label="Hva er inntekten til den andre forelderen?"
            type="number"
            error={form.field("inntektForelder2").error()}
            className="max-w-sm"
          />
        </div>
        <Button type="submit" loading={form.formState.isSubmitting}>
          Beregn barnebidrag
        </Button>
      </form>
      {isValidationErrorResponse(actionData) && (
        <div className="mt-6">
          <Alert variant="error">
            <Heading size="small" spacing>
              Feil under beregning
            </Heading>
            <BodyLong>{actionData.fieldErrors.root}</BodyLong>
          </Alert>
        </div>
      )}
      {actionData && "error" in actionData && (
        <div className="mt-6">
          <Alert variant="error">
            <Heading size="small" spacing>
              Noe gikk feil under beregningen
            </Heading>
            <BodyLong>{actionData.error}</BodyLong>
          </Alert>
        </div>
      )}
      {actionData && "resultater" in actionData && (
        <div className="mt-6" ref={resultatRef}>
          <Alert variant="info">
            <Heading size="small" spacing>
              Du skal {totalSum && totalSum > 0 ? "motta" : "betale"} {totalSum}{" "}
              kroner i barnebidrag per måned.
            </Heading>
            <BodyLong spacing>
              Dette er en estimering og kan variere basert på flere faktorer,
              som vi for enkelhets skyld har utelatt i denne kalkulatoren. Om du
              ønsker en mer presis kalkulering, kan du bruke{" "}
              <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
                en annen bidragskalkulator
              </Link>
              .
            </BodyLong>
            <div className="flex justify-end gap-4">
              <Button
                as="a"
                href="https://www.nav.no/fyllut/nav550060?sub=paper"
                variant="primary"
              >
                Lag privat avtale
              </Button>
              <Button
                as="a"
                href="https://www.nav.no/start/soknad-barnebidrag-bidragsmottaker"
                variant="secondary"
              >
                Søk Nav om fastsetting
              </Button>
            </div>
          </Alert>
        </div>
      )}
    </div>
  );
}

type Samværsklasse =
  | "SAMVÆRSKLASSE_1"
  | "SAMVÆRSKLASSE_2"
  | "SAMVÆRSKLASSE_3"
  | "SAMVÆRSKLASSE_4";

function kalkulerSamværsklasse(samværsgrad: number): Samværsklasse {
  if (samværsgrad <= 3 || samværsgrad >= 27) {
    return "SAMVÆRSKLASSE_1";
  }
  if (samværsgrad <= 8 || samværsgrad >= 22) {
    return "SAMVÆRSKLASSE_2";
  }
  if (samværsgrad <= 13 || samværsgrad >= 17) {
    return "SAMVÆRSKLASSE_3";
  }
  return "SAMVÆRSKLASSE_4"; // TODO: Nå returnerer vi ikke delt bosted
}

function lagSamværsgradbeskrivelse(samværsgrad: number): string {
  if (samværsgrad === 1) {
    return "1 natt";
  }
  return `${samværsgrad} netter`;
}
