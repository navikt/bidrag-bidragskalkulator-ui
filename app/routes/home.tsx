import {
  Alert,
  BodyLong,
  Button,
  GuidePanel,
  Heading,
  Select,
  TextField,
} from "@navikt/ds-react";
import { useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { Route } from "./+types/home";

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

type Child = {
  age: string;
  timeWithParent1: string;
};

type FormData = {
  children: Child[];
  incomeParent1: string;
  incomeParent2: string;
};

export default function Barnebidragskalkulator() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      children: [{ age: "", timeWithParent1: "" }],
      incomeParent1: "",
      incomeParent2: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "children",
  });

  const [result, setResult] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const onSubmit = (data: FormData) => {
    // TODO: Implement the actual calculation
    // This is a simplified calculation and should be replaced with the actual formula
    const baseAmount = 1000;
    let totalSupport = 0;

    data.children.forEach((child) => {
      const ageMultiplier = Number.parseInt(child.age) > 10 ? 1.5 : 1;
      const timeRatio = Number.parseInt(child.timeWithParent1) / 100;
      const incomeRatio =
        Number.parseInt(data.incomeParent1) /
        (Number.parseInt(data.incomeParent1) +
          Number.parseInt(data.incomeParent2));

      const childSupport =
        baseAmount * ageMultiplier * (1 - timeRatio) * incomeRatio;
      totalSupport += childSupport;
    });

    setResult(Math.round(totalSupport));
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="max-w-lg mx-auto p-4 mt-8">
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
        {fields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-md space-y-4">
            <Heading size="small" level="2">
              Barn {index + 1}
            </Heading>
            <Controller
              name={`children.${index}.age`}
              control={control}
              rules={{
                required: "Alder er påkrevd",
                min: { value: 0, message: "Alder må være et positivt tall" },
              }}
              render={({ field }) => (
                <TextField
                  label="Barnets alder"
                  {...field}
                  type="number"
                  error={errors.children?.[index]?.age?.message}
                />
              )}
            />
            <Controller
              name={`children.${index}.timeWithParent1`}
              control={control}
              rules={{ required: "Tid hos forelder 1 er påkrevd" }}
              render={({ field }) => (
                <Select
                  label="Tid hos forelder 1"
                  {...field}
                  error={errors.children?.[index]?.timeWithParent1?.message}
                >
                  <option value="">Velg prosent</option>
                  <option value="0">0% (bor ikke hos forelder 1)</option>
                  <option value="25">25% (ca. annenhver helg)</option>
                  <option value="50">50% (delt bosted)</option>
                  <option value="75">75% (utvidet samvær)</option>
                  <option value="100">100% (bor fast hos forelder 1)</option>
                </Select>
              )}
            />
            {fields.length > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => remove(index)}
              >
                Fjern barn
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() => append({ age: "", timeWithParent1: "" })}
        >
          Legg til barn
        </Button>
        <Controller
          name="incomeParent1"
          control={control}
          rules={{
            required: "Inntekt for forelder 1 er påkrevd",
            min: { value: 0, message: "Inntekt må være et positivt tall" },
          }}
          render={({ field }) => (
            <TextField
              label="Inntekt forelder 1 (kr/år)"
              {...field}
              type="number"
              error={errors.incomeParent1?.message}
            />
          )}
        />
        <Controller
          name="incomeParent2"
          control={control}
          rules={{
            required: "Inntekt for forelder 2 er påkrevd",
            min: { value: 0, message: "Inntekt må være et positivt tall" },
          }}
          render={({ field }) => (
            <TextField
              label="Inntekt forelder 2 (kr/år)"
              {...field}
              type="number"
              error={errors.incomeParent2?.message}
            />
          )}
        />
        <Button type="submit">Beregn barnebidrag</Button>
      </form>
      {result !== null && (
        <div className="mt-6" ref={resultRef}>
          <Alert variant="info">
            <Heading size="small" spacing>
              Beregnet barnebidrag
            </Heading>
            <BodyLong spacing>
              Basert på den oppgitte informasjonen er det beregnede
              barnebidraget:
              <strong> {result} kr per måned</strong>
            </BodyLong>
            <BodyLong spacing>
              <strong>
                Dette tallet stemmer ikke per i dag, da selve beregningen ikke
                er implementert enda.
              </strong>
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
    </div>
  );
}
