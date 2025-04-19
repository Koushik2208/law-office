'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url"
import { useEffect, useState } from "react"

export default function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize dates from URL params
  useEffect(() => {
    if (mounted) {
      const start = searchParams.get("startDate")
      const end = searchParams.get("endDate")
      setStartDate(start || "")
      setEndDate(end || "")
    }
  }, [searchParams, mounted])

  const handleDateChange = (type: 'start' | 'end', date: string) => {
    const paramName = type === 'start' ? 'startDate' : 'endDate'
    
    // Update local state
    if (type === 'start') {
      setStartDate(date)
    } else {
      setEndDate(date)
    }

    // Update URL
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

  // Don't render the inputs until the component is mounted
  if (!mounted) {
    return (
      <div className="flex gap-4 max-md:flex-col">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Start Date
          </label>
          <div className="w-[240px] max-md:w-full h-9 px-3 py-2 rounded-md border border-input bg-background text-sm animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            End Date
          </label>
          <div className="w-[240px] max-md:w-full h-9 px-3 py-2 rounded-md border border-input bg-background text-sm animate-pulse" />
        </div>
      </div>
    )
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
          value={startDate}
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
          value={endDate}
          onChange={(e) => handleDateChange('end', e.target.value)}
        />
      </div>
    </div>
  )
}
