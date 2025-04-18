import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date Utilities
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateLong(date: Date | string): string {
  const d = new Date(date)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const month = months[d.getMonth()]
  const day = d.getDate()
  const year = d.getFullYear()
  return `${month} ${day}, ${year}`
}

export function isToday(date: Date | string): boolean {
  const today = new Date()
  const d = new Date(date)
  return d.toDateString() === today.toDateString()
}

export function isYesterday(date: Date | string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const d = new Date(date)
  return d.toDateString() === yesterday.toDateString()
}

export function getStartOfWeek(date: Date | string): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

export function getEndOfWeek(date: Date | string): Date {
  const start = getStartOfWeek(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return end
}

export function isThisWeek(date: Date | string): boolean {
  const d = new Date(date)
  const start = getStartOfWeek(new Date())
  const end = getEndOfWeek(new Date())
  return d >= start && d <= end
}

export function isLastWeek(date: Date | string): boolean {
  const d = new Date(date)
  const lastWeekStart = new Date(getStartOfWeek(new Date()))
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  const lastWeekEnd = new Date(lastWeekStart)
  lastWeekEnd.setDate(lastWeekEnd.getDate() + 6)
  return d >= lastWeekStart && d <= lastWeekEnd
}

export function getStartOfMonth(date: Date | string): Date {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function getEndOfMonth(date: Date | string): Date {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

export function isThisMonth(date: Date | string): boolean {
  const d = new Date(date)
  const start = getStartOfMonth(new Date())
  const end = getEndOfMonth(new Date())
  return d >= start && d <= end
}

export function isLastMonth(date: Date | string): boolean {
  const d = new Date(date)
  const lastMonthStart = new Date(getStartOfMonth(new Date()))
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
  const lastMonthEnd = new Date(lastMonthStart)
  lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1)
  lastMonthEnd.setDate(0)
  return d >= lastMonthStart && d <= lastMonthEnd
}

export function getStartOfYear(date: Date | string): Date {
  const d = new Date(date)
  return new Date(d.getFullYear(), 0, 1)
}

export function getEndOfYear(date: Date | string): Date {
  const d = new Date(date)
  return new Date(d.getFullYear(), 11, 31)
}

export function isThisYear(date: Date | string): boolean {
  const d = new Date(date)
  const start = getStartOfYear(new Date())
  const end = getEndOfYear(new Date())
  return d >= start && d <= end
}

export function isLastYear(date: Date | string): boolean {
  const d = new Date(date)
  const lastYearStart = new Date(getStartOfYear(new Date()))
  lastYearStart.setFullYear(lastYearStart.getFullYear() - 1)
  const lastYearEnd = new Date(lastYearStart)
  lastYearEnd.setFullYear(lastYearEnd.getFullYear() + 1)
  lastYearEnd.setDate(0)
  return d >= lastYearStart && d <= lastYearEnd
}

export function getDateRange(type: string): { start: Date; end: Date } {
  const today = new Date()
  
  switch (type) {
    case 'today':
      return { start: today, end: today }
    case 'yesterday':
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return { start: yesterday, end: yesterday }
    case 'thisWeek':
      return { start: getStartOfWeek(today), end: getEndOfWeek(today) }
    case 'lastWeek':
      const lastWeekStart = new Date(getStartOfWeek(today))
      lastWeekStart.setDate(lastWeekStart.getDate() - 7)
      const lastWeekEnd = new Date(lastWeekStart)
      lastWeekEnd.setDate(lastWeekEnd.getDate() + 6)
      return { start: lastWeekStart, end: lastWeekEnd }
    case 'thisMonth':
      return { start: getStartOfMonth(today), end: getEndOfMonth(today) }
    case 'lastMonth':
      const lastMonthStart = new Date(getStartOfMonth(today))
      lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
      const lastMonthEnd = new Date(lastMonthStart)
      lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1)
      lastMonthEnd.setDate(0)
      return { start: lastMonthStart, end: lastMonthEnd }
    case 'thisYear':
      return { start: getStartOfYear(today), end: getEndOfYear(today) }
    case 'lastYear':
      const lastYearStart = new Date(getStartOfYear(today))
      lastYearStart.setFullYear(lastYearStart.getFullYear() - 1)
      const lastYearEnd = new Date(lastYearStart)
      lastYearEnd.setFullYear(lastYearEnd.getFullYear() + 1)
      lastYearEnd.setDate(0)
      return { start: lastYearStart, end: lastYearEnd }
    default:
      return { start: today, end: today }
  }
}
