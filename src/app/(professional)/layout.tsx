import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./painel/sidebar";
import { OnboardingTour } from "./painel/onboarding-tour";

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
    redirect("/entrar?next=/painel");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "professional") {
    redirect(process.env.NEXT_PUBLIC_MAIN_URL ?? "/");
  }

  const { data: professionalProfile } = await supabase
    .from("professional_profiles")
    .select("id, slug, status, subscription_status, photo_url, onboarding_completed_at")
    .eq("user_id", user.id)
    .single();

  const displayName = user.user_metadata?.full_name ?? user.email ?? null;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar profile={{ full_name: displayName }} professionalProfile={professionalProfile} />
      <OnboardingTour open={!professionalProfile?.onboarding_completed_at} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
