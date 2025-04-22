"use client";

import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/columns/lawyer-columns";
import { getLawyers, deleteLawyer } from "@/lib/actions/lawyer.actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";

const LawyersPage = () => {
  const searchParams = useSearchParams();

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);

  const fetchLawyers = async () => {
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
      const role = searchParams.get("role") || undefined;

      const result = await getLawyers({
        page,
        pageSize,
        query,
        sort,
        role,
      });

      if (result.success) {
        setLawyers(result.data?.lawyers || []);
      } else {
        toast.error(result.error?.message || "Failed to fetch lawyers.");
      }
    } catch (error) {
      console.error("Error fetching lawyers:", error);
      toast.error("An unexpected error occurred while fetching lawyers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleDeleteClick = (id: string) => {
    setSelectedLawyerId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedLawyerId) {
      const result = await deleteLawyer({ id: selectedLawyerId });
      if (result.success) {
        toast.success("Lawyer deleted successfully");
        fetchLawyers(); // Re-fetch lawyers to update the table
        setDeleteDialogOpen(false);
        setSelectedLawyerId(null);
        return result;
      } else {
        toast.error(result.error?.message || "Failed to delete lawyer.");
      }
    } else {
      toast.error("No lawyer selected for deletion.");
    }
    return { success: false, message: "No lawyer selected" };
  };

  if (isLoading) {
    return <TableSkeleton columns={6} />; // Adjust column count based on your columns
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lawyers</h1>
        <Button asChild>
          <Link href="/lawyers/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Lawyer
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns({ onDeleteClick: handleDeleteClick })}
        data={lawyers}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        id={selectedLawyerId || ""}
        title="Delete Lawyer"
        description="Are you sure you want to delete this lawyer? This action cannot be undone."
        onDelete={handleDelete}
        navigateUrl="/lawyers"
      />
    </div>
  );
};

export default LawyersPage;
