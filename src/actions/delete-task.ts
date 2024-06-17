"use server";

import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {currentUser} from "@/lib/auth";

export const deleteTaskAction = async (values: string | string[]) => {

    try {

        const user = await currentUser();

        if (!user || !user?.id) {
            return {error: "Unauthorized!"}
        }

        if (typeof values === "string") {
            await db.task.delete({
                where: {
                    id: values,
                    userId: user?.id
                }
            });
        } else if (Array.isArray(values)) {
            await db.task.deleteMany({
                where: {
                    userId: user?.id,
                    id: {in: values},
                }
            });
        }

        revalidatePath("/tasks");
    } catch (error) {
        return {error: "Something went wrong!"}
    }

    return {success: "Task deleted!"}

};