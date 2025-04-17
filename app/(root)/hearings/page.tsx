import { getHearings } from '@/lib/actions/hearing.actions'
import DateFilter from '@/components/filters/DateFilter'
import { DataTable } from '@/components/table/data-table'
import { columns } from '@/components/columns/hearing-columns'

interface SearchParams {
  searchParams: { [key: string]: string }
}

const HearingsPage = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter, sort, caseId, startDate, endDate } = await searchParams

  // Create filter object for date range if dates are provided
  let dateFilter = {}
  if (startDate || endDate) {
    dateFilter = {
      date: {
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

  const { data: hearings } = await getHearings({
    page: page ? parseInt(page) : 1,
    pageSize: pageSize ? parseInt(pageSize) : 10,
    query,
    filter: combinedFilter,
    sort,
    caseId
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hearings</h1>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Add Hearing
        </button>
      </div>
      <div className="mb-6">
        <DateFilter />
      </div>
      <DataTable columns={columns} data={hearings} />
    </div>
  )
}

export default HearingsPage;
