"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  ExternalLink 
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      key: "dashboard",
      label: "Overview",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      key: "applications",
      label: "All Applications",
      href: "/admin/applications",
      icon: Users,
    },
    {
      key: "documents",
      label: "Documents",
      href: "/admin/documents",
      icon: FileText,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="mb-8 px-3 py-2">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Migration Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">Admin Control Panel</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-y-0 left-0 w-1 bg-white rounded-r" />
                )}
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4 mt-6">
        <a
          href="https://www.uscis.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <span>USCIS Resources</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </aside>
  );
}

// ডিফল্ট এক্সপোর্ট হিসেবেও যুক্ত করা হলো, যাতে কোনো ফাইল থেকে ডিফল্ট ইম্পোর্ট করলেও সমস্যা না হয়
export default AdminSidebar;
