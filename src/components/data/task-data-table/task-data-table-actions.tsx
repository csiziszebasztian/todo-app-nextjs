"use client"

import {Dialog} from "@/components/ui/dialog";
import {DialogContent} from "@/components/ui/dialog";
import {DialogHeader} from "@/components/ui/dialog";
import {DialogTitle} from "@/components/ui/dialog";
import {DialogDescription} from "@/components/ui/dialog";
import {DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import TaskForm from "@/components/data/task-data-table/task-form";
import {useState} from "react";
import {useTransition} from "react";
import {DropdownMenu} from "@/components/ui/dropdown-menu";
import {DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {DropdownMenuContent} from "@/components/ui/dropdown-menu";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {DropdownMenuSeparator} from "@/components/ui/dropdown-menu";
import {DropdownMenuSub} from "@/components/ui/dropdown-menu";
import {DropdownMenuSubTrigger} from "@/components/ui/dropdown-menu";
import {DropdownMenuSubContent} from "@/components/ui/dropdown-menu";
import {DropdownMenuRadioGroup} from "@/components/ui/dropdown-menu";
import {DropdownMenuRadioItem} from "@/components/ui/dropdown-menu";
import {statuses} from "@/components/data/task-data-table/task-data";
import {priorities} from "@/components/data/task-data-table/task-data";
import {Table} from "@tanstack/react-table";
import {TaskSchema} from "@/schemas";
import * as z from "zod";
import {createTaskAction} from "@/actions/create-task";
import {toast} from "sonner";
import {Icons} from "@/components/icons/icons";
import {deleteTaskAction} from "@/actions/delete-task";
import {TaskStatus} from "@prisma/client";
import {TaskPriority} from "@prisma/client";
import {Category} from "@/schemas";
import {QuickUpdateTaskStatusData} from "@/types/data-table";
import {quickUpdateTaskStatusAction} from "@/actions/update-task";
import {QuickUpdateTaskPriorityData} from "@/types/data-table";
import {quickUpdatePriorityStatusAction} from "@/actions/update-task";

interface DataTableActionsProps<TData> {
    table: Table<TData>
}

export default function TaskDataTableActions<TData>({
                                                    table,
                                                }: DataTableActionsProps<TData>) {

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isLoading, startTransition] = useTransition();

    const onSubmit = async (values: z.infer<typeof TaskSchema>) => {
        startTransition(() => {
            createTaskAction(values).then((data) => {
                toast(data?.error ?? data?.success, {});
            })
        });
    }

    const handleDelete = () => {
        const listOfId: string[] = [];
        table.getSelectedRowModel().rows.forEach(data => {
            const id = TaskSchema.parse(data.original).id
            if(typeof id === "string") {
                listOfId.push(id);
            }
        });
        startTransition(() => {
            deleteTaskAction(listOfId).then((data) => {
                toast(data?.error ?? data?.success, {});
                setDeleteModalOpen(false);
                table.resetRowSelection();
            })
        });
    }
    const handleQuickUpdateTaskStatusAction = (value: string) => {
        const listOfId: string[] = [];
        const status = TaskStatus[value as keyof typeof TaskStatus];
        table.getSelectedRowModel().rows.forEach(data => {
            const id = TaskSchema.parse(data.original).id
            if(typeof id === "string") {
                listOfId.push(id);
            }
        });

        const quickUpdateTaskStatusData: QuickUpdateTaskStatusData = {
            id: listOfId,
            value: status
        }

        startTransition(() => {
            quickUpdateTaskStatusAction(quickUpdateTaskStatusData).then((data) => {
                toast(data?.error ?? data?.success, {});
                setDeleteModalOpen(false);
                table.resetRowSelection();
            })
        });
    }

    const handleQuickUpdateTaskPriorityAction = (value: string) => {
        const listOfId: string[] = [];
        const priority = TaskPriority[value as keyof typeof TaskPriority];
        table.getSelectedRowModel().rows.forEach(data => {
            const id = TaskSchema.parse(data.original).id
            if(typeof id === "string") {
                listOfId.push(id);
            }
        });

        const quickUpdateTaskPriorityData: QuickUpdateTaskPriorityData = {
            id: listOfId,
            value: priority
        }

        startTransition(() => {
            quickUpdatePriorityStatusAction(quickUpdateTaskPriorityData).then((data) => {
                toast(data?.error ?? data?.success, {});
                setDeleteModalOpen(false);
                table.resetRowSelection();
            })
        });
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
                    <DropdownMenuItem onClick={() => setCreateModalOpen(true)}>
                        Creat
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={table.getSelectedRowModel().rows.length < 2} onClick={() => setDeleteModalOpen(true)}>Delete</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger disabled={table.getSelectedRowModel().rows.length < 2} >Statuses</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup onValueChange={handleQuickUpdateTaskStatusAction}>
                                {statuses.map((status) => (
                                    <DropdownMenuRadioItem key={status.value} value={status.value}>
                                        {status.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger disabled={table.getSelectedRowModel().rows.length < 2}>Priorities</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup onValueChange={handleQuickUpdateTaskPriorityAction}>
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
                <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
                            <DialogHeader>
                                <DialogTitle>Create task</DialogTitle>
                                <DialogDescription>
                                    You can add a new task here. Click save when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>
                            <TaskForm categories={(table.options.meta as Category)} onSubmit={onSubmit}/>
                        </DialogContent>
                </Dialog>
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete task</DialogTitle>
                        <DialogDescription>
                            Do you want delete {table.getSelectedRowModel().rows.length} task?
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
        </>
    )
}