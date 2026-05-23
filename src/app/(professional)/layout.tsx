import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./painel/sidebar";
import { OnboardingTour } from "./painel/onboarding-tour";
import { slugify } from "@/lib/utils";

export default async function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/profissional?next=/painel");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "professional") {
    redirect(process.env.NEXT_PUBLIC_MAIN_URL ?? "/");
  }

  let { data: professionalProfile } = await supabase
    .from("professional_profiles")
    .select("id, slug, status, subscription_status, photo_url, onboarding_completed_at")
    .eq("user_id", user.id)
    .single();

  if (!professionalProfile) {
    const slug = `${slugify(profile.name ?? user.email ?? "profissional")}-${user.id.slice(0, 6)}`;
    const trialEndsAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: newProfile } = await supabase
      .from("professional_profiles")
      .insert({
        user_id: user.id,
        slug,
        status: "PENDING",
        subscription_status: "TRIAL",
        trial_ends_at: trialEndsAt,
      })
      .select("id, slug, status, subscription_status, photo_url, onboarding_completed_at")
      .single();

    if (newProfile) {
      professionalProfile = newProfile;
      // Inicializar métricas padrão
      await supabase.from("professional_metrics").upsert(
        { professional_id: newProfile.id },
        { onConflict: "professional_id" }
      );
    }
  }

  const displayName = user.user_metadata?.full_name ?? user.email ?? null;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar profile={{ full_name: displayName }} professionalProfile={professionalProfile} />
      <OnboardingTour open={!professionalProfile?.onboarding_completed_at} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
