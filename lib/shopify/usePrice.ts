import { useMemo } from "react";

interface Price {
  amount: number;
  currencyCode: string;
  locales?: string | string[];
}

export function formatPrice({ amount, currencyCode, locales }: Price): string {
  return new Intl.NumberFormat(locales, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export function formatVariantPrice({
  amount,
  baseAmount,
  currencyCode,
}: {
  baseAmount: number;
  amount: number;
  currencyCode: string;
}) {
  const hasDiscount = baseAmount > amount;
  const formatDiscount = new Intl.NumberFormat("", { style: "percent" });
  const discount = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null;

  const price = formatPrice({ amount, currencyCode });
  const basePrice = hasDiscount
    ? formatPrice({ amount: baseAmount, currencyCode })
    : null;

  return { price, basePrice, discount };
}

export default function usePrice(
  data?: {
    amount: number;
    baseAmount?: number;
    currencyCode: string;
  } | null
) {
  const { amount, baseAmount, currencyCode } = data ?? {};
  const value = useMemo(() => {
    if (typeof amount !== "number" || !currencyCode) return "";

    return baseAmount
      ? formatVariantPrice({ amount, baseAmount, currencyCode })
      : formatPrice({ amount, currencyCode });
  }, [amount, baseAmount, currencyCode]);

  return typeof value === "string" ? { price: value } : value;
}
