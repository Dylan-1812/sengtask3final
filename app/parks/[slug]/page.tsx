import { Suspense } from "react"
import { ParkPageClient } from "./park-page-client"
import { sydneyDogParks } from "@/lib/parks-data"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return sydneyDogParks.map((park) => ({
    slug: park.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const park = sydneyDogParks.find((p) => p.slug === params.slug)

  if (!park) {
    return {
      title: "Park Not Found",
    }
  }

  return {
    title: `${park.name} - Tail Trails`,
    description: park.description,
  }
}

interface PageProps {
  params: { slug: string }
  searchParams: { demo?: string }
}

export default async function ParkPage({ params, searchParams }: PageProps) {
  // Verify the park exists
  const park = sydneyDogParks.find((p) => p.slug === params.slug)

  if (!park) {
    notFound()
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading park details...</p>
          </div>
        </div>
      }
    >
      <ParkPageClient params={params} searchParams={searchParams} park={park} />
    </Suspense>
  )
}
