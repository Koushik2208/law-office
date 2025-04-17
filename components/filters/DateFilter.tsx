'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const paramName = type === 'start' ? 'startDate' : 'endDate'
    router.push(`?${createQueryString(paramName, value)}`)
  }

  return (
    <div className="flex gap-4 mb-4">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          className="border rounded-md px-3 py-2"
          value={searchParams.get('startDate') || ''}
          onChange={(e) => handleDateChange('start', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          className="border rounded-md px-3 py-2"
          value={searchParams.get('endDate') || ''}
          onChange={(e) => handleDateChange('end', e.target.value)}
        />
      </div>
    </div>
  )
} 