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

export const columns: ColumnDef<Case>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case Title" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "caseNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case Number" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("caseNumber")}</div>
    ),
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("clientName")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="capitalize font-medium">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "lawyerId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lawyer" />
    ),
    cell: ({ row }) => {
      const lawyer = row.getValue("lawyerId") as
        | { name: string; specialization: string }
        | undefined;
      return lawyer ? (
        <div className="text-sm">
          {lawyer.name} ({lawyer.specialization})
        </div>
      ) : null;
    },
  },
  {
    accessorKey: "courtId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Court" />
    ),
    cell: ({ row }) => {
      const court = row.getValue("courtId") as
        | { name: string; location: string }
        | undefined;
      return court ? (
        <div className="text-sm">
          {court.name} ({court.location})
        </div>
      ) : null;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const case_ = row.original;

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
              onClick={() => navigator.clipboard.writeText(case_._id)}
            >
              Copy Case ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Case</DropdownMenuItem>
            <DropdownMenuItem>View Hearings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
