import { columns } from "@/components/columns/case-columns";
import CourtFilter from "@/components/filters/CourtFilter";
import DateFilter from "@/components/filters/DateFilter";
import LawyerFilter from "@/components/filters/LawyerFilter";
import { DataTable } from "@/components/table/data-table";
import { getCases } from "@/lib/actions/case.actions";
import React from "react";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const CasesPage = async ({ searchParams }: SearchParams) => {
  const {
    page,
    pageSize,
    query,
    filter,
    lawyerId,
    courtId,
    status,
    startDate,
    endDate,
  } = await searchParams;

  const { data, error } = await getCases({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
    lawyerId,
    courtId,
    status,
    startDate,
    endDate,
  });

  const { cases = [] } = data || {};

  if (error) return <p>Something went wrong!!!</p>;
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cases</h1>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Add Case
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-6 max-md:flex-col">
        <LawyerFilter />
        <CourtFilter />
        <DateFilter />
      </div>
      <DataTable columns={columns} data={cases} />
    </div>
  );
};

export default CasesPage;
