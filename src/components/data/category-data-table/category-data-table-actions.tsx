"use client"

import {Dialog} from "@/components/ui/dialog";
import {DialogContent} from "@/components/ui/dialog";
import {DialogHeader} from "@/components/ui/dialog";
import {DialogTitle} from "@/components/ui/dialog";
import {DialogDescription} from "@/components/ui/dialog";
import {DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {useState} from "react";
import {useTransition} from "react";
import {DropdownMenu} from "@/components/ui/dropdown-menu";
import {DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {DropdownMenuContent} from "@/components/ui/dropdown-menu";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Table} from "@tanstack/react-table";
import * as z from "zod";
import {createTaskAction} from "@/actions/create-task";
import {toast} from "sonner";
import {Icons} from "@/components/icons/icons";
import {deleteTaskAction} from "@/actions/delete-task";
import {CategorySchema} from "@/schemas";
import CategoryForm from "@/components/data/category-data-table/category-form";
import {createCategoryAction} from "@/actions/creat-category";
import {deleteCategoryAction} from "@/actions/delete-category";
import {TaskSchema} from "@/schemas";

interface DataTableActionsProps<TData> {
    table: Table<TData>
}

export default function CategoryDataTableActions<TData>({
                                                    table,
                                                }: DataTableActionsProps<TData>) {

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isLoading, startTransition] = useTransition();

    const onSubmit = async (values: z.infer<typeof CategorySchema>) => {
        startTransition(() => {
            createCategoryAction(values).then((data) => {
                toast(data?.error ?? data?.success, {});
            })
        });
    }

    const handleDelete = () => {
        const listOfId: string[] = [];
        table.getSelectedRowModel().rows.forEach(data => {
            const id = CategorySchema.parse(data.original).id
            if(typeof id === "string") {
                listOfId.push(id);
            }
        });
        startTransition(() => {
            deleteCategoryAction(listOfId).then((data) => {
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
                </DropdownMenuContent>
            </DropdownMenu>
                <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogContent className="overflow-y-scroll max-h-screen">
                            <DialogHeader>
                                <DialogTitle>Create category</DialogTitle>
                                <DialogDescription>
                                    You can add a new category here. Click save when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>
                            <CategoryForm onSubmit={onSubmit} />
                        </DialogContent>
                </Dialog>
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete category</DialogTitle>
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