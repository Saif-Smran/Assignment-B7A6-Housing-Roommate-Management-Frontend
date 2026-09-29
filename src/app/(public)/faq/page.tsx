import { HelpCircle } from "lucide-react";
import type { Metadata } from "next";
import { FaqAccordion } from "@/components/shared/faq-accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | UrbanMatch",
  description:
    "Find answers to common questions about room applications, owner property listings, Stripe payments, and viewing requests on UrbanMatch.",
};

export default function FaqPage() {
  return (
    <div className="flex flex-col w-full py-12 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-sm">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help Center & FAQ</span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed">
            Everything you need to know about browsing rooms, owner listings,
            application approvals, Stripe payments, and tenant security.
          </p>
        </div>

        {/* FAQ Accordion Component */}
        <FaqAccordion />
      </div>
    </div>
  );
}
