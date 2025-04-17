'use client'

import DateFilter from './DateFilter'
import LawyerFilter from './LawyerFilter'
import CourtFilter from './CourtFilter'

export default function FilterBar() {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <DateFilter />
      <LawyerFilter />
      <CourtFilter />
    </div>
  )
} 