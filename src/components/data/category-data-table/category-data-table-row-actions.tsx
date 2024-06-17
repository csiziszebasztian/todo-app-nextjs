"use client"

import {MoreHorizontal} from "lucide-react"
import {Row} from "@tanstack/react-table"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"

import * as z from "zod";
import {toast} from "sonner";
import {CategorySchema} from "@/schemas";
import {Dialog} from "@/components/ui/dialog";
import {DialogContent} from "@/components/ui/dialog";
import {DialogHeader} from "@/components/ui/dialog";
import {DialogTitle} from "@/components/ui/dialog";
import {DialogDescription} from "@/components/ui/dialog";
import {DialogFooter} from "@/components/ui/dialog";
import {useState} from "react";
import {useTransition} from "react";
import {Icons} from "@/components/icons/icons";
import CategoryForm from "@/components/data/category-data-table/category-form";
import {deleteCategoryAction} from "@/actions/delete-category";
import {updateCategoryAction} from "@/actions/update-category";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function CategoryDataTableRowActions<TData>({
                                               row,
                                           }: DataTableRowActionsProps<TData>) {

    const task = CategorySchema.parse(row.original);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isLoading, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(() => {
            if (task?.id) {
                deleteCategoryAction(task?.id).then((data) => {
                    toast(data?.error ?? data?.success, {});
                    setDeleteModalOpen(false);
                })
            }
        });
    }

    const onSubmit = (values: z.infer<typeof CategorySchema>) => {
        startTransition(() => {
            updateCategoryAction(values).then((data) => {
                toast(data?.error ?? data?.success, {});
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
                    <DropdownMenuItem onClick={() => setEditModalOpen(true)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteModalOpen(true)}>Delete</DropdownMenuItem>
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
                    <CategoryForm
                        id={task.id ?? undefined}
                        name={task.name}
                        description={task.description ?? undefined}
                        image={task.image ?? undefined}
                        onSubmit={onSubmit}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}