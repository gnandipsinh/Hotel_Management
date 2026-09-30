import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerWidth = "default" | "narrow" | "wide";

const WIDTH_BY_VARIANT: Record<ContainerWidth, string> = {
  narrow: "max-w-5xl",
  default: "max-w-[1440px]",
  wide: "max-w-[1600px]",
};

/**
 * Responsive page container: comfortable padding on desktop, compact padding
 * and guaranteed no horizontal overflow on mobile.
 */
export function PageContainer({
  children,
  width = "default",
  className,
}: {
  children: React.ReactNode;
  width?: ContainerWidth;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8",
        WIDTH_BY_VARIANT[width],
        className,
      )}
    >
      {children}
    </div>
  );
}
