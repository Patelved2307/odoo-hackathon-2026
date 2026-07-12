import { AppLayout, PageHeader, PermissionGate } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORY_LIST, DEPT_LIST, LOCATION_LIST } from "@/data/mock";
import { toast } from "sonner";
import { Check, Package, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const schema = z.object({
  name: z.string().min(2, "Enter a name"),
  category: z.string().min(1, "Select a category"),
  serial: z.string().min(3, "Serial required"),
  vendor: z.string().min(1),
  value: z.coerce.number().min(0),
  department: z.string().min(1),
  location: z.string().min(1),
  purchaseDate: z.string().min(1),
  warrantyUntil: z.string().min(1),
  notes: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function AssetRegister() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", category: "Laptop", serial: "", vendor: "Apple", value: 0, department: "Engineering", location: LOCATION_LIST[0], purchaseDate: "", warrantyUntil: "", notes: "" },
  });

  const onSubmit = async (v: FormValues) => {
    await new Promise(r => setTimeout(r, 700));
    setSubmitted(true);
    toast.success("Asset registered", { description: `${v.name} added to the directory.` });
    setTimeout(() => navigate({ to: "/assets" }), 900);
  };

  return (
    <AppLayout>
      <PermissionGate perm="assets.register">
        <PageHeader title="Register Asset" description="Add a new asset to your organization inventory." />
        <div className="grid lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 card-surface p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Asset name" error={errors.name?.message}><Input {...register("name")} placeholder="e.g. MacBook Pro 16 M4" /></Field>
              <Field label="Category" error={errors.category?.message}>
                <select {...register("category")} className="h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 text-sm">{CATEGORY_LIST.map(c => <option key={c}>{c}</option>)}</select>
              </Field>
              <Field label="Serial number" error={errors.serial?.message}><Input {...register("serial")} placeholder="SN-XXXXXXX" /></Field>
              <Field label="Vendor" error={errors.vendor?.message}><Input {...register("vendor")} /></Field>
              <Field label="Purchase value (USD)" error={errors.value?.message}><Input type="number" {...register("value")} /></Field>
              <Field label="Department" error={errors.department?.message}>
                <select {...register("department")} className="h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 text-sm">{DEPT_LIST.map(c => <option key={c}>{c}</option>)}</select>
              </Field>
              <Field label="Location" error={errors.location?.message}>
                <select {...register("location")} className="h-10 w-full rounded-md border border-[#E2E8F0] bg-white px-3 text-sm">{LOCATION_LIST.map(c => <option key={c}>{c}</option>)}</select>
              </Field>
              <Field label="Purchase date" error={errors.purchaseDate?.message}><Input type="date" {...register("purchaseDate")} /></Field>
              <Field label="Warranty until" error={errors.warrantyUntil?.message}><Input type="date" {...register("warrantyUntil")} /></Field>
            </div>
            <Field label="Notes"><Textarea {...register("notes")} placeholder="Optional context, condition, accessories…" rows={3} /></Field>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
              <Button type="button" variant="outline" onClick={() => navigate({ to: "/assets" })}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#2563EB] hover:bg-[#1d4fd8]">
                {isSubmitting ? "Saving…" : submitted ? <><Check className="h-4 w-4 mr-1.5" />Registered</> : "Register asset"}
              </Button>
            </div>
          </form>

          <motion.aside initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="card-surface p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center"><Package className="h-4 w-4 text-[#2563EB]" /></div>
                <h3 className="text-sm font-semibold">Registration checklist</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-[#64748B]">
                {["Complete asset metadata", "Attach purchase invoice", "Assign asset tag", "Set warranty terms", "Notify department head"].map(t => (
                  <li key={t} className="flex items-start gap-2"><div className="mt-0.5 h-4 w-4 rounded-full border-2 border-[#E2E8F0]" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="card-surface p-5 bg-gradient-to-br from-violet-50 to-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-[#7C3AED]" />
                <h3 className="text-sm font-semibold">AI suggestion</h3>
              </div>
              <p className="text-xs text-[#64748B]">Similar assets are typically assigned to <span className="font-medium text-[#0F172A]">Engineering · Floor 5</span>. Warranty on this vendor averages 24 months.</p>
            </div>
          </motion.aside>
        </div>
      </PermissionGate>
    </AppLayout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-[#0F172A]">{label}</Label>
      {children}
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
