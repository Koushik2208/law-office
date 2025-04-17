import { getCourts } from '@/lib/actions/court.actions'
import { DataTable } from '@/components/table/data-table'
import { columns } from '@/components/columns/court-columns'

const CourtsPage = async () => {
  const { data: courts } = await getCourts()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courts</h1>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Add Court
        </button>
      </div>
      <DataTable columns={columns} data={courts} />
    </div>
  )
}

export default CourtsPage;
