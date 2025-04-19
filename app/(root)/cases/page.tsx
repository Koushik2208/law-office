"use client";

import { columns } from "@/components/columns/case-columns";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import CourtFilter from "@/components/filters/CourtFilter";
import DateFilter from "@/components/filters/DateFilter";
import LawyerFilter from "@/components/filters/LawyerFilter";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { deleteCase, getCases } from "@/lib/actions/case.actions";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CasesPage = () => {
  const searchParams = useSearchParams();

  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const fetchCases = async () => {
    setIsLoading(true);
    try {
      const page = searchParams.get("page")
        ? Number(searchParams.get("page"))
        : 1;
      const pageSize = searchParams.get("pageSize")
        ? Number(searchParams.get("pageSize"))
        : 10;
      const query = searchParams.get("query") || undefined;
      const filter = searchParams.get("filter") || undefined;
      const lawyerId = searchParams.get("lawyerId") || undefined;
      const courtId = searchParams.get("courtId") || undefined;
      const status = searchParams.get("status") || undefined;
      const startDate = searchParams.get("startDate") || undefined;
      const endDate = searchParams.get("endDate") || undefined;

      const result = await getCases({
        page,
        pageSize,
        query,
        filter,
        lawyerId,
        courtId,
        status,
        startDate,
        endDate,
      });

      if (result.success) {
        setCases(result.data?.cases || []);
      } else {
        toast.error(result.error?.message || "Failed to fetch cases.");
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
      toast.error("An unexpected error occurred while fetching cases.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Re-fetch cases when URL parameters change

  const handleDeleteClick = (id: string) => {
    setSelectedCaseId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedCaseId) {
      const result = await deleteCase({ id: selectedCaseId });
      if (result.success) {
        toast.success("Case deleted successfully");
        fetchCases(); // Re-fetch cases to update the table
        setDeleteDialogOpen(false);
        setSelectedCaseId(null);
        return result;
      } else {
        toast.error(result.error?.message || "Failed to delete case.");
      }
    } else {
      toast.error("No case selected for deletion.");
    }
    return { success: false, message: "No case selected" };
  };

  if (isLoading) {
    return <TableSkeleton columns={cases?.length || 5} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cases</h1>
          <p className="text-muted-foreground">
            Manage legal cases and add new entries.
          </p>
        </div>
        <Button asChild>
          <Link href="/cases/new" className="flex items-center gap-2">
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Case</span>
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 max-md:flex-col">
        <LawyerFilter />
        <CourtFilter />
        <DateFilter />
      </div>

      <DataTable
        columns={columns({ onDeleteClick: handleDeleteClick })}
        data={cases}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        id={selectedCaseId || ""}
        title="Delete Case"
        description="Are you sure you want to delete this case? This action cannot be undone."
        onDelete={handleDelete}
        navigateUrl="/cases"
      />
    </div>
  );
};

export default CasesPage;
