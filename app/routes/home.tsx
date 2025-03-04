import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  GuidePanel,
  Heading,
  Label,
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
import { useActionData, type ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { Slider } from "~/components/ui/slider";
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

// Helper function to get description for samværsgrad
function getSamværsgradDescription(value: number): string {
  switch (value) {
    case 0:
      return "Ingen netter hos deg";
    case 25:
      return "Ca. annenhver helg";
    case 50:
      return "Delt bosted";
    case 75:
      return "Utvidet samvær";
    case 100:
      return "Alle netter hos deg";
    default:
      return "";
  }
}

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
            </div>

            <div className="space-y-2">
              <Label htmlFor={`samvaersgrad-${key}`}>
                Hvor mange netter tilbringer barnet hos deg?
              </Label>
              {item.field("samværsgrad").error() && (
                <BodyShort size="small" className="text-red-500">
                  {item.field("samværsgrad").error()}
                </BodyShort>
              )}
              <div className="mb-1">
                <span className="text-sm font-medium">
                  {item.field("samværsgrad").value() === ""
                    ? "Velg samværsgrad"
                    : `${item
                        .field("samværsgrad")
                        .value()}% - ${getSamværsgradDescription(
                        Number(item.field("samværsgrad").value())
                      )}`}
                </span>
              </div>
              <Slider
                id={`samvaersgrad-${key}`}
                value={[
                  item.field("samværsgrad").value() === ""
                    ? 0
                    : Number(item.field("samværsgrad").value()),
                ]}
                onValueChange={(values) => {
                  item.field("samværsgrad").setValue(values[0].toString());
                }}
                max={100}
                step={25}
                className="py-6"
              />
              <div className="flex justify-between w-full text-xs text-gray-600 -mt-2">
                <div className="text-center">
                  <div className="h-3 border-l border-gray-400 mx-auto mb-1 w-0"></div>
                  <span>0%</span>
                </div>
                <div className="text-center">
                  <div className="h-3 border-l border-gray-400 mx-auto mb-1 w-0"></div>
                  <span>25%</span>
                </div>
                <div className="text-center">
                  <div className="h-3 border-l border-gray-400 mx-auto mb-1 w-0"></div>
                  <span>50%</span>
                </div>
                <div className="text-center">
                  <div className="h-3 border-l border-gray-400 mx-auto mb-1 w-0"></div>
                  <span>75%</span>
                </div>
                <div className="text-center">
                  <div className="h-3 border-l border-gray-400 mx-auto mb-1 w-0"></div>
                  <span>100%</span>
                </div>
              </div>
              <div className="flex justify-between w-full text-xs text-gray-600 mt-1">
                <span>Ingen netter hos deg</span>
                <span>Alle netter hos deg</span>
              </div>
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
            label="Hva er inntekten din (kr/år)?"
            type="number"
            error={form.field("inntektForelder1").error()}
          />
          <TextField
            {...form.field("inntektForelder2").getInputProps()}
            label="Hva er inntekten til den andre forelderen (kr/år)?"
            type="number"
            error={form.field("inntektForelder2").error()}
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
    </div>
  );
}
