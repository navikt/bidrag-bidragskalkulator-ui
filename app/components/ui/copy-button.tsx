import { CheckmarkIcon, FilesIcon } from "@navikt/aksel-icons";
import { Button, type ButtonProps } from "@navikt/ds-react";
import React, {
  type ButtonHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "~/lib/utils";
import { kombinerEventHandlers } from "~/utils/kombinerEventHandlers";
import { kopierTilUtklippstavle } from "~/utils/kopierTilUtklippstavle";

export interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    Pick<ButtonProps, "iconPosition" | "size"> {
  /**
   * @default "primary"
   */
  variant?: ButtonProps["variant"];
  /**
   * Text to copy to clipboard.
   */
  copyText: string;
  /**
   *  Optional text in button.
   */
  text?: string;
  /**
   * Text shown when button is clicked.
   * Will be used as accessible label (title) if `text`-prop is not set.
   * @default "Kopiert!"
   */
  activeText?: string;
  /**
   * Callback that is called when internal copy-state changes.
   *
   * @param state `true` when copy-state is activated, `false` when copy-state is deactivated.
   */
  onActiveChange?: (state: boolean) => void;
  /**
   *  Icon shown when button is not clicked.
   * @default <FilesIcon />
   */
  icon?: React.ReactNode;
  /**
   * Icon shown when active.
   * @default <CheckmarkIcon />
   */
  activeIcon?: React.ReactNode;
  /**
   * Timeout duration in milliseconds.
   * @default 2000
   */
  activeDuration?: number;
  /**
   * Accessible label for icon (ignored if text is set).
   * @default "Kopier"
   */
  title?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * A button component that copies text to the clipboard when clicked.
 * 
 * Forked from Aksel, to support other designs
 *
 * @see [📝 Documentation](https://aksel.nav.no/komponenter/core/copybutton)
 * @see 🏷️ {@link CopyButtonProps}
 *
 * @example
 * ```jsx
      <CopyButton copyText="3.14" />
 * ```
 */
export const CopyButton = ({
  className,
  copyText,
  text,
  activeText,
  variant = "primary",
  onActiveChange,
  icon,
  activeIcon,
  activeDuration = 2000,
  title,
  iconPosition = "left",
  onClick = () => {},
  size = "medium",
  ref,
  ...rest
}: CopyButtonProps) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<number>(null);

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    kopierTilUtklippstavle(copyText);
    setActive(true);
    onActiveChange?.(true);

    timeoutRef.current = window.setTimeout(() => {
      setActive(false);
      onActiveChange?.(false);
    }, activeDuration);
  };

  const copyIcon = active
    ? activeIcon ?? (
        <CheckmarkIcon
          aria-hidden={!!text}
          title={text ? undefined : activeText}
          className={cn("navds-copybutton__icon")}
        />
      )
    : icon ?? (
        <FilesIcon
          aria-hidden={!!text}
          title={text ? undefined : title || activeText}
          className={cn("navds-copybutton__icon")}
        />
      );

  return (
    <Button
      ref={ref}
      type="button"
      className={className}
      {...rest}
      variant={variant}
      onClick={kombinerEventHandlers(onClick, handleClick)}
      iconPosition={iconPosition}
      icon={copyIcon}
      data-active={active}
      size={size}
    >
      {text ? (active ? activeText : text) : null}
    </Button>
  );
};
