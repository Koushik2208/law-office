'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getLawyers } from '@/lib/actions/lawyer.actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formUrlQuery, removeKeysFromUrlQuery } from '@/lib/url'

export default function LawyerFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [lawyers, setLawyers] = useState<Lawyer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const { data } = await getLawyers({ pageSize: 100 })
        setLawyers(data)
      } catch (error) {
        console.error('Error fetching lawyers:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLawyers()
  }, [])

  const handleLawyerChange = (value: string) => {
    if (value === 'all') {
      const newUrl = removeKeysFromUrlQuery({
        params: searchParams.toString(),
        keysToRemove: ['lawyerId']
      })
      router.push(newUrl)
    } else {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'lawyerId',
        value
      })
      router.push(newUrl)
    }
  }

  if (isLoading) {
    return <div className="animate-pulse h-10 bg-gray-200 rounded-md w-full max-w-[240px] max-md:max-w-full"></div>
  }

  return (
    <div className="w-full max-w-[240px] max-md:max-w-full">
      <Select
        value={searchParams.get('lawyerId') || 'all'}
        onValueChange={handleLawyerChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select lawyer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Lawyers</SelectItem>
          {lawyers.map((lawyer) => (
            <SelectItem key={lawyer._id} value={lawyer._id}>
              {lawyer.name} ({lawyer.specialization})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 