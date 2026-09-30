import type { Metadata } from "next";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

export const metadata: Metadata = {
  title: "Get Started — Hotel Onboarding | HotelSync",
  description:
    "Set up your luxury hotel property, operating branches, room inventory, and customized operational modules.",
};

export default function OnboardingPage() {
  return <OnboardingShell />;
}
