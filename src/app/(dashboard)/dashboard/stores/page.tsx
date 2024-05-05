import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { env } from "@/env.js"

import { getStoresByUserId } from "@/lib/actions/store"
import { getCachedUser, getUserPlanMetrics } from "@/lib/queries/user"
import { PageHeader, PageHeaderHeading } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { StoreCardSkeleton } from "@/components/store-card-skeleton"

import { CreateStoreDialog } from "./_components/create-store-dialog"
import { Stores } from "./_components/stores"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Stores",
  description: "Manage your stores",
}

export default async function StoresPage() {
  const user = await getCachedUser()

  if (!user) {
    redirect("/signin")
  }

  const storesPromise = getStoresByUserId({ userId: user.id })
  const planMetricsPromise = getUserPlanMetrics({ userId: user.id })

  return (
    <Shell variant="sidebar">
      <PageHeader className="max-w-full flex-row gap-4">
        <PageHeaderHeading size="sm" className="flex-1">
          Stores
        </PageHeaderHeading>
        <CreateStoreDialog
          userId={user.id}
          planMetricsPromise={planMetricsPromise}
        />
      </PageHeader>
      <section className="flex items-center gap-4">
        <React.Suspense
          fallback={Array.from({ length: 3 }).map((_, i) => (
            <StoreCardSkeleton key={i} />
          ))}
        >
          <Stores storesPromise={storesPromise} />
        </React.Suspense>
      </section>
    </Shell>
  )
}
