import {Plus} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import DataTableViewOptions from "@/components/data/data-table-view-options"

import {priorities, statuses} from "@/components/data/task-data-table/task-data"
import DataTableFacetedFilter from "@/components/data/data-table-faceted-filter"
import TaskDataTableActions from "@/components/data/task-data-table/task-data-table-actions";
import {DataTableToolbarProps} from "@/types/data-table";
import {Category} from "@/schemas";


export default function TaskDataTableToolbar<TData>({
                                                        table,
                                                    }: DataTableToolbarProps<TData>) {

    const isFiltered = table.getState().columnFilters.length > 0
    let categoriesTransformedArray: {
        value: string,
        label: string
    }[] = (Array.isArray(table.options.meta)) ? Array.from(new Set(table.options.meta.map(item => ({
        value: item?.id,
        label: item?.name
    })))): [];

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter tasks..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statuses}
                    />
                )}
                {table.getColumn("priority") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("priority")}
                        title="Priority"
                        options={priorities}
                    />
                )}
                {table.getColumn("categories") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("categories")}
                        title="Categories"
                        options={categoriesTransformedArray}
                        isDataInArray={true}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Plus className="ml-2 h-4 w-4"/>
                    </Button>
                )}
            </div>
            <div className="flex gap-3">
                <TaskDataTableActions table={table}/>
                <DataTableViewOptions table={table}/>
            </div>
        </div>
    )
}