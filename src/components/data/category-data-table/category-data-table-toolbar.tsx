import {Input} from "@/components/ui/input"
import DataTableViewOptions from "@/components/data/data-table-view-options"
import CategoryDataTableActions from "@/components/data/category-data-table/category-data-table-actions";
import {DataTableToolbarProps} from "@/types/data-table";


export default function CategoryDataTableToolbar<TData>({
                                            table,
                                        }: DataTableToolbarProps<TData>) {

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter tasks..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
            </div>
            <div className="flex gap-3">
                <CategoryDataTableActions table={table}/>
                <DataTableViewOptions table={table} />
            </div>
        </div>
    )
}