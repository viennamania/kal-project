"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  eyebrow,
  cancelLabel,
  confirmLabel,
  description,
  isPending = false,
  onClose,
  onConfirm,
  open,
  title
}: {
  eyebrow?: string;
  cancelLabel: string;
  confirmLabel: string;
  description: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPending, onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[#1E2451]/35 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      onClick={() => {
        if (!isPending) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-[32px] border border-white/80 bg-white p-5 shadow-[0_28px_70px_rgba(30,36,81,0.22)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-2 font-display text-2xl text-ink">{title}</h2>
          </div>
          <button
            aria-label="Close dialog"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-bubble text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isPending}
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-ink/70">{description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button disabled={isPending} onClick={onClose} type="button" variant="ghost">
            {cancelLabel}
          </Button>
          <Button disabled={isPending} onClick={onConfirm} type="button" variant="primary">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
