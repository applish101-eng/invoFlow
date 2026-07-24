import { levenshteinDistance } from "./levenshtein"

export type InvoicePattern = {
  description: string
  rate: number
  quantity: number
  currency: string
  frequency: number
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

type Entry = {
  description: string
  rate: number
  quantity: number
  currency: string
}

export function findFrequentPatterns(
  invoices: {
    invoiceItemDescription: string
    invoiceItemRate: number
    invoiceItemQuantity: number
    currency: string
  }[]
): InvoicePattern[] {
  const groups: { norm: string; entries: Entry[] }[] = []

  for (const inv of invoices) {
    const norm = normalize(inv.invoiceItemDescription)
    const entry: Entry = {
      description: inv.invoiceItemDescription,
      rate: inv.invoiceItemRate,
      quantity: inv.invoiceItemQuantity,
      currency: inv.currency,
    }

    let matched = false
    for (const group of groups) {
      const dist = levenshteinDistance(norm, group.norm)
      const maxLen = Math.max(norm.length, group.norm.length)
      if (dist <= 3 || (maxLen > 0 && dist / maxLen <= 0.25)) {
        group.norm = norm
        group.entries.push(entry)
        matched = true
        break
      }
    }

    if (!matched) {
      groups.push({ norm, entries: [entry] })
    }
  }

  const result: InvoicePattern[] = []

  for (const group of groups) {
    if (group.entries.length >= 3) {
      const first = group.entries[0]
      result.push({
        description: first.description,
        rate: Math.round(
          group.entries.reduce((s, e) => s + e.rate, 0) / group.entries.length,
        ),
        quantity: Math.round(
          group.entries.reduce((s, e) => s + e.quantity, 0) /
            group.entries.length,
        ),
        currency: first.currency,
        frequency: group.entries.length,
      })
    }
  }

  result.sort((a, b) => b.frequency - a.frequency)
  return result
}
