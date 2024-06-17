"use server";

import {db} from "@/lib/db";
import * as z from "zod";
import {revalidatePath} from "next/cache";
import {currentUser} from "@/lib/auth";
import {CategorySchema} from "@/schemas";

export const createCategoryAction = async (values: z.infer<typeof CategorySchema>) => {

    const validateFields = CategorySchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields!"}
    }

    const {
        name,
        description,
        image,
    } = validateFields.data

    try {

        const user = await currentUser();

        if(!user || !user.id) {
            return {error: "Unauthorized!"}
        }

        await db.category.create({
            data: {
                userId: user?.id,
                name,
                description,
                image,
            },
        });

        revalidatePath("/categories");

    } catch (error) {
        return {error: "Something went wrong! " + error}
    }

    return {success: "Category created!"}

};