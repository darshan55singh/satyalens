import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { toast } from "sonner";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal = ({ onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created! You can now log in.");
        onClose();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-8 w-full max-w-md animate-slide-up glow-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-display text-xl font-bold text-primary mb-6 glow-text text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-input border border-border/40 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-heading font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-input border border-border/40 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-heading font-bold text-sm uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all animate-pulse-glow"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground font-body">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-semibold"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
