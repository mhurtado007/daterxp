export const dynamic = "force-dynamic";

import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const { session_id } = await request.json();

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  // Use cookie-based client only to verify the authenticated user
  const authClient = await createServerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role client to bypass RLS for the upsert
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const session = await getStripe().checkout.sessions.retrieve(session_id);

    if (session.status !== "complete") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    const subscription = await getStripe().subscriptions.retrieve(subscriptionId);

    await supabase.from("subscriptions").upsert(
      {
        user_id: user.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to link subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
