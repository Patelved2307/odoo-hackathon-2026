import { useState } from "react";
import { useAuth, type Role, ROLE_LIST } from "@/context/AuthContext";
import { useNavigate, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import logoIcon from "@/assets/logo-icon.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side gate before we even attempt to log in — an empty or
    // obviously malformed email/password no longer reaches `login()`.
    if (!email.trim()) { setError("Enter your work email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter a valid email address, e.g. name@company.com."); return; }
    if (!password) { setError("Enter your password."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    setTimeout(() => {
      const result = login(email, password, role);
      setLoading(false);
      if (!result.ok) { setError(result.error); return; }
      navigate({ to: "/dashboard" });
    }, 500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0F172A] via-[#1e293b] to-[#2563EB] text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
            <img src={logoIcon} alt="AssetFlow AI" className="h-7 w-7" />
          </div>
          <div>
            <p className="font-semibold">AssetFlow AI</p>
            <p className="text-xs text-white/60">Enterprise Asset Intelligence</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">Every asset. Every allocation. Fully in view.</h1>
          <p className="mt-4 text-white/70 text-[15px] leading-relaxed">
            AI-powered lifecycle management for organizations that treat operations as a competitive advantage.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: Sparkles, text: "Predictive maintenance & idle asset detection" },
              { icon: ShieldCheck, text: "Role-based access with full audit trails" },
              { icon: Zap, text: "Natural-language search across your inventory" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-white/85">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center"><Icon className="h-4 w-4" /></div>
                {text}
              </div>
            ))}
          </div>
        </motion.div>
        <p className="relative z-10 text-xs text-white/50">© 2026 AssetFlow AI · SOC 2 · ISO 27001</p>
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-[#7C3AED]/30 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.form
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          onSubmit={submit} className="w-full max-w-sm"
        >
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="h-9 w-9 flex items-center justify-center">
              <img src={logoIcon} alt="AssetFlow AI" className="h-9 w-9" />
            </div>
            <p className="font-semibold text-[#0F172A]">AssetFlow AI</p>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#0F172A]">Welcome back</h2>
          <p className="mt-1 text-sm text-[#64748B]">Sign in to your workspace</p>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#0F172A]">Work email</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="name@company.com" required className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#0F172A]">Password</Label>
              <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="At least 8 characters" required minLength={8} className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#0F172A]">Sign in as (demo)</Label>
              <select value={role} onChange={e => setRole(e.target.value as Role)} className="h-11 w-full rounded-md border border-[#E2E8F0] bg-white px-3 text-sm">
                {ROLE_LIST.map(r => <option key={r}>{r}</option>)}
              </select>
              <p className="text-[11px] text-[#94A3B8]">This is the role you'll be signed in with for this session — it can only be changed by signing out and back in.</p>
            </div>
            {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full h-11 bg-[#2563EB] hover:bg-[#1d4fd8] text-white font-medium">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <p className="text-[11px] text-[#94A3B8] text-center">Demo environment · Data resets on refresh</p>
            <p className="text-xs text-[#64748B] text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#2563EB] hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}