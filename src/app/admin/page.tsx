import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Users, CreditCard, TrendingUp, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

async function getAdminData() {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("user_id, status, trial_end, current_period_end, created_at, stripe_customer_id");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, created_at");

  const { data: users } = await supabase.auth.admin.listUsers();

  return { subscriptions: subscriptions ?? [], profiles: profiles ?? [], users: users?.users ?? [] };
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { subscriptions, profiles, users } = await getAdminData();

  const total = subscriptions.length;
  const trialing = subscriptions.filter((s) => s.status === "trialing").length;
  const active = subscriptions.filter((s) => s.status === "active").length;
  const canceled = subscriptions.filter((s) => s.status === "canceled" || s.status === "inactive").length;

  const userMap = Object.fromEntries(users.map((u) => [u.id, u.email]));
  const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p.username]));

  const stats = [
    { label: "Total Subscribers", value: total, icon: Users, color: "text-blue-400" },
    { label: "Active Trials", value: trialing, icon: TrendingUp, color: "text-yellow-400" },
    { label: "Paid Active", value: active, icon: CreditCard, color: "text-green-400" },
    { label: "Canceled", value: canceled, icon: XCircle, color: "text-red-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0000] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Dater<span className="text-red-500">XP</span> Admin
          </h1>
          <p className="text-gray-500 text-sm mt-1">Subscription overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-red-900/20 bg-[#130000] p-6"
            >
              <Icon className={`w-5 h-5 mb-3 ${color}`} />
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-gray-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-red-900/20 bg-[#130000] overflow-hidden">
          <div className="px-6 py-4 border-b border-red-900/20">
            <h2 className="text-white font-semibold">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-red-900/20">
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Email</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Username</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Trial Ends</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => {
                  const email = userMap[sub.user_id] ?? "—";
                  const username = profileMap[sub.user_id] ?? "—";
                  const trialEnd = sub.trial_end
                    ? new Date(sub.trial_end).toLocaleDateString()
                    : "—";
                  const joined = sub.created_at
                    ? new Date(sub.created_at).toLocaleDateString()
                    : "—";

                  const statusColors: Record<string, string> = {
                    trialing: "bg-yellow-950/60 text-yellow-400 border-yellow-900/40",
                    active: "bg-green-950/60 text-green-400 border-green-900/40",
                    canceled: "bg-red-950/60 text-red-400 border-red-900/40",
                    inactive: "bg-gray-950/60 text-gray-400 border-gray-900/40",
                    past_due: "bg-orange-950/60 text-orange-400 border-orange-900/40",
                  };
                  const statusClass =
                    statusColors[sub.status] ?? "bg-gray-950/60 text-gray-400 border-gray-900/40";

                  return (
                    <tr key={sub.user_id} className="border-b border-red-900/10 hover:bg-red-950/10 transition-colors">
                      <td className="px-6 py-4 text-gray-300">{email}</td>
                      <td className="px-6 py-4 text-gray-400">{username}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs border ${statusClass}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{trialEnd}</td>
                      <td className="px-6 py-4 text-gray-400">{joined}</td>
                    </tr>
                  );
                })}
                {subscriptions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-600">
                      No subscribers yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
