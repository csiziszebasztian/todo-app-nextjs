import {db} from "@/lib/db";
import {auth} from "@/auth/auth";
import {z} from "zod";
import {TaskSchema} from "@/schemas";
import {TaskStatus} from "@prisma/client";

export const getTasksByUser = async () => {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const tasks = await db.task.findMany({
            where: { userId },
            include: {
                categories: {
                    select: {
                        id: true,
                        name: true,
                    },
                    where: { userId }
                }
            }
        });
        const tasksWithOptions = tasks.map(task => ({
            ...task,
            categories: task.categories.map(category => ({
                label: category.name,
                value: category.id,
            }))
        }))
        return z.array(TaskSchema).parse(tasksWithOptions);
    } catch (error) {
        return null;
    }
}