"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export type DashboardFilterOption = {
  value: string;
  label: string;
};

export type DashboardFilter = {
  key: string;
  label: string;
  value: string;
  options: DashboardFilterOption[];
};

type DashboardFiltersProps = {
  filters: DashboardFilter[];
  onChange: (key: string, value: string) => void;
  className?: string;
};

export function DashboardFilters({
  filters,
  onChange,
  className,
}: DashboardFiltersProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {filters.map((filter) => (
        <DashboardFilterDropdown
          key={filter.key}
          filter={filter}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

function DashboardFilterDropdown({
  filter,
  onChange,
}: {
  filter: DashboardFilter;
  onChange: (key: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const currentLabel =
    filter.options.find((option) => option.value === filter.value)?.label ??
    filter.options[0]?.label ??
    "All";

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleMouseDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface-strong)]"
      >
        <span className="text-[var(--color-ink-soft)]">{filter.label}:</span>
        {currentLabel}
        <ChevronDown
          aria-hidden="true"
          size={14}
          strokeWidth={1.8}
          className={cn("transition duration-200", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-48 rounded-[12px] border border-[var(--color-line)] bg-white p-1.5 shadow-[var(--shadow-strong)]">
          {filter.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(filter.key, option.value);
                setOpen(false);
              }}
              className={cn(
                "block w-full rounded-[8px] px-3 py-2 text-left text-sm font-semibold text-[var(--color-ink-soft)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)]",
                option.value === filter.value &&
                  "bg-[var(--color-surface-soft)] text-[var(--color-primary)]",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
