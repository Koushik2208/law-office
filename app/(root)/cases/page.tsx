import { getCases } from '@/lib/actions/case.actions'
import LawyerFilter from '@/components/filters/LawyerFilter'
import CourtFilter from '@/components/filters/CourtFilter'
import DateFilter from '@/components/filters/DateFilter'
import { DataTable } from '@/components/table/data-table'
import { columns } from '@/components/columns/case-columns'

interface SearchParams {
  searchParams: { [key: string]: string }
}

const CasesPage = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter, sort, courtId, lawyerId, startDate, endDate } = await searchParams

  // Create filter object for date range if dates are provided
  let dateFilter = {}
  if (startDate || endDate) {
    dateFilter = {
      createdAt: {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate && { $lte: new Date(endDate) })
      }
    }
  }

  // Combine date filter with any existing filter
  const combinedFilter = filter 
    ? JSON.stringify({ ...JSON.parse(filter), ...dateFilter })
    : Object.keys(dateFilter).length > 0 
      ? JSON.stringify(dateFilter)
      : undefined

  const { data: cases } = await getCases({
    page: page ? parseInt(page) : 1,
    pageSize: pageSize ? parseInt(pageSize) : 10,
    query,
    filter: combinedFilter,
    sort,
    courtId,
    lawyerId
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cases</h1>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Add Case
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        <LawyerFilter />
        <CourtFilter />
        <DateFilter />
      </div>
      <DataTable columns={columns} data={cases} />
    </div>
  )
}

export default CasesPage;