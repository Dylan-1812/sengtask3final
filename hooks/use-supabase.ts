"use client"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

export function useSupabase() {
  const [supabase] = useState(() => createClient())

  return supabase
}
