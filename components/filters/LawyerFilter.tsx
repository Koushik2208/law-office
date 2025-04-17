'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { getLawyers } from '@/lib/actions/lawyer.actions'

interface Lawyer {
  _id: string
  name: string
  specialization: string
}

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

  const handleLawyerChange = (value: string) => {
    router.push(`?${createQueryString('lawyerId', value)}`)
  }

  if (isLoading) {
    return <div className="animate-pulse h-10 bg-gray-200 rounded-md w-48"></div>
  }

  return (
    <div>
      <label htmlFor="lawyer" className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Lawyer
      </label>
      <select
        id="lawyer"
        className="border rounded-md px-3 py-2 w-48"
        value={searchParams.get('lawyerId') || ''}
        onChange={(e) => handleLawyerChange(e.target.value)}
      >
        <option value="">All Lawyers</option>
        {lawyers.map((lawyer) => (
          <option key={lawyer._id} value={lawyer._id}>
            {lawyer.name} ({lawyer.specialization})
          </option>
        ))}
      </select>
    </div>
  )
} 