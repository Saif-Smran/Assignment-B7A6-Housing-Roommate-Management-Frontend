"use client";

import {
  Building,
  CreditCard,
  HelpCircle,
  MessageSquare,
  Search,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import * as React from "react";
import { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface FaqItem {
  id: string;
  category: "tenant" | "owner" | "payment" | "security";
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  // Tenant FAQs
  {
    id: "t1",
    category: "tenant",
    question: "How do I request an in-person or virtual room viewing?",
    answer:
      "Simply navigate to any property detail page, select your preferred date and time on the viewing request card, add optional notes, and click 'Request Viewing'. The property owner will confirm or reschedule through their dashboard.",
  },
  {
    id: "t2",
    category: "tenant",
    question: "What is the step-by-step room booking application process?",
    answer:
      "First, find your desired room and click 'Apply Now'. Fill out your expected move-in date and a short message for the owner. Once submitted, your application status will show 'PENDING'. When the owner accepts your application, a 'Pay Now' button will unlock for secure Stripe payment.",
  },
  {
    id: "t3",
    category: "tenant",
    question: "How do maintenance requests work for tenants?",
    answer:
      "Once your booking is approved and assigned, you can access the Maintenance tab in your Tenant Dashboard. Submit repair tickets with priority levels (Low, Medium, High). Owners receive immediate alerts and update ticket progress in real-time.",
  },
  {
    id: "t4",
    category: "tenant",
    question: "Are there any hidden broker fees charged to tenants?",
    answer:
      "Zero! UrbanMatch connects tenants directly with verified property owners. You only pay the agreed monthly rent and security deposit—never any secret brokerage or agent commissions.",
  },

  // Owner FAQs
  {
    id: "o1",
    category: "owner",
    question: "How do I list a new property and add individual rooms?",
    answer:
      "Use our 4-step Owner Wizard at `/owner/properties/new`. Enter basic address details, select amenities, upload photos to Cloudinary, and define room specifications (rent, deposit, availability dates, and capacity).",
  },
  {
    id: "o2",
    category: "owner",
    question: "How do I approve or reject room applications?",
    answer:
      "Go to your Owner Dashboard under 'Applications'. You can review applicant profiles, move-in dates, and messages. Click 'Approve' to authorize Stripe payment or 'Reject' to decline.",
  },
  {
    id: "o3",
    category: "owner",
    question: "When is a tenant officially assigned to a room?",
    answer:
      "After approving an application and verifying successful Stripe payment, click 'Assign Tenant' on the room management screen. This locks the room status as unavailable and connects the tenant to maintenance tracking.",
  },

  // Payment FAQs
  {
    id: "p1",
    category: "payment",
    question: "How does the Stripe payment integration work?",
    answer:
      "When paying for rent or security deposits, clicking 'Pay Now' redirects you to a secure Stripe Checkout session. After payment completion, Stripe webhooks update your payment status instantly to 'COMPLETED'.",
  },
  {
    id: "p2",
    category: "payment",
    question: "What currencies and payment types are supported?",
    answer:
      "The platform supports standard card transactions (Visa, Mastercard, AMEX) via Stripe test mode for RENT, DEPOSIT, and UTILITY payments in BDT and USD.",
  },
  {
    id: "p3",
    category: "payment",
    question: "What happens if a payment session expires or is cancelled?",
    answer:
      "If you cancel or close the Stripe Checkout window, your payment status remains 'PENDING'. You can retry payment anytime from your Tenant Dashboard under 'My Payments'. Pending payments expire automatically after 24 hours.",
  },

  // Security FAQs
  {
    id: "s1",
    category: "security",
    question: "How does UrbanMatch verify property owners and listings?",
    answer:
      "All property owners must verify their NID/passport credentials during registration. Our moderation team reviews property address details and photos to ensure 100% authentic listings.",
  },
  {
    id: "s2",
    category: "security",
    question: "Is my personal data and payment information secure?",
    answer:
      "Yes. Payment card data is processed exclusively through Stripe PCI-DSS compliant infrastructure. Passwords use industry-grade hashing, and access tokens are managed via secure HttpOnly cookies.",
  },
];

export function FaqAccordion() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [openId, setOpenId] = React.useState<string | null>("t1");

  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "tenant", label: "For Tenants", icon: UserCheck },
    { id: "owner", label: "For Owners", icon: Building },
    { id: "payment", label: "Payments & Stripe", icon: CreditCard },
    { id: "security", label: "Trust & Security", icon: ShieldCheck },
  ];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Ensure 1 item is open by default when category or search changes
  React.useEffect(() => {
    if (filteredFaqs.length > 0) {
      const isCurrentOpenVisible = filteredFaqs.some((f) => f.id === openId);
      if (!isCurrentOpenVisible) {
        setOpenId(filteredFaqs[0].id);
      }
    }
  }, [filteredFaqs, openId]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500" />
        <Input
          type="text"
          id="faq-search-input"
          placeholder="Search questions (e.g. Stripe, viewing, deposit, application)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 pl-11 pr-4 rounded-2xl border-border/70 bg-card/80 backdrop-blur-md text-sm shadow-sm placeholder:text-muted-foreground/70 w-full"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion List */}
      {filteredFaqs.length > 0 ? (
        <div className="w-full space-y-3">
          {filteredFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              title={faq.question}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            >
              <p>{faq.answer}</p>
            </AccordionItem>
          ))}
        </div>
      ) : (
        /* Empty Search Result */
        <div className="rounded-3xl border border-dashed border-border/80 bg-background/50 p-12 text-center space-y-3">
          <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="font-heading font-semibold text-base text-foreground">
            No matching questions found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try searching for terms like "viewing", "deposit", "owner", or
            browse all categories.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="rounded-full text-xs"
          >
            Reset Search
          </Button>
        </div>
      )}

      {/* Help Banner */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-foreground">
              Still have questions?
            </h4>
            <p className="text-xs text-muted-foreground">
              Our support team is available 24/7 to assist you.
            </p>
          </div>
        </div>
        <Button
          asChild
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs shrink-0"
        >
          <a href="/contact">Contact Support</a>
        </Button>
      </div>
    </div>
  );
}
