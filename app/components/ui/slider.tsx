import { BodyShort, ErrorMessage, Label, useId } from "@navikt/ds-react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "~/lib/utils";

type SliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "onValueChange" | "onValueCommit" | "value" | "onChange"
> & {
  label?: string;
  description?: string;
  valueDescription?: string;
  list?: { label: string; value: number }[];
  value?: string;
  onChange: (value: string) => void;
  error?: string | null;
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  label,
  description,
  valueDescription,
  id: eksternId,
  onChange,
  list,
  error,
  ...props
}: SliderProps) {
  const generertId = useId();
  const id = eksternId ?? generertId;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const verdi = value
    ? [Number(value)]
    : defaultValue
      ? [Number(defaultValue)]
      : [];

  const handleChange = (value: number[]) => {
    onChange(value.length > 0 ? value[0].toString() : "");
  };

  return (
    <div>
      <Label htmlFor={id} id={labelId}>
        {label}
      </Label>
      {description && (
        <BodyShort size="medium" textColor="subtle" id={descriptionId}>
          {description}
        </BodyShort>
      )}
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={verdi}
        min={min}
        max={max}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 mt-4",
          className,
        )}
        onValueChange={handleChange}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "relative grow overflow-hidden rounded-full h-2 w-full",
            error ? "bg-red-200 outline-1 outline-red-500" : "bg-gray-300",
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn("absolute h-full")}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          id={id}
          aria-valuetext={valueDescription}
          aria-labelledby={labelId}
          aria-describedby={
            error ? `${id}-error` : description ? descriptionId : undefined
          }
          aria-invalid={!!error}
          data-slot="slider-thumb"
          className={cn(
            "border-primary ring-ring/50 block size-5 shrink-0 rounded-full border-none shadow-sm transition-[color,box-shadow] hover:ring-4  focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
            error
              ? "bg-red-500 hover:ring-red-500 focus-visible:ring-red-500"
              : "bg-blue-500 hover:ring-blue-500 focus-visible:ring-blue-500",
          )}
        />
      </SliderPrimitive.Root>
      {list && (
        <div className="flex justify-between gap-2 mt-2">
          {list.map((item) => (
            <span className="text-xs text-center" key={item.value}>
              {item.label}
            </span>
          ))}
        </div>
      )}

      {valueDescription && (
        <BodyShort aria-live="polite" className="font-bold mt-1 text-center">
          {valueDescription}
        </BodyShort>
      )}

      {error && <ErrorMessage aria-live="assertive">{error}</ErrorMessage>}
    </div>
  );
}

export { Slider };
