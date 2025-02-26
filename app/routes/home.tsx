import {
  Alert,
  BodyLong,
  Button,
  GuidePanel,
  Heading,
  Select,
  TextField,
} from "@navikt/ds-react";
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
import { env } from "~/config/env.server";
import type { Route } from "./+types/home";

const FormSchema = z.object({
  barn: z
    .array(
      z.object({
        alder: z.coerce.number().min(0, "Alder må være et positivt tall"),
        samværsgrad: z.coerce.number().min(0, "Samværsgrad er påkrevd"),
      })
    )
    .min(1, "Minst ett barn må legges til"),
  inntektForelder1: z.coerce
    .number()
    .min(0, "Inntekt må være et positivt tall"),
  inntektForelder2: z.coerce
    .number()
    .min(0, "Inntekt må være et positivt tall"),
});

const validator = withZod(FormSchema);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bidragskalkulator" },
    {
      name: "description",
      content:
        "Bidragskalkulatoren hjelper deg å regne ut hvor stort et barnebidrag er.",
    },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const result = await validator.validate(await request.formData());
  const { SERVER_URL } = env;
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }
  try {
    const response = await fetch(`${SERVER_URL}/v1/beregning/enkel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.data),
    });

    if (!response.ok) {
      throw new Error("Failed to calculate child support");
    }

    const json = await response.json();
    return { resultat: json.resultat };
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
      barn: [{ alder: "", samværsgrad: "" }],
      inntektForelder1: "",
      inntektForelder2: "",
    },
  });
  const barnFields = useFieldArray(form.scope("barn"));

  const resultRef = useRef<HTMLDivElement>(null);
  const harResultat =
    actionData &&
    !isValidationErrorResponse(actionData) &&
    actionData?.resultat !== undefined;

  return (
    <div className="max-w-2xl mx-auto p-4 mt-8">
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
        <ul>
          <li>Alder på hvert barn</li>
          <li>Tid barna tilbringer hos hver forelder</li>
          <li>Inntekten til begge foreldre</li>
        </ul>
        <BodyLong spacing>
          Du kan legge til flere barn for å beregne samlet barnebidrag. Vær
          oppmerksom på at dette er en forenklet beregning. Det endelige
          bidraget kan variere basert på flere faktorer og bør avtales mellom
          foreldrene eller fastsettes av Nav.
        </BodyLong>
      </GuidePanel>

      <form {...form.getFormProps()} className="space-y-4 mt-6">
        {barnFields.map((key, item, index) => (
          <div key={key} className="border p-4 rounded-md space-y-4">
            <Heading size="small" level="2">
              Barn {index + 1}
            </Heading>
            <div className="flex gap-4">
              <TextField
                {...item.field("alder").getInputProps()}
                label="Barnets alder"
                className="flex-1"
                type="number"
                error={item.field("alder").error()}
              />

              <Select
                className="flex-1"
                {...item.field("samværsgrad").getInputProps()}
                label="Tid hos forelder 1"
                error={item.field("samværsgrad").error()}
              >
                <option value="">Velg prosent</option>
                <option value="0">0% (bor ikke hos forelder 1)</option>
                <option value="25">25% (ca. annenhver helg)</option>
                <option value="50">50% (delt bosted)</option>
                <option value="75">75% (utvidet samvær)</option>
                <option value="100">100% (bor fast hos forelder 1)</option>
              </Select>
            </div>
            {barnFields.length() > 1 && (
              <Button
                type="button"
                variant="secondary"
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
          onClick={() => barnFields.push({ alder: "", samværsgrad: "" })}
        >
          Legg til barn
        </Button>
        <div className="flex flex-col md:flex-row gap-4">
          <TextField
            {...form.field("inntektForelder1").getInputProps()}
            label="Inntekt forelder 1 (kr/år)"
            type="number"
            error={form.field("inntektForelder1").error()}
          />
          <TextField
            {...form.field("inntektForelder2").getInputProps()}
            label="Inntekt forelder 2 (kr/år)"
            type="number"
            error={form.field("inntektForelder2").error()}
          />
        </div>
        <Button type="submit" loading={form.formState.isSubmitting}>
          Beregn barnebidrag
        </Button>
      </form>
      {harResultat && (
        <div className="mt-6" ref={resultRef}>
          <Alert variant="info">
            <Heading size="small" spacing>
              Beregnet barnebidrag
            </Heading>
            <BodyLong spacing>
              Basert på den oppgitte informasjonen er det beregnede
              barnebidraget:
              <strong> {actionData.resultat} kr per måned</strong>
            </BodyLong>
            <Button
              variant="secondary"
              onClick={() => alert("Funksjon for å opprette privat avtale")}
            >
              Opprett privat avtale
            </Button>
          </Alert>
        </div>
      )}
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
    </div>
  );
}
