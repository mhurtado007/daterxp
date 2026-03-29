export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ isAdmin: false });
  }

  const adminIds = (process.env.ADMIN_USER_IDS || "").split(",").map((id) => id.trim());
  const isAdmin = adminIds.includes(user.email ?? "");

  return NextResponse.json({ isAdmin });
}
