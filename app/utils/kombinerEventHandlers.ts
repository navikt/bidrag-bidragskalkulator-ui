type EventHandler<T> = (event: T) => void;

export function kombinerEventHandlers<T>(
  ...handlers: (EventHandler<T> | undefined)[]
): EventHandler<T> {
  return (event: T) => {
    handlers.filter(Boolean).forEach((handler) => {
      if (typeof handler === "function") {
        handler(event);
      }
    });
  };
}
