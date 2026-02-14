import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, ScanLine, Activity, Shield, Power, Hash } from "lucide-react";
import { toast } from "sonner";

interface AdminData {
  totalUsers: number;
  totalScans: number;
  activeUsersWeek: number;
  topUsers: { email: string; scan_count: number }[];
  settings: { key: string; value: string }[];
}

const Admin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      toast.error("Access denied");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    await loadStats(session.access_token);
  };

  const loadStats = async (token: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to load stats");
      const result = await response.json();
      setData(result);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key, value }),
        }
      );
      if (!response.ok) throw new Error("Failed to update setting");
      toast.success("Setting updated");
      await loadStats(session.access_token);
    } catch {
      toast.error("Failed to update setting");
    }
  };

  if (!isAdmin) return null;

  const getSetting = (key: string) => data?.settings.find((s) => s.key === key)?.value || "";

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <h1 className="font-display text-2xl font-bold text-primary glow-text mb-8">
          <Shield className="w-6 h-6 inline mr-2" />
          Admin Dashboard
        </h1>

        {loading ? (
          <p className="text-muted-foreground font-body">Loading...</p>
        ) : data ? (
          <div className="space-y-8">
            {/* Stats grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Total Users", value: data.totalUsers, icon: Users },
                { label: "Total Scans", value: data.totalScans, icon: ScanLine },
                { label: "Active This Week", value: data.activeUsersWeek, icon: Activity },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                  <p className="font-display text-3xl font-black text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Settings */}
            <div className="glass-card p-6">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4 uppercase tracking-wider">
                Controls
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Power className="w-4 h-4 text-primary" />
                    <span className="text-sm font-body text-foreground">AI Analysis</span>
                  </div>
                  <button
                    onClick={() =>
                      updateSetting("ai_enabled", getSetting("ai_enabled") === "true" ? "false" : "true")
                    }
                    className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                      getSetting("ai_enabled") === "true"
                        ? "bg-verdict-real/20 text-verdict-real border border-verdict-real/30"
                        : "bg-verdict-ai/20 text-verdict-ai border border-verdict-ai/30"
                    }`}
                  >
                    {getSetting("ai_enabled") === "true" ? "ON" : "OFF"}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    <span className="text-sm font-body text-foreground">Free Weekly Limit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 3, 5, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => updateSetting("free_weekly_limit", String(n))}
                        className={`px-3 py-1 rounded text-xs font-heading font-bold transition-all ${
                          getSetting("free_weekly_limit") === String(n)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top users */}
            {data.topUsers.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="font-heading text-lg font-bold text-foreground mb-4 uppercase tracking-wider">
                  Top Users
                </h2>
                <div className="space-y-2">
                  {data.topUsers.map((u, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
                    >
                      <span className="text-sm font-body text-foreground">{u.email || "Unknown"}</span>
                      <span className="text-xs font-heading font-bold text-primary">
                        {u.scan_count} scans
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Admin;
