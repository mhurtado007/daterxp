import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const adminIds = (process.env.ADMIN_USER_IDS || "").split(",").map((id) => id.trim());
  if (!adminIds.includes(user.email ?? "")) redirect("/dashboard");

  return <>{children}</>;
}
