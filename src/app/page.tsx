
import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { buttonVariants } from "@/components/ui/button"
import {SiteHeader} from "@/components/site-header";

export default function Home() {
  return (
      <>
        <SiteHeader />
          <div className="container relative">
              <PageHeader>
                  <PageHeaderHeading>Be productive, and reach your dreams.</PageHeaderHeading>
                  <PageHeaderDescription>
                      Dashboard, scheduler, charts, data tables, time tracking.
                  </PageHeaderDescription>
                  <PageActions>
                      <Link href="/auth/signin" className={cn(buttonVariants())}>
                          Sign in
                      </Link>
                      <Link
                          rel="noreferrer"
                          href="/auth/signup"
                          className={cn(buttonVariants({variant: "outline"}))}
                      >
                          Sign up
                      </Link>
                  </PageActions>
              </PageHeader>
          </div>
      </>
  );
}
