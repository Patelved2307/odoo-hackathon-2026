import { Link } from "@tanstack/react-router";
import logoIcon from "@/assets/logo-icon.png";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src={logoIcon} alt="AssetFlow AI" className="h-8 w-8" />
            <span className="font-semibold">AssetFlow <span className="gradient-text">AI</span></span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Enterprise asset & resource management for organizations that have outgrown spreadsheets, paper registers, and WhatsApp handoffs.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
            <li><Link to="/ai" className="hover:text-foreground">AI Copilot</Link></li>
            <li><Link to="/demo" className="hover:text-foreground">Request Demo</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><a href="#" className="hover:text-foreground">Security</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AssetFlow AI. All rights reserved.
      </div>
    </footer>
  );
}
