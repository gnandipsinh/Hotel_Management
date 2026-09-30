"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  findNavItemByPath,
  hotelNavigationConfig,
  internalAdminNavigationConfig,
} from "@/config/navigation";
import { useShell } from "@/components/layout/shell-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const pathname = usePathname();
  const { panel } = useShell();

  const config = panel === "admin" ? internalAdminNavigationConfig : hotelNavigationConfig;
  const lookup = React.useMemo(
    () => findNavItemByPath(config, pathname),
    [config, pathname],
  );

  if (!lookup) return null;

  const { section, ancestors, item } = lookup;
  const isLast = ancestors.length === 0;

  return (
    <Breadcrumb aria-label="Breadcrumb" className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage className="truncate font-medium text-foreground">
              {item.title}
            </BreadcrumbPage>
          ) : (
            <span className="truncate text-muted-foreground">{section.title}</span>
          )}
        </BreadcrumbItem>

        {!isLast && <BreadcrumbSeparator aria-hidden="true" />}

        {ancestors.map((ancestor, index) => (
          <React.Fragment key={ancestor.id}>
            <BreadcrumbItem>
              {index === ancestors.length - 1 ? (
                <BreadcrumbPage className="truncate font-medium text-foreground">
                  {item.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={ancestor.href} className="truncate">
                    {ancestor.title}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < ancestors.length - 1 && <BreadcrumbSeparator aria-hidden="true" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
