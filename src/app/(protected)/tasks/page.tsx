import {getTasksByUser} from "@/data/task";
import {taskColumns} from "@/components/data/task-data-table/task-data-table-column";
import * as React from "react";
import TaskDataTableToolbar from "@/components/data/task-data-table/task-data-table-toolbar";
import {DataTableToolbarProps} from "@/types/data-table";
import {TaskDataTable} from "@/components/data/task-data-table/task-data-table";
import {getCategoryByUser} from "@/data/category";
import {getTaskFormCategoryByUser} from "@/data/category";


export default async function TaskPage () {

    const tasks = await getTasksByUser();
    const categories = await getTaskFormCategoryByUser();

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
                </div>
            </div>
            <TaskDataTable data={tasks ?? []} categories={categories ?? []} columns={taskColumns} />
        </div>
    )
}