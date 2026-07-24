function buildBadCharTable(pattern: string): Map<string, number> {
  const table = new Map<string, number>()
  for (let i = 0; i < pattern.length - 1; i++) {
    table.set(pattern[i], pattern.length - 1 - i)
  }
  return table
}

function buildGoodSuffixTable(pattern: string): number[] {
  const m = pattern.length
  const table = new Array(m).fill(m)
  let last = m

  for (let i = m - 1; i >= 0; i--) {
    if (pattern.slice(i + 1) === pattern.slice(0, m - i - 1)) {
      last = i + 1
    }
    table[i] = last - i - 1 + m
  }

  for (let i = 0; i < m - 1; i++) {
    const len = m - (i + 1)
    if (pattern[i + 1] === pattern[len]) {
      table[len - 1] = m - 1 - i
    }
  }

  return table
}

export function boyerMooreSearch(text: string, pattern: string): boolean {
  if (!pattern) return true
  if (pattern.length > text.length) return false

  const lowerText = text.toLowerCase()
  const lowerPattern = pattern.toLowerCase()
  const m = lowerPattern.length
  const badChar = buildBadCharTable(lowerPattern)
  const goodSuffix = buildGoodSuffixTable(lowerPattern)

  let shift = 0
  while (shift <= lowerText.length - m) {
    let j = m - 1
    while (j >= 0 && lowerPattern[j] === lowerText[shift + j]) {
      j--
    }
    if (j < 0) {
      return true
    }
    const bcShift = badChar.get(lowerText[shift + j]) ?? m
    const gsShift = goodSuffix[j]
    shift += Math.max(bcShift, gsShift)
  }
  return false
}
