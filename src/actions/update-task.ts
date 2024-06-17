"use server";

import {db} from "@/lib/db";
import * as z from "zod";
import {TaskSchema} from "@/schemas";
import {revalidatePath} from "next/cache";
import {currentUser} from "@/lib/auth";
import {Task} from "@/schemas";
import {Option} from "@/components/ui/multi-selector";
import {QuickUpdateTaskPriorityData} from "@/types/data-table";
import {QuickUpdateTaskStatusData} from "@/types/data-table";


export const updateTaskAction = async (values: Task, prevCategories: Option[] | undefined | null) => {

    const validateFields = TaskSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields!"}
    }

    const {
        id,
        title,
        description,
        status,
        priority,
        startedAt,
        finishedAt,
        categories
    } = validateFields.data

    const disConnectCategories = prevCategories?.filter(prev => !categories?.some(category => category.value === prev.value));

    try {

        const user = await currentUser();

        if (!user || !user.id) {
            return {error: "Unauthorized!"}
        }

        if (!id) {
            return {error: "No task selected!"}
        }

        const currentTask = await db.task.findUnique({
            where: { id },
            select: { status: true },
        });

        await db.task.update({
            where: {
                id,
                userId: user?.id
            },
            data: {
                categories: {
                    disconnect:  disConnectCategories?.map(category => ({id: category?.value}))
                }
            },
        });

        await db.task.update({
            where: {
                id,
                userId: user?.id
            },
            data: {
                title,
                description,
                status,
                priority,
                startedAt,
                finishedAt,
                categories: {
                    connect:  categories?.map(category => ({id: category?.value}))
                }
            },
        });

        if (currentTask?.status !== status) {
            await db.taskStatusHistory.create({
                data:  {
                    taskId: id,
                    status
                },
            });
        }

        revalidatePath("/tasks");

    } catch (error) {
        return {error: "Something went wrong!"}
    }

    return {success: "Task saved!"}

};


export const quickUpdateTaskStatusAction = async (values: QuickUpdateTaskStatusData) => {

    const {
        id,
        value,
    } = values;

    try {

        const user = await currentUser();

        if (!user || !user.id) {
            return {error: "Unauthorized!"}
        }

        if (Array.isArray(id)) {

            const currentStatuses = await db.task.findMany({
                where: {
                    id: {
                        in: id
                    },
                    userId: user?.id
                },
                select: { id: true, status: true }
            });

            await db.task.updateMany({
                where: {
                    id: {
                        in: id
                    },
                    userId: user?.id
                },
                data: {status: value},
            });

            for (const task of currentStatuses) {
                if (task.status !== value) {
                    await db.taskStatusHistory.create({
                        data: {
                            taskId: task.id,
                            status: value,
                        },
                    });
                }
            }

        } else {

            const currentTask = await db.task.findUnique({
                where: { id },
                select: { status: true },
            });

            await db.task.update({
                where: {
                    id,
                    userId: user?.id
                },
                data: {status: value},
            });

            if (currentTask?.status !== value) {
                await db.taskStatusHistory.create({
                    data:  {
                        taskId: id,
                        status: value
                    },
                });
            }
        }
        revalidatePath("/tasks");

    } catch (error) {
        return {error: "Something went wrong!"}
    }

    return {success: "Task saved!"}

};

export const quickUpdatePriorityStatusAction = async (values: QuickUpdateTaskPriorityData) => {


    const {
        id,
        value
    } = values;

    try {

        const user = await currentUser();

        if (!user || !user.id) {
            return {error: "Unauthorized!"}
        }

        if (!id) {
            return {error: "No task selected!"}
        }

        if (Array.isArray(id)) {
            await db.task.updateMany({
                where: {
                    id: {
                        in: id
                    },
                    userId: user?.id
                },
                data: {priority: value},
            });
        } else {
            await db.task.update({
                where: {
                    id,
                    userId: user?.id
                },
                data: {priority: value},
            });
        }

        revalidatePath("/tasks");

    } catch (error) {
        return {error: "Something went wrong!"}
    }

    return {success: "Task saved!"}

};