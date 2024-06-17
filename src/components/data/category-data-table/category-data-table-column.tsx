"use client"

import {ColumnDef} from "@tanstack/react-table"
import {Checkbox} from "@/components/ui/checkbox"
import {DataTableColumnHeader} from "@/components/data/data-table-column-header"
import {CategoryDataTableRowActions} from "@/components/data/category-data-table/category-data-table-row-actions";
import {Avatar} from "@/components/ui/avatar";
import {AvatarImage} from "@/components/ui/avatar";
import {AvatarFallback} from "@/components/ui/avatar";
import {Category} from "@/schemas";
import {CategoryIcons} from "@/components/icons/category-icons";


export const categoryColumns: ColumnDef<Category>[] = [
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
        accessorKey: "image",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Image"/>
        ),
        cell: ({row}) => {

            const name: string = row.getValue("name");
            const fallBackName = name.slice(0, 2).toUpperCase();
            const storedIcon: string = row.getValue("image");
            const listArray = Object.entries(CategoryIcons)?.find((icon) => icon[0] === storedIcon);
            if (Array.isArray(listArray)) {
                const [key, Icon] = listArray;

                if (Icon) {
                    return <Icon/>
                }
            }
            return (
                <Avatar>
                    <AvatarImage src={""} alt={name}/>
                    <AvatarFallback>{fallBackName}</AvatarFallback>
                </Avatar>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Name"/>
        ),
        cell: ({row}) => {

            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
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
        id: "actions",
        cell: ({row}) => <CategoryDataTableRowActions row={row} />,
    },
]