"use server";

import * as z from "zod";
import {signIn} from "@/auth/auth";
import {SignInSchema} from "@/schemas";
import {DEFAULT_SIGN_IN_REDIRECT} from "@/routes/routes";
import {AuthError} from "next-auth";

export const signInAction = async (values: z.infer<typeof SignInSchema>) => {
    const validateFields = SignInSchema.safeParse(values);
    if (!validateFields.success) {
        return {error: "Invalid fields!"}
    }

    const {email, password} = validateFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_SIGN_IN_REDIRECT
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {error: "Invalid credentials!"}
                default:
                    return {error: "Something went wrong!"}
            }
        }
        throw error;
    }

    return {success: "Email sent!"}

}