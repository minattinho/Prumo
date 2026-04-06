"use server";

import { createClient } from "@/lib/supabase/server";

export async function completeOnboarding() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("professional_profiles")
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("user_id", user.id);
}
