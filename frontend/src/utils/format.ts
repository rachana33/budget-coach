export const formatCurrency = (
  value: number,
  currency = 'USD',
  options: Intl.NumberFormatOptions = {},
) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value)
}

export const formatNumber = (value: number, fractionDigits = 0) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: fractionDigits,
  }).format(value)
}
