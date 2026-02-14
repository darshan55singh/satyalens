import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { LogIn, LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import AuthModal from "./AuthModal";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin");
    setIsAdmin(!!data && data.length > 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold tracking-wider text-primary glow-text">
            SatyaLens
          </Link>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-semibold text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
              >
                <Shield className="w-3 h-3" />
                Admin
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-body hidden sm:block">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-heading font-semibold border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
                >
                  <LogOut className="w-3 h-3" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-heading font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-all"
              >
                <LogIn className="w-3 h-3" />
                Login
              </button>
            )}
          </div>
        </div>
      </header>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default Header;
