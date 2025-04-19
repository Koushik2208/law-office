"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteDialogProps {
  id: string;
  title: string;
  description: string;
  onDelete: (id: string) => Promise<{ success: boolean; message?: string }>;
  navigateUrl?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function DeleteDialog({
  id,
  title,
  description,
  onDelete,
  navigateUrl,
  open,
  onOpenChange,
  trigger,
}: DeleteDialogProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const result = await onDelete(id);
      if (result.success) {
        toast.success(result.message || "Item deleted successfully");
        if (navigateUrl) {
          router.push(navigateUrl);
        }
      } else {
        toast.error(result.message || "Failed to delete item");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the item");
      console.error("Delete error:", error);
    } finally {
      onOpenChange?.(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-black font-normal">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
