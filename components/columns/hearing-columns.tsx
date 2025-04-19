"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../table/DataTableColumnHeader";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { formatDateLong } from "@/lib/utils";

interface HearingColumnsProps {
  onDeleteClick: (id: string) => void;
}

export const columns = ({
  onDeleteClick,
}: HearingColumnsProps): ColumnDef<Hearing>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "caseId.title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case Title" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.caseId.title}</div>
    ),
  },
  {
    accessorKey: "caseId.caseNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case Number" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.caseId.caseNumber}</div>
    ),
  },
  {
    accessorKey: "caseId.clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.caseId.clientName}</div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div className="text-sm">{formatDateLong(date)}</div>;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("description")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const hearing = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(hearing._id)}
            >
              Copy Hearing ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/hearings/${hearing._id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteClick(hearing._id)}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/cases?hearingId=${hearing._id}`}>View Case</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
