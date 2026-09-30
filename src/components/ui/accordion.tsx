"use client";

import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

import type { AccordionItemProps as BaseAccordionProps } from "@/interfaces";

type AccordionItemProps = BaseAccordionProps & {
  title?: string;
  className?: string;
};


export function AccordionItem({
  title,
  children,
  isOpen = false,
  onToggle,
  className,
}: AccordionItemProps) {
  return (
    <div
      className={cn(
        "w-full box-border rounded-2xl border border-border/60 bg-card overflow-hidden transition-[background-color,border-color,box-shadow] duration-200",
        isOpen &&
          "border-indigo-500/40 shadow-md shadow-indigo-500/5 bg-card/90",
        className,
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold font-heading text-foreground transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="flex-1 pr-4 text-left font-heading font-semibold text-sm text-foreground">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180 text-indigo-600 dark:text-indigo-400",
          )}
        />
      </button>
      {isOpen && (
        <div className="w-full box-border px-5 pb-5 pt-0 text-xs text-muted-foreground leading-relaxed animate-in fade-in-50 duration-200 border-t border-border/30 mt-1 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
