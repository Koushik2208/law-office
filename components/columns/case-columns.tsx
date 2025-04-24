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

interface CaseColumnsProps {
  onDeleteClick: (id: string) => void;
}

export const columns = ({
  onDeleteClick,
}: CaseColumnsProps): ColumnDef<Case>[] => [
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
          className="text-primary bg-white"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="mr-3">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="text-primary bg-white"
        />
      </div>
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
      const caseId = case_._id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-primary bg-white"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(caseId)}
            >
              Copy Case ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/cases/${caseId}`}>Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteClick(caseId)}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/hearings?caseId=${caseId}`}>View Hearings</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
