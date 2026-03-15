import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    hasUrl: !!url,
    hasKey: !!key,
    urlPrefix: url ? url.substring(0, 30) + "..." : null,
    nodeEnv: process.env.NODE_ENV,
  });
}
