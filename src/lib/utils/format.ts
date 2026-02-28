/**
 * Format price in South African Rand
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format mileage with km suffix
 */
export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat('en-ZA').format(km)} km`
}

/**
 * Format date for SA locale
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Format phone number (SA format)
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  return phone
}

/**
 * Generate SEO-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Vehicle title string
 */
export function vehicleTitle(make: string, model: string, year: number, variant?: string | null): string {
  return [year, make, model, variant].filter(Boolean).join(' ')
}
