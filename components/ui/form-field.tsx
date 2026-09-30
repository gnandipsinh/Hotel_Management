import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  label?: React.ReactNode;
  required?: boolean;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

export function FormField({
  id,
  label,
  required,
  helperText,
  error,
  disabled,
  className,
  children,
  ...props
}: FormFieldProps) {
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        disabled && "opacity-60 pointer-events-none",
        className,
      )}
      {...props}
    >
      {label && (
        <div className="flex items-center justify-between">
          <Label
            htmlFor={fieldId}
            className="text-xs font-medium text-foreground"
          >
            {label}
            {required && (
              <span className="ml-1 text-destructive font-semibold" aria-hidden="true">
                *
              </span>
            )}
          </Label>
        </div>
      )}

      <div>{children}</div>

      {helperText && !error && (
        <p id={helperId} className="text-[11px] text-muted-foreground leading-normal">
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive leading-tight">
          {error}
        </p>
      )}
    </div>
  );
}
