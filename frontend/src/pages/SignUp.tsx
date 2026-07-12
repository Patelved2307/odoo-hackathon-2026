import { useState } from "react";
import { useAuth, type Role } from "@/context/AuthContext";
import { useNavigate, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import logoIcon from "@/assets/logo-icon.png";

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [organization, setOrganization] = useState("");
  // Self-service signup can only ever create non-privileged accounts.
  // Admin and Auditor are elevated roles and can only be granted by an
  // existing Admin from Organization → Employees — never at signup.
  const SELF_SERVICE_ROLES: Role[] = ["Employee", "Asset Manager", "Department Head", "Technician"];
  const [role, setRole] = useState<Role>("Employee");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@")) newErrors.email = "Valid email is required";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!organization.trim()) newErrors.organization = "Organization is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password, role);
      if (!result.ok) {
        setErrors(prev => ({ ...prev, email: result.error }));
        setLoading(false);
        return;
      }
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
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">Start managing assets smarter today.</h1>
          <p className="mt-4 text-white/70 text-[15px] leading-relaxed">
            Join organizations that are replacing spreadsheets and WhatsApp with AI-powered asset management.
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
          <h2 className="text-2xl font-semibold tracking-tight text-[#0F172A]">Create your account</h2>
          <p className="mt-1 text-sm text-[#64748B]">Start your free trial today</p>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#0F172A]">Full name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" className="h-11" />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#0F172A]">Work email</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="jane@company.com" className="h-11" />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#0F172A]">Organization</Label>
              <Input value={organization} onChange={e => setOrganization(e.target.value)} placeholder="Your company name" className="h-11" />
              {errors.organization && <p className="text-xs text-red-600">{errors.organization}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#0F172A]">Select role</Label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as Role)}
                className="flex h-11 w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] outline-none ring-offset-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              >
                {SELF_SERVICE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <p className="text-[11px] text-[#94A3B8]">
                Admin and Auditor accounts are granted by your organization's Admin from Organization → Employees, not at signup.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#0F172A]">Password</Label>
              <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" className="h-11" />
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#0F172A]">Confirm password</Label>
              <Input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" className="h-11" />
              {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="agree" className="rounded border-[#E2E8F0]" required />
              <label htmlFor="agree" className="text-xs text-[#64748B]">I agree to the Terms of Service and Privacy Policy</label>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-[#2563EB] hover:bg-[#1d4fd8] text-white font-medium">
              {loading ? "Creating account…" : "Create account"}
            </Button>
            <p className="text-[11px] text-[#94A3B8] text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-[#2563EB] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}