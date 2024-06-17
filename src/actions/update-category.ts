"use server"

import * as z from "zod";
import {CategorySchema} from "@/schemas";
import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";

export const updateCategoryAction = async (values: z.infer<typeof CategorySchema>) => {

    const validateFields = CategorySchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields!"}
    }

    const {
        id,
        name,
        description,
        image
    } = validateFields.data

    try {

        const user = await currentUser();

        if (!user || !user.id) {
            return {error: "Unauthorized!"}
        }

        if (!id) {
            return {error: "No task selected!"}
        }

        await db.category.update({
            where: {
                id,
                userId: user?.id
            },
            data: {
                id,
                name,
                description,
                image
            },
        });

        revalidatePath("/categories");

    } catch (error) {
        return {error: "Something went wrong!"}
    }

    return {success: "Category saved!"}

};