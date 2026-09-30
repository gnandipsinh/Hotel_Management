"use client";

import * as React from "react";
import {
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  ImageIcon,
  Loader2Icon,
  Trash2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/storage/file-categories";
import {
  ResponsiveTable,
  type ResponsiveColumn,
} from "@/components/data/responsive-table";
import type { FileAssetDto } from "@/types/media";

export interface FileListProps {
  assets: FileAssetDto[];
  loading?: boolean;
  busyId?: string | null;
  onDelete?: (asset: FileAssetDto) => void;
  className?: string;
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/**
 * Tabular presentation of file assets (documents, proofs) using the shared
 * responsive table: semantic table on desktop, cards on mobile.
 */
export function FileList({
  assets,
  loading = false,
  busyId = null,
  onDelete,
  className,
}: FileListProps) {
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const columns: ResponsiveColumn<FileAssetDto>[] = [
    {
      key: "name",
      header: "File",
      render: (row) => (
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
            {row.mimeType.startsWith("image/") ? (
              <ImageIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <FileTextIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{row.originalName}</span>
            <span className="block text-[11px] uppercase text-muted-foreground">
              {row.category.replace(/_/g, " ")}
            </span>
          </span>
        </span>
      ),
    },
    {
      key: "size",
      header: "Size",
      align: "right",
      render: (row) => (
        <span className="tabular-nums text-xs">{formatBytes(row.size)}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <Badge variant="outline" className="text-[10px] uppercase">
          {row.extension}
        </Badge>
      ),
      mobileLabel: "Format",
    },
    {
      key: "access",
      header: "Access",
      render: (row) => (
        <Badge variant={row.access === "private" ? "secondary" : "outline"}>
          {row.access}
        </Badge>
      ),
    },
    {
      key: "uploaded",
      header: "Uploaded",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {DATE_FORMAT.format(new Date(row.createdAt))}
        </span>
      ),
      mobileLabel: "Uploaded",
    },
  ];

  return (
    <ResponsiveTable<FileAssetDto>
      columns={columns}
      rows={assets}
      getRowId={(row) => row.id}
      loading={loading}
      caption="Uploaded files"
      className={cn(className)}
      empty={{
        title: "No files yet",
        description: "Uploaded documents and proofs will be listed here.",
        compact: true,
      }}
      rowActions={(row) => {
        const busy = busyId === row.id;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button type="button" size="icon-xs" variant="ghost" asChild>
              <a href={row.url} target="_blank" rel="noreferrer" aria-label={`Open ${row.originalName}`}>
                <EyeIcon />
              </a>
            </Button>
            <Button type="button" size="icon-xs" variant="ghost" asChild>
              <a
                href={row.url}
                download={row.originalName}
                aria-label={`Download ${row.originalName}`}
              >
                <DownloadIcon />
              </a>
            </Button>
            {onDelete && (
              <Button
                type="button"
                size="icon-xs"
                variant={confirmId === row.id ? "destructive" : "ghost"}
                aria-label={
                  confirmId === row.id
                    ? `Confirm deletion of ${row.originalName}`
                    : `Delete ${row.originalName}`
                }
                onClick={() => {
                  if (confirmId === row.id) {
                    setConfirmId(null);
                    onDelete(row);
                  } else {
                    setConfirmId(row.id);
                  }
                }}
              >
                {busy ? (
                  <Loader2Icon className="animate-spin" />
                ) : confirmId === row.id ? (
                  <span className="text-[10px] font-semibold">Sure?</span>
                ) : (
                  <Trash2Icon />
                )}
              </Button>
            )}
          </div>
        );
      }}
    />
  );
}
