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

interface LawyerColumnsProps {
  onDeleteClick: (id: string) => void;
}

export const columns = ({
  onDeleteClick,
}: LawyerColumnsProps): ColumnDef<Lawyer>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="mr-3">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="mr-3">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lawyer Name" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "specialization",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Specialization" />
    ),
    cell: ({ row }) => (
      <div className="capitalize font-medium">
        {row.getValue("specialization")}
      </div>
    ),
  },
  {
    accessorKey: "barNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bar Number" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("barNumber")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "caseCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case Count" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("caseCount")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lawyer = row.original;

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
              onClick={() => navigator.clipboard.writeText(lawyer._id)}
            >
              Copy Lawyer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/lawyers/${lawyer._id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteClick(lawyer._id)}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/cases?lawyerId=${lawyer._id}`}>View Cases</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
