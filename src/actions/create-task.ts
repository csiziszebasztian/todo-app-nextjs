"use server";

import {db} from "@/lib/db";
import * as z from "zod";
import {revalidatePath} from "next/cache";
import {currentUser} from "@/lib/auth";
import {TaskSchema} from "@/schemas";
import {Category} from "@/schemas";
import {Task} from "@/schemas";


export const createTaskAction = async (values: Task) => {

    const validateFields = TaskSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields!"}
    }

    const {
        title,
        description,
        status,
        priority,
        startedAt,
        finishedAt,
        categories
    } = validateFields.data

    try {

        const user = await currentUser();

        if(!user || !user.id) {
            return {error: "Unauthorized!"}
        }


        const newTask = await db.task.create({
            data: {
                userId: user?.id,
                title,
                description,
                status,
                priority,
                startedAt,
                finishedAt,
                categories: {
                    connect:  categories?.map(category => ({id: category?.value}))
                }
            }
        });

        await db.taskStatusHistory.create({
            data: {
                taskId: newTask.id,
                status: newTask.status,
            },
        });

        revalidatePath("/tasks");

    } catch (error) {
        return {error: "Something went wrong!"}
    }

    return {success: "Task created!"}

};