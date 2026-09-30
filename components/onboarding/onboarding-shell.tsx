"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Building2Icon,
  RotateCcwIcon,
  SaveIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ONBOARDING_STEPS } from "@/config/onboarding";
import { useOnboarding } from "@/lib/onboarding/use-onboarding";
import { MobileOnboardingProgress, OnboardingStepper } from "@/components/onboarding/onboarding-stepper";
import { Step1HotelInfo } from "@/components/onboarding/steps/step1-hotel-info";
import { Step2HotelBranding } from "@/components/onboarding/steps/step2-branding";
import { Step3BranchSetup } from "@/components/onboarding/steps/step3-branch-setup";
import { Step4PropertyConfig } from "@/components/onboarding/steps/step4-property-config";
import { Step5ServicesModules } from "@/components/onboarding/steps/step5-services-modules";
import { Step6PaymentUpi } from "@/components/onboarding/steps/step6-payment-upi";
import { Step7Review } from "@/components/onboarding/steps/step7-review";
import { OnboardingSuccess } from "@/components/onboarding/onboarding-success";

export function OnboardingShell() {
  const onboarding = useOnboarding();
  const {
    state,
    goToStep,
    nextStep,
    prevStep,
    resetProgress,
  } = onboarding;

  const handleSaveDraft = () => {
    toast.success("Progress saved locally.", {
      description: "You can resume your onboarding anytime on this browser.",
    });
  };

  if (state.isCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Building2Icon className="size-5" />
              </span>
              <span className="flex flex-col text-left leading-tight">
                <span className="text-sm font-bold tracking-tight">HotelSync</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Hotel Onboarding
                </span>
              </span>
            </Link>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <OnboardingSuccess state={state} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Mobile Top Navbar */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2Icon className="size-4" />
          </span>
          <span className="text-sm font-bold">HotelSync</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSaveDraft}
            className="h-8 text-xs"
          >
            <SaveIcon className="size-3.5" />
            <span className="hidden sm:inline">Save Draft</span>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/login">Demo Login</Link>
          </Button>
        </div>
      </header>

      {/* Mobile Stepper Bar */}
      <MobileOnboardingProgress
        currentStep={state.currentStep}
        completedSteps={state.completedSteps}
      />

      <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] w-full max-w-7xl lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
        {/* Desktop Left Sidebar: Branding & Vertical Stepper */}
        <aside className="sticky top-0 hidden h-screen flex-col justify-between border-r bg-card/60 p-6 backdrop-blur lg:flex xl:p-8">
          <div className="space-y-6">
            {/* SaaS Brand */}
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Building2Icon className="size-5" />
              </span>
              <div>
                <h1 className="text-base font-bold tracking-tight text-foreground">
                  HotelSync
                </h1>
                <p className="text-xs text-muted-foreground">
                  Enterprise Hotel Management
                </p>
              </div>
            </Link>

            <div className="rounded-xl border bg-muted/40 p-3.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <SparklesIcon className="size-3.5 text-primary" />
                Hotel Onboarding Console
              </div>
              <p className="mt-1 leading-relaxed">
                Step-by-step property initialization. Configures role permissions, rooms, and front desk matrices.
              </p>
            </div>

            {/* Stepper Component */}
            <div className="pt-2">
              <OnboardingStepper
                currentStep={state.currentStep}
                completedSteps={state.completedSteps}
                onStepClick={goToStep}
              />
            </div>
          </div>

          {/* Footer Branding Note */}
          <div className="space-y-3 pt-6 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button
                type="button"
                onClick={resetProgress}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground focus:outline-hidden"
              >
                <RotateCcwIcon className="size-3" />
                Reset Form
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1 text-[11px] text-primary hover:underline focus:outline-hidden"
              >
                <SaveIcon className="size-3" />
                Save Draft
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheckIcon className="size-3.5 text-emerald-600" />
              Client-side onboarding · Zero data loss
            </div>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex flex-col justify-between p-4 sm:p-6 lg:p-10 xl:p-12">
          {/* Active Step Form View */}
          <div className="mx-auto w-full max-w-3xl">
            {state.currentStep === 1 && <Step1HotelInfo onboarding={onboarding} />}
            {state.currentStep === 2 && <Step2HotelBranding onboarding={onboarding} />}
            {state.currentStep === 3 && <Step3BranchSetup onboarding={onboarding} />}
            {state.currentStep === 4 && <Step4PropertyConfig onboarding={onboarding} />}
            {state.currentStep === 5 && <Step5ServicesModules onboarding={onboarding} />}
            {state.currentStep === 6 && <Step6PaymentUpi onboarding={onboarding} />}
            {state.currentStep === 7 && <Step7Review onboarding={onboarding} />}
          </div>

          {/* Bottom Navigation Buttons Bar */}
          <div className="mx-auto mt-12 flex w-full max-w-3xl items-center justify-between border-t pt-6">
            <div>
              {state.currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={prevStep}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <ArrowLeftIcon className="size-4" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSaveDraft}
                className="hidden text-xs sm:inline-flex"
              >
                <SaveIcon className="size-3.5" />
                Save Draft
              </Button>

              {state.currentStep < 7 ? (
                <Button
                  type="button"
                  size="default"
                  onClick={nextStep}
                  className="gap-2 text-xs sm:text-sm shadow-sm"
                >
                  <span className="hidden sm:inline">Continue to </span>
                  <span>{ONBOARDING_STEPS[state.currentStep]?.shortTitle || "Next"}</span>
                  <ArrowRightIcon className="size-4 shrink-0" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="default"
                  onClick={onboarding.completeOnboarding}
                  disabled={onboarding.isSubmitting}
                  className="gap-2 text-xs sm:text-sm shadow-sm"
                >
                  <SparklesIcon className="size-4" />
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
