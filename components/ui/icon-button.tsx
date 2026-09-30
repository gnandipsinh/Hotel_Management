import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: React.ReactNode;
  label: string; // Required for screen readers and tooltips
  tooltip?: string;
  loading?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      tooltip,
      loading = false,
      size = "icon",
      variant = "ghost",
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const button = (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        aria-label={label}
        className={cn("shrink-0", className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          icon
        )}
      </Button>
    );

    if (tooltip && !disabled && !loading) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  },
);
IconButton.displayName = "IconButton";
