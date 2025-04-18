'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url"
import { formatDate } from "@/lib/utils"

export default function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  const handleDateChange = (type: 'start' | 'end', date: string) => {
    const paramName = type === 'start' ? 'startDate' : 'endDate'
    
    if (date) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: paramName,
        value: date
      })
      router.push(newUrl)
    } else {
      const newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: [paramName]
      })
      router.push(newUrl)
    }
  }

  return (
    <div className="flex gap-4 max-md:flex-col">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Start Date
        </label>
        <input
          type="date"
          className="w-[240px] max-md:w-full h-9 px-3 py-2 rounded-md border border-input bg-background text-sm"
          value={startDate || ''}
          onChange={(e) => handleDateChange('start', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          End Date
        </label>
        <input
          type="date"
          className="w-[240px] max-md:w-full h-9 px-3 py-2 rounded-md border border-input bg-background text-sm"
          value={endDate || ''}
          onChange={(e) => handleDateChange('end', e.target.value)}
        />
      </div>
    </div>
  )
}
