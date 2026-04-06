import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = formData.get("folder") as string | null;

  if (!file || !folder) {
    return NextResponse.json({ error: "Arquivo ou pasta não informados" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${user.id}/${Date.now()}.${ext}`;
  const bucket = folder === "profiles" ? "profiles" : "portfolio";

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, { cacheControl: "3600", upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
