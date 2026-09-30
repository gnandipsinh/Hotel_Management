import * as React from "react";
import { EmptyState, type EmptyStateProps } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { SkeletonCards, SkeletonRows, SkeletonTable } from "@/components/states/skeletons";

export type DataStateKind = "loading" | "empty" | "error" | "success";

export interface DataStateProps {
  state: DataStateKind;
  skeleton?: "rows" | "cards" | "table";
  skeletonRows?: number;
  empty?: EmptyStateProps;
  error?: { title?: string; description?: string; onRetry?: () => void };
  onRetry?: () => void;
  children: React.ReactNode;
}

/**
 * One switch for the four lifecycle states every data section must support:
 * loading → (empty | error | success).
 */
export function DataState({
  state,
  skeleton = "rows",
  skeletonRows = 5,
  empty,
  error,
  onRetry,
  children,
}: DataStateProps) {
  if (state === "loading") {
    if (skeleton === "cards") return <SkeletonCards cards={skeletonRows} />;
    if (skeleton === "table") return <SkeletonTable rows={skeletonRows} />;
    return <SkeletonRows rows={skeletonRows} />;
  }

  if (state === "error") {
    return (
      <ErrorState
        title={error?.title}
        description={error?.description}
        onRetry={error?.onRetry ?? onRetry}
      />
    );
  }

  if (state === "empty") {
    return <EmptyState {...empty} />;
  }

  return <>{children}</>;
}
