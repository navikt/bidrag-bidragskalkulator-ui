type EventHandler<T> = (event: T) => void;

export function kombinerEventHandlers<T>(
  ...handlers: EventHandler<T>[]
): EventHandler<T> {
  return (event: T) => {
    handlers.forEach((handler) => {
      if (typeof handler === "function") {
        handler(event);
      }
    });
  };
}
