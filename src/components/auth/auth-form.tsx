"use client"

import * as React from "react"

import {cn} from "@/lib/utils"
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    headerLabel: string;
    subHeaderLabel?: string
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export function AuthForm({
                                 children,
                                 headerLabel,
                                 subHeaderLabel,
                                 backButtonLabel,
                                 backButtonHref,
                                 showSocial,
                                 className,
                                 ...props
                             }: AuthFormProps) {

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Link
                href={backButtonHref}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute right-4 top-4 md:right-8 md:top-8"
                )}
            >
                {backButtonLabel}
            </Link>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {headerLabel}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {subHeaderLabel}
                </p>
            </div>
            {children}
        </div>
    )
}