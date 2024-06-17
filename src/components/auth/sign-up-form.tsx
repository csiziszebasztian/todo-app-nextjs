"use client";

import * as z from "zod";
import {useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SignUpSchema} from "@/schemas";
import {signUpAction} from "@/actions/signup";
import {Form} from "@/components/ui/form";
import {FormField} from "@/components/ui/form";
import {FormItem} from "@/components/ui/form";
import {FormLabel} from "@/components/ui/form";
import {FormControl} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {FormMessage} from "@/components/ui/form";
import {Alert} from "@/components/ui/alert";
import {AlertTitle} from "@/components/ui/alert";
import {AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons/icons";
import {AuthForm} from "@/components/auth/auth-form";

export default function SignUpForm() {

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isLoading, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        },
    });

    const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            signUpAction(values).then((data) =>{
                setError(data.error);
                setSuccess(data.success);
            })
        });
    }

    return (
        <AuthForm headerLabel={"Sign up"} backButtonLabel={"Sign in"} backButtonHref={"/auth/signin"}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="John Smith" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={isLoading}  type="email" placeholder="name@example.com" {...field} />
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
                                        <Input disabled={isLoading}  type="password" placeholder="******" {...field} />
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