"use client";

import { LifeBuoyIcon, MailIcon, PhoneIcon, BookOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FAQ_ITEMS = [
  {
    question: "How do I enable or disable a module for my hotel?",
    answer:
      "Hotel modules are controlled by your subscription entitlement. Contact your account manager or use Settings → Modules to request changes. Once enabled, roles can be assigned per branch.",
  },
  {
    question: "How do branch-level permissions work?",
    answer:
      "Every user membership carries a scope: organization, hotel, branch or self. A branch manager assigned only to Branch A cannot see Branch B data anywhere in the interface.",
  },
  {
    question: "Where do I report an issue or request support?",
    answer:
      "Use the Contact Support button below to open a ticket. Support agents access is permission-controlled, time-limited and fully audited.",
  },
];

/**
 * Support / Help UI placeholder. The ticketing backend arrives in a later phase;
 * contact links are already functional.
 */
export function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LifeBuoyIcon className="size-4 text-primary" aria-hidden="true" />
            Help &amp; Support
          </DialogTitle>
          <DialogDescription>
            Answers to common questions and ways to reach our support team.
          </DialogDescription>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-sm hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="grid gap-2 rounded-lg border bg-muted/40 p-3 sm:grid-cols-2">
          <Button type="button" variant="outline" size="sm" asChild>
            <a href="mailto:support@hotelsync.example">
              <MailIcon aria-hidden="true" />
              Contact Support
            </a>
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <a href="tel:+911800123456">
              <PhoneIcon aria-hidden="true" />
              +91 1800 123 456
            </a>
          </Button>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <BookOpenIcon className="size-3.5" aria-hidden="true" />
          Knowledge base articles are coming in the Support phase.
        </p>
      </DialogContent>
    </Dialog>
  );
}
