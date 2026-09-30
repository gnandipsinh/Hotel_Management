"use client";

import * as React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureStrip } from "@/components/landing/feature-strip";
import { WhySection } from "@/components/landing/why-section";
import { InteractiveDemoSection } from "@/components/landing/interactive-demo";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";
import { DemoModal } from "@/components/landing/demo-modal";

/**
 * HotelHub Landing Page
 *
 * Full functionality enabled:
 * - Fixed/Sticky Navbar with smooth anchor navigation, language switcher, theme indicator, and auth routes
 * - Hero section with dynamic headline, CTAs, feature checks, and fully interactive dashboard preview
 * - Interactive Hotel Dashboard Preview with branch switching, real-time search, quick check-in modal, room inspector, and live feed
 * - 10-item feature icon strip with interactive capability detail modals
 * - Why HotelHub section with video walkthrough preview and 4 KPI stats cards
 * - Interactive Live Demo Sandbox (#demo) with dynamic UPI QR payment simulator, GST slab calculator, and 14-role RBAC switcher
 * - 6-item deep-dive features grid with modern dark cards
 * - Transparent INR pricing section with monthly/annual toggle and highlighted Professional plan
 * - Hospitality operator testimonials from Udaipur, Goa, and Bengaluru
 * - Final conversion CTA section with trust indicators
 * - Interactive guided walkthrough modal with playback controls and chapter jump
 * - Footer with priority callback request form and newsletter subscription
 */
export default function HotelHubLandingPage() {
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#070A16] text-slate-100 selection:bg-blue-500/20 selection:text-cyan-300">
      <Link
        href="/onboarding"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-3 focus:py-1.5 focus:text-xs focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Skip to Hotel Onboarding (Get Started)
      </Link>
      {/* 1. Fixed/Sticky Navbar */}
      <LandingNavbar />

      <main>
        {/* 2. Hero Section with Live Interactive Dashboard Mockup */}
        <HeroSection onWatchDemo={() => setDemoModalOpen(true)} />

        {/* 3. Feature Icon Strip with Interactive Capability Inspect */}
        <FeatureStrip />

        {/* 4. Why HotelHub Section */}
        <WhySection onWatchDemo={() => setDemoModalOpen(true)} />

        {/* 5. Interactive Live Sandbox Demo Section (#demo) */}
        <InteractiveDemoSection />

        {/* 6. Comprehensive Features Grid (#features) */}
        <FeaturesGrid />

        {/* 7. Transparent Pricing Section (#pricing) */}
        <PricingSection />

        {/* 8. Hospitality Operator Testimonials */}
        <TestimonialsSection />

        {/* 9. Final CTA Section */}
        <FinalCta onWatchDemo={() => setDemoModalOpen(true)} />
      </main>

      {/* 10. Comprehensive Footer (#contact) with Callback Request */}
      <LandingFooter />

      {/* Interactive Platform Walkthrough Demo Modal */}
      <DemoModal
        open={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </div>
  );
}
