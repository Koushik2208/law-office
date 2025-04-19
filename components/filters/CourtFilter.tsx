'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getCourts } from '@/lib/actions/court.actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url"
import { FilterSkeleton } from "../skeletons/FilterSkeleton"

interface Court {
  _id: string
  name: string
  location: string
}

export default function CourtFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [courts, setCourts] = useState<Court[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const result = await getCourts({ pageSize: 100 })
        if (result.success && result.data?.courts) {
          setCourts(result.data.courts)
        }
      } catch (error) {
        console.error('Error fetching courts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourts()
  }, [])

  const handleCourtChange = (value: string) => {
    if (value === 'all') {
      const newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ['courtId']
      })
      router.push(newUrl)
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'courtId',
        value
      })
      router.push(newUrl)
    }
  }

  if (isLoading) {
    return <FilterSkeleton />
  }

  return (
    <div className="w-full max-w-[240px] max-md:max-w-full">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Court
        </label>
        <Select
          value={searchParams.get('courtId') || 'all'}
          onValueChange={handleCourtChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select court" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courts</SelectItem>
            {courts.map((court) => (
              <SelectItem key={court._id} value={court._id}>
                {court.name} ({court.location})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 