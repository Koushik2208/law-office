"use client";

import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/columns/court-columns";
import { getCourts, deleteCourt } from "@/lib/actions/court.actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";

const CourtsPage = () => {
  const searchParams = useSearchParams();

  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);

  const fetchCourts = async () => {
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
      const name = searchParams.get("name") || undefined;
      const location = searchParams.get("location") || undefined;

      const result = await getCourts({
        page,
        pageSize,
        query,
        sort,
        name,
        location,
      });

      if (result.success) {
        setCourts(result.data?.courts || []);
      } else {
        toast.error(result.error?.message || "Failed to fetch courts.");
      }
    } catch (error) {
      console.error("Error fetching courts:", error);
      toast.error("An unexpected error occurred while fetching courts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleDeleteClick = (id: string) => {
    setSelectedCourtId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedCourtId) {
      const result = await deleteCourt({ id: selectedCourtId });
      if (result.success) {
        toast.success("Court deleted successfully");
        fetchCourts(); // Re-fetch courts to update the table
        setDeleteDialogOpen(false);
        setSelectedCourtId(null);
        return result;
      } else {
        toast.error(result.error?.message || "Failed to delete court.");
      }
    } else {
      toast.error("No court selected for deletion.");
    }
    return { success: false, message: "No court selected" };
  };

  if (isLoading) {
    return <TableSkeleton columns={3} />; // Adjust column count based on your columns
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courts</h1>
        <Button asChild>
          <Link href="/courts/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Court
          </Link>
        </Button>
      </div>
      <DataTable
        columns={columns({ onDeleteClick: handleDeleteClick })}
        data={courts}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        id={selectedCourtId || ""}
        title="Delete Court"
        description="Are you sure you want to delete this court? This action cannot be undone."
        onDelete={handleDelete}
        navigateUrl="/courts"
      />
    </div>
  );
};

export default CourtsPage;
