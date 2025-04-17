import { getLawyers } from '@/lib/actions/lawyer.actions'
import { DataTable } from '@/components/table/data-table'
import { columns } from '@/components/columns/lawyer-columns'

const LawyersPage = async () => {
  const { data: lawyers } = await getLawyers()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lawyers</h1>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Add Lawyer
        </button>
      </div>
      <DataTable columns={columns} data={lawyers} />
    </div>
  )
}

export default LawyersPage;
