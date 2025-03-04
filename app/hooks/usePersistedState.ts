import { useEffect, useState } from "react";

/**
 * A custom React hook that works like useState but persists the state to localStorage.
 *
 * This hook provides a way to store state that persists across page refreshes and browser sessions.
 * It handles server-side rendering gracefully and includes error handling for localStorage operations.
 *
 * @template T The type of the state
 *
 * @param {string} key The localStorage key to store the state under
 * @param {T | (() => T)} initialValue The initial value or a function that returns the initial value
 *
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} A stateful value and a function to update it, just like React's useState
 *
 * @example
 * // Basic usage with a string
 * const [name, setName] = usePersistedState<string>('user-name', '');
 *
 * @example
 * // With a number
 * const [count, setCount] = usePersistedState<number>('counter', 0);
 *
 * @example
 * // With an object
 * const [user, setUser] = usePersistedState<User>('user-data', {
 *   name: '',
 *   email: '',
 *   age: 0
 * });
 *
 * @example
 * // With an array
 * const [items, setItems] = usePersistedState<string[]>('todo-items', []);
 *
 * @example
 * // With a function for the initial state
 * const [complexState, setComplexState] = usePersistedState<ComplexType>(
 *   'complex-key',
 *   () => calculateInitialState()
 * );
 *
 * @example
 * // Complete example
 * function Counter() {
 *   const [count, setCount] = usePersistedState<number>('counter', 0);
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *       <button onClick={() => setCount(0)}>Reset</button>
 *     </div>
 *   );
 * }
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Get stored value from localStorage or use initialValue
  const getStoredValue = (): T => {
    // Handle server-side rendering where localStorage is not available
    if (typeof window === "undefined") {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }

    try {
      const item = localStorage.getItem(key);
      // Parse stored json or return initialValue if none
      return item
        ? JSON.parse(item)
        : typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Update localStorage when the state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
