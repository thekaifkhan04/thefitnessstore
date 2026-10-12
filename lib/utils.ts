import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function calculateDiscount(sellingPricePaise: number, originalPricePaise?: number | null): number | null {
  if (!originalPricePaise || originalPricePaise <= sellingPricePaise) return null;
  const discount = Math.round(((originalPricePaise - sellingPricePaise) / originalPricePaise) * 100);
  return discount > 0 ? discount : null;
}
