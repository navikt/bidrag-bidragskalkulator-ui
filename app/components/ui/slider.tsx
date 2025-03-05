import { Label, useId } from "@navikt/ds-react";
import { cn } from "~/lib/utils";

type SliderProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /**
   * En beskrivende tekst som indikerer formålet med denne slideren.
   */
  label: string;

  /**
   * Den laveste tillatte verdien for slideren.
   */
  min?: number;

  /**
   * Den høyeste tillatte verdien for slideren.
   */
  max?: number;

  /**
   * Steglengden eller intervallene mellom minimums- og maksimumsverdien.
   */
  step?: number;

  /**
   * En valgfri liste med beskrivelser som korresponderer til ulike posisjoner på slideren.
   */
  markerLabels?: string[];
};

/**
 * Denne Slider-komponenten gir en brukervennlig slider for å velge en verdi innenfor et gitt intervall.
 *
 * ```tsx
 * <Slider
 *   label="Hvor mange prosent ønsker du?"
 *   min={0}
 *   max={100}
 *   step={10}
 *   value={50}
 *   onChange={(e) => console.log(e.target.value)}
 *   markerLabels={[
 *     "Ingen netter",
 *     "Delt",
 *     "Alle netter",
 *   ]}
 * />
 * ```
 */

export function Slider({
  min,
  max,
  step,
  label,
  id: eksternId,
  className,
  markerLabels,
  ...props
}: SliderProps) {
  const generatedId = `${useId()}-slider`;
  const id = eksternId ?? generatedId;
  return (
    <div className="my-4">
      <Label htmlFor={id} className="block mb-2">
        {label}
      </Label>
      <input
        className={cn(
          `block 
          w-full 
          focus:outline-none 

          [&::-webkit-slider-runnable-track]:appearance-none 
          [&::-moz-range-track]:appearance-none
          [&::-webkit-slider-runnable-track]:h-2 
          [&::-moz-range-track]:h-2
          [&::-webkit-slider-runnable-track]:rounded-full 
          [&::-moz-range-track]:rounded-full
          [&::-webkit-slider-runnable-track]:bg-gray-200 
          [&::-moz-range-track]:bg-gray-200

          [&::-webkit-slider-thumb]:appearance-none 
          [&::-moz-range-thumb]:appearance-none
          [&::-webkit-slider-thumb]:shadow-none
          [&::-webkit-slider-thumb]:h-5 
          [&::-moz-range-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5 
          [&::-moz-range-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-moz-range-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-blue-500 
          [&::-moz-range-thumb]:bg-blue-500
          [&::-webkit-slider-thumb]:relative 
          [&::-moz-range-thumb]:relative 
          [&::-webkit-slider-thumb]:top-[-50%] 
          [&::-moz-range-thumb]:top-[-50%] 
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:border-none
          [&::-moz-range-thumb]:border-none
          focus:[&::-webkit-slider-thumb]:bg-blue-900 
          focus:[&::-moz-range-thumb]:bg-blue-900
          focus:[&::-webkit-slider-thumb]:outline-2 
          focus:[&::-moz-range-thumb]:outline-2
          focus:[&::-webkit-slider-thumb]:outline-blue-900
          focus:[&::-moz-range-thumb]:outline-blue-900
          active:[&::-webkit-slider-thumb]:bg-blue-300
          active:[&::-moz-range-thumb]:bg-blue-300
          active:[&::-webkit-slider-thumb]:outline-blue-300
          active:[&::-moz-range-thumb]:outline-blue-300
          `,
          className
        )}
        type="range"
        id={id}
        {...props}
        min={min}
        max={max}
        step={step}
      />
      {markerLabels && (
        <div className="flex justify-between w-full text-xs text-gray-600 mt-1">
          {markerLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
