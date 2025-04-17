'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { getCourts } from '@/lib/actions/court.actions'

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
        const { data } = await getCourts({ pageSize: 100 })
        setCourts(data)
      } catch (error) {
        console.error('Error fetching courts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourts()
  }, [])

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

  const handleCourtChange = (value: string) => {
    router.push(`?${createQueryString('courtId', value)}`)
  }

  if (isLoading) {
    return <div className="animate-pulse h-10 bg-gray-200 rounded-md w-48"></div>
  }

  return (
    <div>
      <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Court
      </label>
      <select
        id="court"
        className="border rounded-md px-3 py-2 w-48"
        value={searchParams.get('courtId') || ''}
        onChange={(e) => handleCourtChange(e.target.value)}
      >
        <option value="">All Courts</option>
        {courts.map((court) => (
          <option key={court._id} value={court._id}>
            {court.name} ({court.location})
          </option>
        ))}
      </select>
    </div>
  )
} 