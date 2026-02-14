import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, AlertTriangle, HelpCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AnalyzerCard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ confidence: number; verdict: string } | null>(null);
  const [remainingScans, setRemainingScans] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkUsageLimit = useCallback(async () => {
    if (!user) {
      // Guest: check localStorage
      const guestUsed = localStorage.getItem("satyalens_guest_used");
      if (guestUsed === "true") {
        setLimitReached(true);
        setRemainingScans(0);
      } else {
        setLimitReached(false);
        setRemainingScans(1);
      }
      return;
    }

    // Logged in: check weekly scans
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("scans")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", oneWeekAgo);

    const { data: limitSetting } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "free_weekly_limit")
      .maybeSingle();

    const limit = parseInt(limitSetting?.value || "3", 10);
    const used = count || 0;
    const remaining = Math.max(0, limit - used);

    setRemainingScans(remaining);
    setLimitReached(remaining <= 0);
  }, [user]);

  useEffect(() => {
    checkUsageLimit();
  }, [checkUsageLimit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setFile(selected);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const analyzeImage = async () => {
    if (!file || !preview) return;
    if (limitReached) {
      toast.error("Weekly limit reached. Upgrade or wait for reset.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Minimum 2s loading for UX
    const minWait = new Promise((r) => setTimeout(r, 2000));

    try {
      const session = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      };
      if (session.data.session?.access_token) {
        headers.Authorization = `Bearer ${session.data.session.access_token}`;
      }

      const [response] = await Promise.all([
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-image`, {
          method: "POST",
          headers,
          body: JSON.stringify({ imageBase64: preview }),
        }),
        minWait,
      ]);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);

      // Mark guest usage
      if (!user) {
        localStorage.setItem("satyalens_guest_used", "true");
      }

      await checkUsageLimit();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict.includes("Real")) return "text-verdict-real";
    if (verdict.includes("Uncertain")) return "text-verdict-uncertain";
    return "text-verdict-ai";
  };

  const getVerdictIcon = (verdict: string) => {
    if (verdict.includes("Real")) return <CheckCircle className="w-6 h-6" />;
    if (verdict.includes("Uncertain")) return <HelpCircle className="w-6 h-6" />;
    return <AlertTriangle className="w-6 h-6" />;
  };

  const getVerdictBg = (verdict: string) => {
    if (verdict.includes("Real")) return "border-verdict-real/30 bg-verdict-real/5";
    if (verdict.includes("Uncertain")) return "border-verdict-uncertain/30 bg-verdict-uncertain/5";
    return "border-verdict-ai/30 bg-verdict-ai/5";
  };

  return (
    <section id="analyzer" className="py-16 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 sm:p-8 glow-border"
        >
          <h2 className="font-display text-lg font-bold text-primary mb-6 text-center glow-text">
            Image Analyzer
          </h2>

          {/* Upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/40 rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors group"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg object-contain"
              />
            ) : (
              <div className="space-y-3">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="text-sm text-muted-foreground font-body">
                  Click to upload an image
                </p>
                <p className="text-xs text-muted-foreground/50 font-body">
                  JPG, PNG, WebP supported
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Usage info */}
          <div className="mt-4 text-center">
            {remainingScans !== null && (
              <p className="text-xs text-muted-foreground font-body">
                {limitReached ? (
                  <span className="text-verdict-ai font-semibold">
                    Weekly limit reached. {user ? "Upgrade or wait for reset." : "Sign in for more scans."}
                  </span>
                ) : (
                  <span>
                    {remainingScans} scan{remainingScans !== 1 ? "s" : ""} remaining
                    {!user && " (guest)"}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Analyze button */}
          <button
            onClick={analyzeImage}
            disabled={!file || loading || limitReached}
            className="w-full mt-5 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm uppercase tracking-wider hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all animate-pulse-glow"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Analyze Image"
            )}
          </button>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <div className={`rounded-xl border p-5 ${getVerdictBg(result.verdict)}`}>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className={getVerdictColor(result.verdict)}>
                      {getVerdictIcon(result.verdict)}
                    </span>
                    <span className={`font-display text-lg font-bold ${getVerdictColor(result.verdict)}`}>
                      {result.verdict}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-display font-black text-foreground">
                      {result.confidence}%
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 font-body">
                      AI-generated confidence score
                    </p>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        result.confidence >= 70
                          ? "bg-verdict-ai"
                          : result.confidence >= 40
                          ? "bg-verdict-uncertain"
                          : "bg-verdict-real"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyzerCard;
