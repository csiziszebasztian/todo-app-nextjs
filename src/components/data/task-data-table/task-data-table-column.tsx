"use client"

import {Task} from "@/schemas"
import {Category} from "@/schemas";
import {ColumnDef} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox"
import {priorities, statuses} from "@/components/data/task-data-table/task-data"
import {DataTableColumnHeader} from "@/components/data/data-table-column-header"
import {TaskDataTableRowActions} from "@/components/data/task-data-table/task-data-table-row-actions"
import {format} from "date-fns";
import {Option} from "@/components/ui/multi-selector";
import {Badge} from "@/components/ui/badge";


export const taskColumns: ColumnDef<Task>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="flex items-center justify-center text-current"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="flex items-center justify-center text-current"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Title"/>
        ),
        cell: ({row}) => {

            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
                </div>
            )
        },
    },
    {
        accessorKey: "description",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Description"/>
        ),
        cell: ({row}) => <div className="max-w-[500px] truncate font-medium">{row.getValue("description")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Status"/>
        ),
        cell: ({row}) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("status")
            )

            if (!status) {
                return null
            }

            return (
                <div className="flex w-[100px] items-center">
                    {status.icon && (
                        <status.icon className="mr-2 h-4 w-4 text-muted-foreground"/>
                    )}
                    <span>{status.label}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "priority",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Priority"/>
        ),
        cell: ({row}) => {
            const priority = priorities.find(
                (priority) => priority.value === row.getValue("priority")
            )

            if (!priority) {
                return null
            }

            return (
                <div className="flex items-center">
                    {priority.icon && (
                        <priority.icon className="mr-2 h-4 w-4 text-muted-foreground"/>
                    )}
                    <span>{priority.label}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "categories",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Categories"/>
        ),
        cell: ({row}) => {
            const categories: Option[] = row.getValue("categories");

            return (
                <div className="flex items-center gap-2">
                    {categories?.map(category => (
                        <Badge key={category.value}>{category.label}</Badge>
                    ))}
                </div>
            )
        },
        enableSorting: false,
        filterFn: (row, id, value: string[]) => {
            const values: {label: string, value: string}[] = row.getValue(id);
            return value.some(val => values.some(obj => obj.value === val));
        },
    },
    {
        accessorKey: "startedAt",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Started At"/>
        ),
        cell: ({row}) => {

            if (!row.getValue("startedAt")) {
                return null
            }

            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {format(row.getValue("startedAt"), "yyyy.MM.dd HH:mm")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "finishedAt",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="End date"/>
        ),
        cell: ({row}) => {

            if (!row.getValue("finishedAt")) {
                return null
            }

            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {format(row.getValue("finishedAt"), "yyyy.MM.dd HH:mm")}
                    </span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({row, table }) => <TaskDataTableRowActions row={row} categories={(table.options.meta as Category)}/>,
    },
]