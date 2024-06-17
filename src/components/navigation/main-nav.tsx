"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import {usePathname} from "next/navigation";

export function MainNav({
                            className,
                            ...props
                        }: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();

    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/dashboard"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
                )}
            >
                Dashboard
            </Link>
            <Link
                href="/tasks"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/tasks"
                        ? "text-foreground"
                        : "text-muted-foreground"
                )}
            >
                Tasks
            </Link>
            <Link
                href="/categories"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/categories"
                        ? "text-foreground"
                        : "text-muted-foreground"
                )}
            >
                Categories
            </Link>
            <Link
                href="/scheduler"
                className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === "/scheduler"
                        ? "text-foreground"
                        : "text-muted-foreground"
                )}
            >
                Scheduler
            </Link>
        </nav>
    )
}