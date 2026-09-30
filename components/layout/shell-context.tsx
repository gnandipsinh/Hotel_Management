"use client";

import * as React from "react";
import { HOTEL_MODULE_PRESETS } from "@/config/navigation";
import { MOCK_BRANCHES, MOCK_HOTELS, MOCK_HOTEL_USER, MOCK_PLATFORM_ADMIN_USER } from "@/lib/mock-data";
import { getEffectiveModules } from "@/config/demo";
import { getDemoUserProfile, useDemoSession } from "@/lib/demo/demo-session";
import type { CustomerModuleKey } from "@/types/navigation";
import type { BranchInfo, HotelInfo, UserProfile } from "@/types/context";

export type ShellPanel = "hotel" | "admin";

interface ShellContextValue {
  panel: ShellPanel;
  setPanel: (panel: ShellPanel) => void;
  hotels: HotelInfo[];
  hotel: HotelInfo;
  branches: BranchInfo[];
  branch: BranchInfo;
  setHotelId: (hotelId: string) => void;
  setBranchId: (branchId: string) => void;
  user: UserProfile;
  enabledModules: CustomerModuleKey[];
  setEnabledModules: React.Dispatch<React.SetStateAction<CustomerModuleKey[]>>;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

const ShellContext = React.createContext<ShellContextValue | null>(null);

export function useShell(): ShellContextValue {
  const context = React.useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return context;
}

/**
 * Shared application shell state for the hotel operations panel and the
 * internal platform control plane.
 *
 * Phase 8: when a demo session exists, the tenant context (user, hotel,
 * branches, enabled modules) is derived from the centralized demo
 * configuration so hotel data can never leak across tenants. Without a
 * session the original Phase 5 mock defaults apply.
 */
export function ShellProvider({
  children,
  initialPanel = "hotel",
}: {
  children: React.ReactNode;
  initialPanel?: ShellPanel;
}) {
  const [panel, setPanel] = React.useState<ShellPanel>(initialPanel);
  const [hotelIdState, setHotelIdState] = React.useState<string>(MOCK_HOTELS[0].id);
  const [branchId, setBranchIdState] = React.useState<string>("");
  const [enabledModulesState, setEnabledModules] = React.useState<CustomerModuleKey[]>(
    HOTEL_MODULE_PRESETS[MOCK_HOTELS[0].id],
  );
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const demoSession = useDemoSession();
  const demoProfile = React.useMemo(() => getDemoUserProfile(demoSession), [demoSession]);

  // A hotel demo session is locked to its own tenant — never mix hotel data.
  const lockedHotelId = demoSession?.hotelId;
  const hotels = React.useMemo(
    () =>
      lockedHotelId
        ? MOCK_HOTELS.filter((item) => item.id === lockedHotelId)
        : MOCK_HOTELS,
    [lockedHotelId],
  );

  const hotelId = lockedHotelId ?? hotelIdState;
  const hotel = React.useMemo(
    () => hotels.find((item) => item.id === hotelId) ?? hotels[0] ?? MOCK_HOTELS[0],
    [hotels, hotelId],
  );

  const branches = React.useMemo(
    () =>
      MOCK_BRANCHES.filter(
        (item) =>
          item.hotelId === hotel.id &&
          (!demoSession || demoSession.branchIds.includes(item.id)),
      ),
    [hotel, demoSession],
  );

  const branch = React.useMemo(
    () =>
      branches.find((item) => item.id === branchId) ??
      branches.find((item) => item.isMain) ??
      branches[0],
    [branches, branchId],
  );

  const user: UserProfile =
    demoProfile ?? (panel === "admin" ? MOCK_PLATFORM_ADMIN_USER : MOCK_HOTEL_USER);

  // With a demo session, module access = role grants ∩ hotel plan modules.
  // Without a session the Phase 5 preset state stays fully interactive.
  const enabledModules = React.useMemo(
    () =>
      demoSession
        ? getEffectiveModules(demoSession.role, demoSession.hotelId)
        : enabledModulesState,
    [demoSession, enabledModulesState],
  );

  const setHotelId = React.useCallback(
    (nextHotelId: string) => {
      // Tenant lock: a demo hotel session cannot switch hotels.
      if (lockedHotelId && nextHotelId !== lockedHotelId) return;
      const nextHotelBranches = MOCK_BRANCHES.filter(
        (item) => item.hotelId === nextHotelId,
      );
      setHotelIdState(nextHotelId);
      setBranchIdState(
        nextHotelBranches.find((item) => item.isMain)?.id ?? nextHotelBranches[0]?.id ?? "",
      );
      setEnabledModules(HOTEL_MODULE_PRESETS[nextHotelId] ?? []);
    },
    [lockedHotelId],
  );

  const setBranchId = React.useCallback((nextBranchId: string) => {
    setBranchIdState(nextBranchId);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    setSidebarCollapsed((value) => !value);
  }, []);

  const value = React.useMemo<ShellContextValue>(
    () => ({
      panel,
      setPanel,
      hotels,
      hotel,
      branches,
      branch,
      setHotelId,
      setBranchId,
      user,
      enabledModules,
      setEnabledModules,
      sidebarCollapsed,
      toggleSidebar,
      mobileNavOpen,
      setMobileNavOpen,
    }),
    [
      panel,
      hotels,
      hotel,
      branches,
      branch,
      setHotelId,
      setBranchId,
      user,
      enabledModules,
      sidebarCollapsed,
      toggleSidebar,
      mobileNavOpen,
    ],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
