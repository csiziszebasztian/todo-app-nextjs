import {db} from "@/lib/db";
import {auth} from "@/auth/auth";
import {z} from "zod";
import {CategorySchema} from "@/schemas";

export const getCategoryByUser = async () => {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const categories = await db.category.findMany({where: {userId},});
        return z.array(CategorySchema).parse(categories);
    } catch {
        return null;
    }
}

export const getTaskFormCategoryByUser = async () => {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        const categories = await db.category.findMany({
            where: {userId},
            select: {
                id: true,
                name: true,
            }
        });
        return z.array(CategorySchema).parse(categories);
    } catch {
        return null;
    }
}

export const getNumberOfCategory = async () => {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        return await db.category.count({
            where: {userId},
        });
    } catch {
        return null;
    }
}