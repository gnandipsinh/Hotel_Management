"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2Icon,
  ChevronDownIcon,
  GlobeIcon,
  MenuIcon,
  MoonIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#demo" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#why-hotelhub" },
  { label: "Contact", href: "#contact" },
];

const LANGUAGES = [
  { code: "en", label: "English (IN)" },
  { code: "hi", label: "हिंदी (Hindi)" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState("English (IN)");
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageSelect = (langLabel: string) => {
    setSelectedLanguage(langLabel);
    setLanguageOpen(false);
    toast.info(`Language set to ${langLabel}`, {
      description: "Interface locale updated for international guest folios.",
    });
  };

  const handleThemeClick = () => {
    toast.info("Dark Theme Active", {
      description: "Optimized for 24/7 hotel front-desk operations and low eye strain.",
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#090D1A]/90 backdrop-blur-md border-b border-blue-500/10 shadow-lg shadow-black/40 py-3"
          : "bg-[#090D1A]/60 backdrop-blur-sm border-b border-white/5 py-4"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
            <div className="flex size-full items-center justify-center rounded-[11px] bg-[#0A0E1A]">
              <Building2Icon className="size-5 text-cyan-400" />
            </div>
            <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-40 blur-sm group-hover:opacity-75 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">
                Hotel<span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Hub</span>
              </span>
              <span className="rounded-full bg-blue-500/15 border border-blue-400/30 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300 uppercase tracking-wider">
                Pro
              </span>
            </div>
            <span className="hidden text-[10px] text-slate-400 font-medium tracking-wide sm:block">
              Hospitality Operating System
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-[#0F1426]/70 px-4 py-1.5 backdrop-blur-md md:flex shadow-inner shadow-white/5"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-white hover:bg-white/5 rounded-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#12182B] px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-blue-500/30 hover:text-white cursor-pointer"
              aria-expanded={languageOpen}
            >
              <GlobeIcon className="size-3.5 text-blue-400" />
              <span>{selectedLanguage.split(" ")[0]}</span>
              <ChevronDownIcon className="size-3 text-slate-400" />
            </button>

            {languageOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/15 bg-[#0E1324] p-1.5 shadow-2xl shadow-black backdrop-blur-lg z-50">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Language
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageSelect(lang.label)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      selectedLanguage === lang.label
                        ? "bg-blue-600/20 text-cyan-300 font-semibold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Indicator (Dark Theme active) */}
          <button
            type="button"
            onClick={handleThemeClick}
            title="Night-shift dark theme active (click for info)"
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-[#12182B] text-slate-300 hover:text-white hover:border-blue-500/30 transition-colors cursor-pointer"
          >
            <MoonIcon className="size-4 text-blue-400" />
          </button>

          {/* Login Button */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-slate-200 hover:text-white hover:bg-white/10"
          >
            <Link href="/login">Login</Link>
          </Button>

          {/* Get Started Button */}
          <Button
            asChild
            size="sm"
            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] hover:shadow-blue-500/50"
          >
            <Link href="/onboarding" className="flex items-center gap-1.5">
              <SparklesIcon className="size-3.5 text-cyan-300" />
              <span>Get Started</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            asChild
            size="sm"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
          >
            <Link href="/onboarding">Get Started</Link>
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-[#12182B] text-slate-200 transition-colors hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#0B0F20] px-4 py-6 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}

            <div className="my-2 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between pb-3 text-xs text-slate-400">
                <span>Language</span>
                <span className="text-cyan-400 font-semibold">{selectedLanguage}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pb-4">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      handleLanguageSelect(lang.label);
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-md border border-white/5 bg-[#12182B] px-2 py-1.5 text-xs text-slate-300 hover:bg-white/10 text-center"
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center border-white/15 bg-white/5 text-white"
                >
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login to Console
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-600/30"
                >
                  <Link href="/onboarding" onClick={() => setMobileMenuOpen(false)}>
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
