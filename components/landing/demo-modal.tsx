"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  SparklesIcon,
  Volume2Icon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

export function DemoModal({ open, onClose }: DemoModalProps) {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [currentChapter, setCurrentChapter] = React.useState(0);
  const [progress, setProgress] = React.useState(25);

  const chapters = [
    { title: "Live Room Matrix & Check-in", timestamp: "0:15", duration: 30 },
    { title: "Dynamic UPI Payment Settlement", timestamp: "0:45", duration: 60 },
    { title: "Mobile Housekeeping Turnaround", timestamp: "1:15", duration: 90 },
    { title: "GST SAC 9963 Invoicing & Reports", timestamp: "1:45", duration: 120 },
  ];

  React.useEffect(() => {
    if (!open || !isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [open, isPlaying]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-blue-500/40 bg-[#0C1124] p-6 shadow-2xl shadow-blue-950/80 sm:p-8 z-10">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close demo modal"
        >
          <XIcon className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/20 text-cyan-400">
            <SparklesIcon className="size-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            HotelHub Platform Walkthrough
          </span>
        </div>

        <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
          Watch HotelHub in Real Action
        </h3>
        <p className="mt-1 text-xs text-slate-300 sm:text-sm">
          A 2-minute guided tour of front desk operations, instant UPI payment generation, and multi-branch management.
        </p>

        {/* Interactive Video Player Canvas */}
        <div className="mt-5 overflow-hidden rounded-xl border border-white/15 bg-black/70 p-4">
          {/* Simulated Screen */}
          <div className="relative aspect-video w-full rounded-lg bg-[#070A18] border border-white/10 overflow-hidden flex flex-col justify-between p-4">
            {/* Top Bar of player */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white">
                Chapter: {chapters[currentChapter].title}
              </span>
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] text-cyan-300 font-mono">
                HD 1080p · 60 FPS
              </span>
            </div>

            {/* Center Playback Animation & Graphic */}
            <div className="flex flex-col items-center justify-center text-center">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex size-14 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-xl shadow-blue-500/40 hover:scale-110 transition-transform cursor-pointer"
              >
                {isPlaying ? (
                  <PauseIcon className="size-6 fill-white" />
                ) : (
                  <PlayIcon className="ml-1 size-6 fill-white" />
                )}
              </button>
              <div className="mt-3 text-xs font-semibold text-white">
                {isPlaying ? "Playing Walkthrough..." : "Paused — Click to Resume"}
              </div>
              <p className="mt-1 text-[11px] text-slate-400 max-w-sm">
                Demonstrating live room check-in with dynamic Aadhaar upload and instant PhonePe / GPay QR billing.
              </p>
            </div>

            {/* Bottom Scrubber & Controls */}
            <div className="space-y-2">
              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setProgress(Math.max(0, progress - 10))}
                    className="hover:text-white"
                  >
                    <RewindIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-white"
                  >
                    {isPlaying ? <PauseIcon className="size-3.5" /> : <PlayIcon className="size-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProgress(Math.min(100, progress + 10))}
                    className="hover:text-white"
                  >
                    <FastForwardIcon className="size-3.5" />
                  </button>
                  <span className="font-mono text-slate-300">
                    {chapters[currentChapter].timestamp} / 02:15
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2Icon className="size-3.5 text-cyan-400" />
                  <span>Audio Enabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Quick Selector */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {chapters.map((ch, idx) => (
              <button
                key={ch.title}
                type="button"
                onClick={() => {
                  setCurrentChapter(idx);
                  setProgress(idx * 25 + 10);
                  setIsPlaying(true);
                }}
                className={`rounded-lg p-2 text-left transition-colors ${
                  currentChapter === idx
                    ? "bg-blue-600/30 border border-blue-500/50 text-white"
                    : "bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="text-[10px] text-cyan-300 font-mono">{ch.timestamp}</div>
                <div className="text-[11px] font-semibold truncate">{ch.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2Icon className="size-4 text-cyan-400" />
            <span>Ready to test directly? 14 interactive demo panels are preloaded.</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full sm:w-auto border-white/15 bg-white/5 text-white hover:bg-white/10"
              onClick={onClose}
            >
              <Link href="/login">Launch Demo Console</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-600/30"
              onClick={onClose}
            >
              <Link href="/onboarding" className="flex items-center gap-1.5">
                <span>Start Free Onboarding</span>
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
