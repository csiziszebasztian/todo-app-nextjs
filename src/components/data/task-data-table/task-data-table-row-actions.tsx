"use client"

import {MoreHorizontal} from "lucide-react"
import {Row} from "@tanstack/react-table"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {DropdownMenuSub} from "@/components/ui/dropdown-menu";
import {DropdownMenuSubTrigger} from "@/components/ui/dropdown-menu";
import {DropdownMenuSubContent} from "@/components/ui/dropdown-menu";
import {DropdownMenuRadioGroup} from "@/components/ui/dropdown-menu";
import {DropdownMenuRadioItem} from "@/components/ui/dropdown-menu";

import {TaskSchema} from "@/schemas"
import {Category} from "@/schemas";
import {statuses} from "@/components/data/task-data-table/task-data";
import {priorities} from "@/components/data/task-data-table/task-data";
import {Dialog} from "@/components/ui/dialog";
import {DialogContent} from "@/components/ui/dialog";
import {DialogHeader} from "@/components/ui/dialog";
import {DialogTitle} from "@/components/ui/dialog";
import {DialogDescription} from "@/components/ui/dialog";
import {DialogFooter} from "@/components/ui/dialog";
import TaskForm from "@/components/data/task-data-table/task-form";
import {useState} from "react";
import {useTransition} from "react";
import {Icons} from "@/components/icons/icons";
import {deleteTaskAction} from "@/actions/delete-task";
import * as z from "zod";
import {toast} from "sonner";
import {TaskStatus} from "@prisma/client";
import {TaskPriority} from "@prisma/client";
import {updateTaskAction} from "@/actions/update-task";
import {QuickUpdateTaskStatusData} from "@/types/data-table";
import {quickUpdateTaskStatusAction} from "@/actions/update-task";
import {QuickUpdateTaskPriorityData} from "@/types/data-table";
import {quickUpdatePriorityStatusAction} from "@/actions/update-task";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>,
    categories: Category[]
}

export function TaskDataTableRowActions<TData>({
                                                   row,
                                                   categories
                                               }: DataTableRowActionsProps<TData>) {

    const task = TaskSchema.parse(row.original);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isLoading, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(() => {
            if (task?.id) {
                deleteTaskAction(task?.id).then((data) => {
                    toast(data?.error ?? data?.success, {});
                    setDeleteModalOpen(false);
                })
            }
        });
    }

    const onSubmit = (values: z.infer<typeof TaskSchema>) => {
        startTransition(() => {
            updateTaskAction(values, task?.categories).then((data) => {
                toast(data?.error ?? data?.success, {});
            })
        });
    }

    const handleQuickUpdateTaskStatusAction = (value: string) => {

        const status = TaskStatus[value as keyof typeof TaskStatus];

        if(typeof task?.id === "string") {

            const quickUpdateTaskStatusData: QuickUpdateTaskStatusData = {
                id: task?.id,
                value: status
            }

            startTransition(() => {
                quickUpdateTaskStatusAction(quickUpdateTaskStatusData).then((data) => {
                    toast(data?.error ?? data?.success, {});
                    setDeleteModalOpen(false);
                })
            });
        }
    }

    const handleQuickUpdatePriorityStatusAction = (value: string) => {

        const priority = TaskPriority[value as keyof typeof TaskPriority];

        if(typeof task?.id === "string") {

            const quickUpdateTaskPriorityData: QuickUpdateTaskPriorityData = {
                id: task?.id,
                value: priority
            }

            startTransition(() => {
                quickUpdatePriorityStatusAction(quickUpdateTaskPriorityData).then((data) => {
                    toast(data?.error ?? data?.success, {});
                    setDeleteModalOpen(false);
                })
            });
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal className="h-4 w-4"/>
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => setEditModalOpen(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteModalOpen(true)}>Delete</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Statuses</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup onValueChange={handleQuickUpdateTaskStatusAction} value={task.status}>
                                {statuses.map((status) => (
                                    <DropdownMenuRadioItem key={status.value} value={status.value}>
                                        {status.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Priorities</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup onValueChange={handleQuickUpdatePriorityStatusAction} value={task.priority}>
                                {priorities.map((priority) => (
                                    <DropdownMenuRadioItem key={priority.value} value={priority.value}>
                                        {priority.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete task</DialogTitle>
                        <DialogDescription>
                            You can delete task here. Click delete when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleDelete} disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="sm:max-w-[750px]">
                    <DialogHeader>
                        <DialogTitle>Edit task</DialogTitle>
                        <DialogDescription>
                            You can edit task here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <TaskForm
                        data={task}
                        categories={categories}
                        onSubmit={onSubmit}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}