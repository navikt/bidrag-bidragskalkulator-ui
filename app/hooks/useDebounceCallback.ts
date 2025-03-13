import { useCallback, useEffect, useRef } from "react";

/**
 * En hook som returnerer en debounced versjon av callback-funksjonen.
 * Den debouncede funksjonen vil kun bli kalt etter at det spesifiserte delayet har gått
 * siden den sist ble kalt.
 *
 * @param callback Funksjonen som skal debounce
 * @param delay Tiden i millisekunder før funksjonen kalles
 * @returns En debounced versjon av callback funksjonen
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
