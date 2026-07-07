import { formatCurrency } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
}

export function CurrencyDisplay({ amount, currency }: CurrencyDisplayProps) {
  if (!currency) {
    return <>{amount.toFixed(2)}</>;
  }
  return <>{formatCurrency(amount, currency)}</>;
}
