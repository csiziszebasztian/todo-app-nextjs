"use server";

import {db} from "@/lib/db";
import {revalidatePath} from "next/cache";
import {currentUser} from "@/lib/auth";

export const deleteCategoryAction = async (values: string | string[]) => {

    try{

        const user = await currentUser();

        if(!user || !user?.id) {
            return {error: "Unauthorized!"}
        }

        if(typeof values === "string") {
            await db.category.delete({
                where: {
                    id: values,
                    userId: user?.id
                }
            });
        }
        else if (Array.isArray(values))  {
            await db.category.deleteMany({
                where: {
                    userId: user?.id,
                    id: { in: values },
                }
            });
        }
        revalidatePath("/category");
    } catch (error) {
        return {error: "Something went wrong!"}
    }

    return {success: "Task created!"}

};