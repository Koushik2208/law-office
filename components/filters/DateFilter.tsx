'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url"
import { formatDate, formatDateLong } from "@/lib/utils"

export default function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  const handleDateChange = (type: 'start' | 'end', date: Date | undefined) => {
    const paramName = type === 'start' ? 'startDate' : 'endDate'
    
    if (date) {
      const formattedDate = formatDate(date)
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: paramName,
        value: formattedDate
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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-[240px] max-md:w-full justify-start text-left font-normal ${
                !startDate && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? formatDateLong(new Date(startDate)) : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate ? new Date(startDate) : undefined}
              onSelect={(date) => handleDateChange('start', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          End Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-[240px] max-md:w-full justify-start text-left font-normal ${
                !endDate && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? formatDateLong(new Date(endDate)) : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate ? new Date(endDate) : undefined}
              onSelect={(date) => handleDateChange('end', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
