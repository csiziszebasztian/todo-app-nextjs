import {Table} from "@tanstack/react-table";
import {TaskStatus} from "@prisma/client"
import {TaskPriority} from "@prisma/client";

export interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export interface StringOrStringArrayId {
    id: string | string[],
}

export interface QuickUpdateTaskStatusData extends StringOrStringArrayId {
    value: TaskStatus
}

export interface QuickUpdateTaskPriorityData extends StringOrStringArrayId {
    value: TaskPriority
}

export interface DashboardCardData {
    todo: number,
    inProgress: number,
    done: number,
    hour: number
}
