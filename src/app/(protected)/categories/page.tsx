import {getCategoryByUser} from "@/data/category";
import {CategoryDataTable} from "@/components/data/category-data-table/category-data-table";
import {categoryColumns} from "@/components/data/category-data-table/category-data-table-column";


export default async function CategoriesPage () {

    const categories = await getCategoryByUser();

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
                </div>
            </div>
            <CategoryDataTable data={categories ?? []} columns={categoryColumns} />
        </div>
    )
}