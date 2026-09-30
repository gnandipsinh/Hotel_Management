import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, type EmptyStateProps } from "@/components/states/empty-state";
import { SkeletonTable } from "@/components/states/skeletons";

export interface ResponsiveColumn<T> {
  key: string;
  header: string;
  /** Desktop cell renderer. */
  render: (row: T) => React.ReactNode;
  /** Label used on the mobile card layout. Defaults to `header`. */
  mobileLabel?: string;
  /** Hide this column from the mobile card presentation. */
  hideOnMobile?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface ResponsiveTableProps<T> {
  columns: ResponsiveColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  loading?: boolean;
  empty?: EmptyStateProps;
  caption?: string;
  /** Rendered at the end of each row (desktop) and each card (mobile). */
  rowActions?: (row: T) => React.ReactNode;
  onRowSelect?: (row: T) => void;
  className?: string;
}

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

/**
 * Responsive table strategy:
 *  - desktop/tablet: real semantic table
 *  - mobile: card/list presentation (no unusable squashed table)
 */
export function ResponsiveTable<T>({
  columns,
  rows,
  getRowId,
  loading = false,
  empty,
  caption,
  rowActions,
  onRowSelect,
  className,
}: ResponsiveTableProps<T>) {
  if (loading) return <SkeletonTable rows={5} className={className} />;

  if (rows.length === 0) {
    return <EmptyState {...empty} />;
  }

  return (
    <div className={cn("w-full min-w-0", className)}>
      {/* Desktop / tablet: semantic table */}
      <div className="hidden md:block">
        <Table>
          {caption && <caption className="sr-only">{caption}</caption>}
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(ALIGN_CLASS[column.align ?? "left"], column.className)}
                >
                  {column.header}
                </TableHead>
              ))}
              {rowActions && <TableHead className="w-12 text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={getRowId(row)}
                className={cn(onRowSelect && "cursor-pointer")}
                onClick={onRowSelect ? () => onRowSelect(row) : undefined}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(ALIGN_CLASS[column.align ?? "left"], column.className)}
                  >
                    {column.render(row)}
                  </TableCell>
                ))}
                {rowActions && (
                  <TableCell
                    className="text-right"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {rowActions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: card / list presentation */}
      <ul className="flex flex-col gap-2 md:hidden">
        {rows.map((row) => (
          <li
            key={getRowId(row)}
            className={cn(
              "flex flex-col gap-2.5 rounded-xl border bg-card p-3.5",
              onRowSelect && "cursor-pointer",
            )}
            onClick={onRowSelect ? () => onRowSelect(row) : undefined}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {columns
                  .filter((column) => !column.hideOnMobile)
                  .slice(0, 1)
                  .map((column) => (
                    <div key={column.key} className="truncate text-sm font-medium">
                      {column.render(row)}
                    </div>
                  ))}
              </div>
              {rowActions && <div onClick={(event) => event.stopPropagation()}>{rowActions(row)}</div>}
            </div>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t pt-2.5">
              {columns
                .filter((column) => !column.hideOnMobile)
                .slice(1)
                .map((column) => (
                  <div key={column.key} className="min-w-0">
                    <dt className="text-[0.6875rem] text-muted-foreground">
                      {column.mobileLabel ?? column.header}
                    </dt>
                    <dd className="truncate text-xs font-medium">
                      {column.render(row)}
                    </dd>
                  </div>
                ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
