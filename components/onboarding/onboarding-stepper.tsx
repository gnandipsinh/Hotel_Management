"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import { ONBOARDING_STEPS } from "@/config/onboarding";
import { cn } from "@/lib/utils";

interface OnboardingStepperProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (stepNumber: number) => void;
  className?: string;
}

export function OnboardingStepper({
  currentStep,
  completedSteps,
  onStepClick,
  className,
}: OnboardingStepperProps) {
  return (
    <nav aria-label="Onboarding Progress" className={cn("w-full", className)}>
      <ol className="flex flex-col gap-2">
        {ONBOARDING_STEPS.map((stepItem) => {
          const isCompleted = completedSteps.includes(stepItem.step);
          const isCurrent = currentStep === stepItem.step;
          const isAccessible = isCompleted || isCurrent || stepItem.step <= Math.max(...completedSteps, 0) + 1;

          return (
            <li key={stepItem.id} className="relative">
              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => isAccessible && onStepClick?.(stepItem.step)}
                className={cn(
                  "group flex w-full items-start gap-3.5 rounded-xl p-3 text-left transition-all",
                  isCurrent && "bg-primary/10 text-primary shadow-xs dark:bg-primary/20",
                  !isCurrent && isAccessible && "hover:bg-muted/60 cursor-pointer text-foreground",
                  !isAccessible && "opacity-45 cursor-not-allowed text-muted-foreground",
                )}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    isCurrent && "bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/20",
                    isCompleted && !isCurrent && "bg-emerald-600 text-white dark:bg-emerald-500",
                    !isCompleted && !isCurrent && "border-2 border-border bg-background text-muted-foreground",
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckIcon className="size-3.5 stroke-[3]" aria-hidden="true" />
                  ) : (
                    <span>{stepItem.step}</span>
                  )}
                </div>

                {/* Step Title & Subtext */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className={cn(
                        "truncate text-xs font-semibold",
                        isCurrent ? "text-primary dark:text-primary-foreground" : "text-foreground",
                      )}
                    >
                      {stepItem.title}
                    </p>
                    {stepItem.badge && (
                      <span className="hidden text-[10px] text-muted-foreground xl:inline">
                        {stepItem.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {stepItem.shortTitle} · {stepItem.estimatedMinutes} min
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function MobileOnboardingProgress({
  currentStep,
  completedSteps,
}: {
  currentStep: number;
  completedSteps: number[];
}) {
  const total = ONBOARDING_STEPS.length;
  const currentDef = ONBOARDING_STEPS.find((s) => s.step === currentStep) || ONBOARDING_STEPS[0];
  const progressPercent = Math.round((currentStep / total) * 100);

  return (
    <div className="w-full border-b bg-background px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">
          Step {currentStep} of {total}: <span className="text-primary">{currentDef.shortTitle}</span>
        </span>
        <span className="text-[11px] text-muted-foreground">{completedSteps.length} done · {progressPercent}%</span>
      </div>
      {/* Progress Bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
