import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, start = 6, end = 4) {
  if (!address) {
    return "";
  }

  if (address.length <= start + end) {
    return address;
  }

  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function maskPhone(phone?: string | null) {
  if (!phone) {
    return "••••";
  }

  const digits = phone.replace(/[^\d+]/g, "");

  if (digits.length < 4) {
    return digits;
  }

  return `${digits.slice(0, Math.max(0, digits.length - 4)).replace(/\d/g, "•")}${digits.slice(-4)}`;
}

export function formatAmount(value: number | string, locale = "en-US") {
  const asNumber = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(asNumber)) {
    return "0";
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 4
  }).format(asNumber);
}

export function formatCompact(value: number, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatDate(input: string | Date, locale = "ko-KR") {
  const date = input instanceof Date ? input : new Date(input);

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizePhone(phone?: string | null) {
  if (!phone) {
    return null;
  }

  const normalized = phone.trim().replace(/[^\d+]/g, "");
  return normalized.length > 0 ? normalized : null;
}

export function formatPhoneInputValue(phone?: string | null) {
  const normalized = normalizePhone(phone);

  if (!normalized) {
    return "";
  }

  const digits = normalized.replace(/\D/g, "");

  if (digits.startsWith("82") && digits.length > 2) {
    return `0${digits.slice(2)}`;
  }

  if (normalized.startsWith("+")) {
    return `+${digits}`;
  }

  return digits;
}
