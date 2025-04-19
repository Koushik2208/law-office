"use client";

import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/columns/hearing-columns";
import { getHearings, deleteHearing } from "@/lib/actions/hearing.actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import DateFilter from "@/components/filters/DateFilter";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";

const HearingsPage = () => {
  const searchParams = useSearchParams();

  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHearingId, setSelectedHearingId] = useState<string | null>(
    null
  );

  const fetchHearings = async () => {
    setIsLoading(true);
    try {
      const page = searchParams.get("page")
        ? Number(searchParams.get("page"))
        : 1;
      const pageSize = searchParams.get("pageSize")
        ? Number(searchParams.get("pageSize"))
        : 10;
      const query = searchParams.get("query") || undefined;
      const sort = searchParams.get("sort") || undefined;
      const caseId = searchParams.get("caseId") || undefined;
      const startDate = searchParams.get("startDate") || undefined;
      const endDate = searchParams.get("endDate") || undefined;

      const result = await getHearings({
        page,
        pageSize,
        query,
        sort,
        caseId,
        startDate,
        endDate,
      });

      if (result.success) {
        setHearings(result.data?.hearings || []);
      } else {
        toast.error(result.error?.message || "Failed to fetch hearings.");
      }
    } catch (error) {
      console.error("Error fetching hearings:", error);
      toast.error("An unexpected error occurred while fetching hearings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHearings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleDeleteClick = (id: string) => {
    setSelectedHearingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedHearingId) {
      const result = await deleteHearing({ id: selectedHearingId });
      if (result.success) {
        toast.success("Hearing deleted successfully");
        fetchHearings(); // Re-fetch hearings to update the table
        setDeleteDialogOpen(false);
        setSelectedHearingId(null);
        return result;
      } else {
        toast.error(result.error?.message || "Failed to delete hearing.");
      }
    } else {
      toast.error("No hearing selected for deletion.");
    }
    return { success: false, message: "No hearing selected" };
  };

  if (isLoading) {
    return <TableSkeleton columns={6} />; // Adjust column count based on your columns
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hearings</h1>
        <Button asChild>
          <Link href="/hearings/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Hearing
          </Link>
        </Button>
      </div>
      <div className="mb-6">
        <DateFilter />
      </div>
      <DataTable
        columns={columns({ onDeleteClick: handleDeleteClick })}
        data={hearings}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        id={selectedHearingId || ""}
        title="Delete Hearing"
        description="Are you sure you want to delete this hearing? This action cannot be undone."
        onDelete={handleDelete}
        navigateUrl="/hearings"
      />
    </div>
  );
};

export default HearingsPage;
