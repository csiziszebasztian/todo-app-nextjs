"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons/icons"

export function LandingNav() {
    const pathname = usePathname()

    return (
        <div className="mr-4 hidden md:flex">
            <Link href="/public" className="mr-6 flex items-center space-x-2">
                <Icons.logo className="h-6 w-6"/>
                <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
            </Link>
        </div>
    )
}