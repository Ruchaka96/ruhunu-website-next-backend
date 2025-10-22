"use client"

import { CircleCorrect, CircleX } from "@/components/icons"
import { Checkbox } from "@/components/ui/checkbox"
import { Career } from "@/types/career"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import CareerRecordActions from "./record-actions"

// DEFINE THE COLUMNS OF THE CAREER TABLE
export const careerColumns: ColumnDef<Career>[] = [
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
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const id = row.original.id
            const name = row.getValue("name") as string
        
            return (
                <Link
                    href={`/careers/${id}`}
                    className="text-blue-600 hover:underline"
                >
                    {name}
                </Link>
            )
        },
    },
    {
        accessorKey: "short_desc",
        header: "Description",
    },
    {
        accessorKey: "no_of_vacancies",
        header: "Vacancies",
    },
    {
        accessorKey: "order",
        header: "Order",
    },
    {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => {
            const show = row.getValue('visibility')
            return show === true ? (
                <CircleCorrect className="text-green-500 w-7 h-7" />
            ) : (
                <CircleX className="text-red-500 w-7 h-7" />
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <CareerRecordActions row={row} />,
    },
]