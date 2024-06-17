"use client";

import * as z from "zod";
import {useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SignInSchema} from "@/schemas";
import {AuthForm} from "@/components/auth/auth-form";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons/icons";
import {Button} from "@/components/ui/button";
import {signInAction} from "@/actions/signin";
import {Form} from "@/components/ui/form";
import {FormField} from "@/components/ui/form";
import {FormItem} from "@/components/ui/form";
import {FormLabel} from "@/components/ui/form";
import {FormControl} from "@/components/ui/form";
import {FormMessage} from "@/components/ui/form";
import {Alert} from "@/components/ui/alert";
import {AlertTitle} from "@/components/ui/alert";
import {AlertDescription} from "@/components/ui/alert";

export default function SignInForm() {

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isLoading, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof SignInSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            signInAction(values).then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        });
    }

    return (
        <AuthForm headerLabel={"Sign In"} backButtonLabel={"Sign up"} backButtonHref={"/auth/signup"}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error &&
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        }
                        {success && <Alert variant="default">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>
                                {success}
                            </AlertDescription>
                        </Alert>
                        }
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Sign In
                        </Button>
                    </div>
                </form>
            </Form>
        </AuthForm>
    );
}