"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  INITIAL_ONBOARDING_STATE,
  ONBOARDING_STEPS,
  ONBOARDING_STORAGE_KEY,
  validateStep,
} from "@/config/onboarding";
import type {
  OnboardingBranch,
  OnboardingBranding,
  OnboardingHotelInfo,
  OnboardingPayment,
  OnboardingPropertyConfig,
  OnboardingState,
} from "@/types/onboarding";
import type { CustomerModuleKey } from "@/types/navigation";
import type { FileAssetDto } from "@/types/media";
import { createDemoSession } from "@/lib/demo/demo-session";
import type { DemoUser } from "@/config/demo";

function getInitialState(): OnboardingState {
  if (typeof window === "undefined") {
    return INITIAL_ONBOARDING_STATE;
  }
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return INITIAL_ONBOARDING_STATE;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.currentStep === "number" && parsed.hotel) {
      return {
        ...INITIAL_ONBOARDING_STATE,
        ...parsed,
        hotel: { ...INITIAL_ONBOARDING_STATE.hotel, ...(parsed.hotel || {}) },
        branding: { ...INITIAL_ONBOARDING_STATE.branding, ...(parsed.branding || {}) },
        branches: Array.isArray(parsed.branches) && parsed.branches.length > 0
          ? parsed.branches
          : INITIAL_ONBOARDING_STATE.branches,
        property: { ...INITIAL_ONBOARDING_STATE.property, ...(parsed.property || {}) },
        modules: { ...INITIAL_ONBOARDING_STATE.modules, ...(parsed.modules || {}) },
        payment: { ...INITIAL_ONBOARDING_STATE.payment, ...(parsed.payment || {}) },
      };
    }
    return INITIAL_ONBOARDING_STATE;
  } catch {
    return INITIAL_ONBOARDING_STATE;
  }
}

export function useOnboarding() {
  const [state, setState] = React.useState<OnboardingState>(getInitialState);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Sync to local storage
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [state]);

  const clearFieldError = React.useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const goToStep = React.useCallback((stepNumber: number) => {
    if (stepNumber < 1 || stepNumber > ONBOARDING_STEPS.length) return;
    setErrors({});
    setState((prev) => ({
      ...prev,
      currentStep: stepNumber,
    }));
  }, []);

  const nextStep = React.useCallback(() => {
    const validation = validateStep(state.currentStep, state);
    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      if (firstError) {
        toast.error("Please resolve the highlighted fields", {
          description: firstError,
        });
      }
      return false;
    }

    setErrors({});
    setState((prev) => {
      const nextStepNum = Math.min(prev.currentStep + 1, ONBOARDING_STEPS.length);
      const completedSteps = Array.from(new Set([...prev.completedSteps, prev.currentStep]));
      return {
        ...prev,
        currentStep: nextStepNum,
        completedSteps,
      };
    });
    return true;
  }, [state]);

  const prevStep = React.useCallback(() => {
    setErrors({});
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const updateHotel = React.useCallback(
    (patch: Partial<OnboardingHotelInfo>) => {
      setState((prev) => ({
        ...prev,
        hotel: { ...prev.hotel, ...patch },
      }));
      // Clear errors for patched fields
      Object.keys(patch).forEach((k) => clearFieldError(k));
    },
    [clearFieldError],
  );

  const updateBranding = React.useCallback(
    (patch: Partial<OnboardingBranding>) => {
      setState((prev) => ({
        ...prev,
        branding: { ...prev.branding, ...patch },
      }));
      Object.keys(patch).forEach((k) => clearFieldError(k));
    },
    [clearFieldError],
  );

  const addGalleryImage = React.useCallback((asset: FileAssetDto) => {
    setState((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        gallery: [...prev.branding.gallery, asset],
      },
    }));
  }, []);

  const removeGalleryImage = React.useCallback((assetId: string) => {
    setState((prev) => {
      const filtered = prev.branding.gallery.filter((item) => item.id !== assetId);
      // If we deleted the primary, make the first one primary
      if (filtered.length > 0 && !filtered.some((item) => item.isPrimary)) {
        filtered[0] = { ...filtered[0], isPrimary: true };
      }
      return {
        ...prev,
        branding: {
          ...prev.branding,
          gallery: filtered,
        },
      };
    });
  }, []);

  const setPrimaryGalleryImage = React.useCallback((assetId: string) => {
    setState((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        gallery: prev.branding.gallery.map((item) => ({
          ...item,
          isPrimary: item.id === assetId,
        })),
      },
    }));
  }, []);

  const reorderGalleryImage = React.useCallback((assetId: string, direction: -1 | 1) => {
    setState((prev) => {
      const gallery = [...prev.branding.gallery];
      const index = gallery.findIndex((item) => item.id === assetId);
      if (index === -1) return prev;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= gallery.length) return prev;

      const temp = gallery[index];
      gallery[index] = gallery[targetIndex];
      gallery[targetIndex] = temp;

      return {
        ...prev,
        branding: {
          ...prev.branding,
          gallery,
        },
      };
    });
  }, []);

  const addBranch = React.useCallback((branch: OnboardingBranch) => {
    setState((prev) => {
      const isFirst = prev.branches.length === 0;
      const newBranch = {
        ...branch,
        isPrimary: isFirst ? true : branch.isPrimary,
      };
      const branches = isFirst
        ? [newBranch]
        : branch.isPrimary
          ? prev.branches.map((b) => ({ ...b, isPrimary: false })).concat(newBranch)
          : [...prev.branches, newBranch];
      return {
        ...prev,
        branches,
      };
    });
  }, []);

  const updateBranch = React.useCallback(
    (branchId: string, patch: Partial<OnboardingBranch>) => {
      setState((prev) => {
        let branches = prev.branches.map((b) => (b.id === branchId ? { ...b, ...patch } : b));
        if (patch.isPrimary) {
          branches = branches.map((b) => ({
            ...b,
            isPrimary: b.id === branchId,
          }));
        }
        return {
          ...prev,
          branches,
        };
      });
      setErrors((prevErr) => {
        const next = { ...prevErr };
        delete next.branches;
        delete next.primary;
        return next;
      });
    },
    [],
  );

  const removeBranch = React.useCallback((branchId: string) => {
    setState((prev) => {
      if (prev.branches.length <= 1) {
        toast.error("At least one branch is required for property operations.");
        return prev;
      }
      const filtered = prev.branches.filter((b) => b.id !== branchId);
      // If we removed the primary branch, mark the first one as primary
      if (!filtered.some((b) => b.isPrimary) && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isPrimary: true };
      }
      return {
        ...prev,
        branches: filtered,
      };
    });
  }, []);

  const setPrimaryBranch = React.useCallback((branchId: string) => {
    setState((prev) => ({
      ...prev,
      branches: prev.branches.map((b) => ({
        ...b,
        isPrimary: b.id === branchId,
      })),
    }));
  }, []);

  const updateProperty = React.useCallback(
    (patch: Partial<OnboardingPropertyConfig>) => {
      setState((prev) => ({
        ...prev,
        property: { ...prev.property, ...patch },
      }));
      Object.keys(patch).forEach((k) => clearFieldError(k));
    },
    [clearFieldError],
  );

  const addRoomCategory = React.useCallback((categoryName: string) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    setState((prev) => {
      if (prev.property.roomCategories.includes(trimmed)) return prev;
      return {
        ...prev,
        property: {
          ...prev.property,
          roomCategories: [...prev.property.roomCategories, trimmed],
        },
      };
    });
  }, []);

  const removeRoomCategory = React.useCallback((categoryName: string) => {
    setState((prev) => {
      if (prev.property.roomCategories.length <= 1) {
        toast.error("At least one room category is required.");
        return prev;
      }
      return {
        ...prev,
        property: {
          ...prev.property,
          roomCategories: prev.property.roomCategories.filter((c) => c !== categoryName),
        },
      };
    });
  }, []);

  const toggleModule = React.useCallback((moduleKey: CustomerModuleKey) => {
    setState((prev) => {
      const current = prev.modules.selectedKeys;
      const nextKeys = current.includes(moduleKey)
        ? current.filter((k) => k !== moduleKey)
        : [...current, moduleKey];
      return {
        ...prev,
        modules: {
          selectedKeys: nextKeys,
        },
      };
    });
    setErrors((prevErr) => {
      const next = { ...prevErr };
      delete next.modules;
      return next;
    });
  }, []);

  const selectAllModules = React.useCallback((allKeys: CustomerModuleKey[]) => {
    setState((prev) => ({
      ...prev,
      modules: { selectedKeys: allKeys },
    }));
    setErrors((prevErr) => {
      const next = { ...prevErr };
      delete next.modules;
      return next;
    });
  }, []);

  const selectRecommendedModules = React.useCallback((recKeys: CustomerModuleKey[]) => {
    setState((prev) => ({
      ...prev,
      modules: { selectedKeys: recKeys },
    }));
    setErrors((prevErr) => {
      const next = { ...prevErr };
      delete next.modules;
      return next;
    });
  }, []);

  const clearModules = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      modules: { selectedKeys: [] },
    }));
  }, []);

  const updatePayment = React.useCallback(
    (patch: Partial<OnboardingPayment>) => {
      setState((prev) => ({
        ...prev,
        payment: { ...prev.payment, ...patch },
      }));
      Object.keys(patch).forEach((k) => clearFieldError(k));
    },
    [clearFieldError],
  );

  const resetProgress = React.useCallback(() => {
    setState(INITIAL_ONBOARDING_STATE);
    setErrors({});
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    }
    toast.info("Onboarding form reset to template defaults.");
  }, []);

  const completeOnboarding = React.useCallback(async () => {
    setIsSubmitting(true);
    // Validate all steps before finalizing
    for (let s = 1; s <= 6; s += 1) {
      const result = validateStep(s, state);
      if (!result.isValid) {
        setIsSubmitting(false);
        setErrors(result.errors);
        goToStep(s);
        toast.error(`Please complete required fields in Step ${s}`);
        return false;
      }
    }

    try {
      // Simulate high-end provisioning delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const updatedState: OnboardingState = {
        ...state,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      };
      setState(updatedState);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updatedState));

        // Create or update demo session as hotel_super_admin with the primary branch
        const primaryBranch =
          updatedState.branches.find((b) => b.isPrimary) || updatedState.branches[0];
        const primaryBranchId = primaryBranch ? primaryBranch.id : "branch-primary-01";

        const onboardedUser: DemoUser = {
          id: "demo-owner",
          name: updatedState.hotel.name || "Hotel Owner",
          email: updatedState.hotel.email || "owner@hotelsync.demo",
          role: "hotel_super_admin",
          roleName: "Hotel Super Admin (Owner)",
          hotelId: "hotel-01",
          branchIds: [primaryBranchId],
        };

        createDemoSession(onboardedUser);
      }

      toast.success("Hotel workspace provisioned successfully!");
      return true;
    } catch {
      toast.error("Failed to provision workspace. Please retry.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [goToStep, state]);

  return {
    state,
    errors,
    isSubmitting,
    goToStep,
    nextStep,
    prevStep,
    updateHotel,
    updateBranding,
    addGalleryImage,
    removeGalleryImage,
    setPrimaryGalleryImage,
    reorderGalleryImage,
    addBranch,
    updateBranch,
    removeBranch,
    setPrimaryBranch,
    updateProperty,
    addRoomCategory,
    removeRoomCategory,
    toggleModule,
    selectAllModules,
    selectRecommendedModules,
    clearModules,
    updatePayment,
    resetProgress,
    completeOnboarding,
    clearFieldError,
  };
}

export type UseOnboardingReturn = ReturnType<typeof useOnboarding>;
