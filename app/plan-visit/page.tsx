import { PlanVisitClient } from "@/components/plan-visit-client"

interface PageProps {
  searchParams: { demo?: string; park?: string }
}

export default function PlanVisitPage({ searchParams }: PageProps) {
  return <PlanVisitClient searchParams={searchParams} />
}
