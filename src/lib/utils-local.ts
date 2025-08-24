export function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return ""
  }
}

export function formatCount(n: number) {
  return new Intl.NumberFormat().format(n)
}

export function formatCurrency(value: number, currency?: string) {
  const cur = currency || "KRW"
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur,
      maximumFractionDigits: cur === "KRW" ? 0 : 0,
    }).format(value)
  } catch {
    return `${value.toLocaleString()} ${cur}`
  }
}
