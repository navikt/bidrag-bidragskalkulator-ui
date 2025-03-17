import { BodyShort, Label, useId } from "@navikt/ds-react";
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
  onChange?: (value: string) => void;
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
  onChange = () => {},
  list,
  ...props
}: SliderProps) {
  const generertId = useId();
  const id = eksternId ?? generertId;
  const verdi = value
    ? [Number(value)]
    : defaultValue
    ? [Number(defaultValue)]
    : [];

  const handleChange = (value: number[]) => {
    onChange(value.length > 0 ? value[0].toString() : "");
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {description && (
        <BodyShort size="small" textColor="subtle">
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
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
          className
        )}
        onValueChange={handleChange}
        {...props}
        id={id}
        aria-labelledby={id}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "bg-gray-300 relative grow overflow-hidden rounded-full h-2 w-full"
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn("bg-blue-200 absolute h-full")}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          className="border-primary bg-blue-500 ring-ring/50 block size-5 shrink-0 rounded-full border-none shadow-sm transition-[color,box-shadow] hover:ring-4 hover:ring-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      </SliderPrimitive.Root>
      {list && (
        <div className="flex justify-between gap-2">
          {list.map((item) => (
            <span className="text-xs" key={item.value}>
              {item.label}
            </span>
          ))}
        </div>
      )}
      {valueDescription && <BodyShort>{valueDescription}</BodyShort>}
    </div>
  );
}

export { Slider };
