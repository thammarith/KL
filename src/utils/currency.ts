// Currency utility for local currency formatting

// Get user's locale and currency
export const getUserLocale = (): string => {
  return navigator.language || 'en-US'
}

export const getUserCurrency = (): string => {
  const locale = getUserLocale()

  // Map common locales to currencies
  const localeToCurrency: Record<string, string> = {
    'en-US': 'USD',
    'en-CA': 'CAD',
    'en-GB': 'GBP',
    'en-AU': 'AUD',
    'en-NZ': 'NZD',
    'en-IN': 'INR',
    'fr-FR': 'EUR',
    'de-DE': 'EUR',
    'es-ES': 'EUR',
    'it-IT': 'EUR',
    'nl-NL': 'EUR',
    'pt-PT': 'EUR',
    'ja-JP': 'JPY',
    'ko-KR': 'KRW',
    'zh-CN': 'CNY',
    'zh-TW': 'TWD',
    'zh-HK': 'HKD',
    'ru-RU': 'RUB',
    'pl-PL': 'PLN',
    'tr-TR': 'TRY',
    'ar-SA': 'SAR',
    'he-IL': 'ILS',
    'th-TH': 'THB',
    'vi-VN': 'VND',
    'id-ID': 'IDR',
    'ms-MY': 'MYR',
    'ph-PH': 'PHP',
    'sv-SE': 'SEK',
    'no-NO': 'NOK',
    'da-DK': 'DKK',
    'fi-FI': 'EUR',
    'is-IS': 'ISK',
    'cs-CZ': 'CZK',
    'hu-HU': 'HUF',
    'ro-RO': 'RON',
    'bg-BG': 'BGN',
    'hr-HR': 'HRK',
    'sk-SK': 'EUR',
    'si-SI': 'EUR',
    'et-EE': 'EUR',
    'lv-LV': 'EUR',
    'lt-LT': 'EUR',
    'mt-MT': 'EUR',
    'cy-CY': 'EUR'
  }

  // Try exact match first
  if (localeToCurrency[locale]) {
    return localeToCurrency[locale]
  }

  // Try language match (e.g., 'en' from 'en-ZA')
  const language = locale.split('-')[0]
  const languageMatch = Object.keys(localeToCurrency).find(key =>
    key.startsWith(language + '-')
  )

  if (languageMatch) {
    return localeToCurrency[languageMatch]
  }

  // Default to USD
  return 'USD'
}

// Format currency based on user's locale with thousand separators
export const formatCurrency = (amount: number, currency?: string): string => {
  const userLocale = getUserLocale()
  const userCurrency = currency || getUserCurrency()

  try {
    return new Intl.NumberFormat(userLocale, {
      style: 'currency',
      currency: userCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true // Explicitly enable thousand separators
    }).format(amount)
  } catch (error) {
    // Fallback to USD if currency is not supported
    try {
      return new Intl.NumberFormat(userLocale, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
      }).format(amount)
    } catch (fallbackError) {
      // Ultimate fallback with manual thousand separators
      return formatCurrencyFallback(amount, currency)
    }
  }
}

// Fallback currency formatting with manual thousand separators
const formatCurrencyFallback = (amount: number, currency?: string): string => {
  const userCurrency = currency || getUserCurrency()
  const symbol = getCurrencySymbolFallback(userCurrency)

  // Add thousand separators manually
  const parts = amount.toFixed(2).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return `${symbol}${parts.join('.')}`
}

// Format number with thousand separators (no currency)
export const formatNumber = (amount: number): string => {
  const userLocale = getUserLocale()

  try {
    return new Intl.NumberFormat(userLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    }).format(amount)
  } catch (error) {
    // Fallback with manual formatting
    const parts = amount.toFixed(2).split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }
}

// Get currency symbol
export const getCurrencySymbol = (currency?: string): string => {
  const userCurrency = currency || getUserCurrency()
  const userLocale = getUserLocale()

  try {
    const formatted = new Intl.NumberFormat(userLocale, {
      style: 'currency',
      currency: userCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(0)

    // Extract symbol by removing digits and spaces
    return formatted.replace(/[\d\s,]/g, '')
  } catch (error) {
    return getCurrencySymbolFallback(userCurrency)
  }
}

// Fallback currency symbols
const getCurrencySymbolFallback = (currency: string): string => {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CNY': '¥',
    'INR': '₹',
    'KRW': '₩',
    'RUB': '₽',
    'CAD': 'C$',
    'AUD': 'A$',
    'CHF': 'Fr',
    'SEK': 'kr',
    'NOK': 'kr',
    'DKK': 'kr',
    'PLN': 'zł',
    'TRY': '₺',
    'SAR': '﷼',
    'ILS': '₪',
    'THB': '฿',
    'VND': '₫',
    'IDR': 'Rp',
    'MYR': 'RM',
    'PHP': '₱',
    'ISK': 'kr',
    'CZK': 'Kč',
    'HUF': 'Ft',
    'RON': 'lei',
    'BGN': 'лв',
    'HRK': 'kn'
  }

  return symbols[currency] || '$'
}

// Parse currency input (remove symbols and convert to number)
export const parseCurrencyInput = (input: string): number => {
  // Remove currency symbols, spaces, and non-numeric characters except decimal points
  const cleanInput = input.replace(/[^\d.-]/g, '')
  const parsed = parseFloat(cleanInput)
  return isNaN(parsed) ? 0 : parsed
}

// Validate currency amount
export const isValidCurrencyAmount = (amount: number): boolean => {
  return !isNaN(amount) && isFinite(amount) && amount >= 0
}

// Format currency for display in different contexts
export const formatCurrencyCompact = (amount: number, currency?: string): string => {
  const userLocale = getUserLocale()
  const userCurrency = currency || getUserCurrency()

  // For very large numbers, use compact notation
  if (Math.abs(amount) >= 1000000) {
    try {
      return new Intl.NumberFormat(userLocale, {
        style: 'currency',
        currency: userCurrency,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(amount)
    } catch (error) {
      // Fallback to regular formatting
      return formatCurrency(amount, currency)
    }
  }

  return formatCurrency(amount, currency)
}
