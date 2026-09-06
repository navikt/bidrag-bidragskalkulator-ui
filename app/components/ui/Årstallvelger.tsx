import { Select, type SelectProps } from "@navikt/ds-react";

type ÅrstallvelgerProps = Omit<SelectProps, "children"> & {
  minimumsÅrstall?: number;
  maksimumsÅrstall?: number;
  defaultOptionTekst: string;
};

export function Årstallvelger({
  minimumsÅrstall,
  maksimumsÅrstall = new Date().getFullYear(),
  defaultOptionTekst,
  ...props
}: ÅrstallvelgerProps) {
  const min = minimumsÅrstall ?? maksimumsÅrstall - 25;

  const årstall: number[] = [];
  for (let år = maksimumsÅrstall; år >= min; år--) {
    årstall.push(år);
  }

  return (
    <Select {...props}>
      <option value="">{defaultOptionTekst}</option>
      {årstall.map((år) => (
        <option key={år} value={år.toString()}>
          {år}
        </option>
      ))}
    </Select>
  );
}
