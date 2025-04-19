import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/columns/lawyer-columns";
import { getLawyers } from "@/lib/actions/lawyer.actions";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const LawyersPage = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter, role } = await searchParams; // Ensure you await the promise

  const { data, error } = await getLawyers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
    role,
  });

  const { lawyers = [] } = data || {};

  if (error) return <p>Something went wrong!!!</p>;

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
  );
};

export default LawyersPage;
