"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "🏠", exact: true },
  { href: "/admin/boygroups", label: "BoyGroup", icon: "👥" },
  { href: "/admin/idols", label: "Idol", icon: "🎤" },
  { href: "/admin/concerts", label: "Konser", icon: "🎫" },
  { href: "/admin/albums", label: "Album", icon: "💿" },
  { href: "/admin/fandom-gallery", label: "Fandom Gallery", icon: "✨" },
  { href: "/admin/comeback-schedule", label: "Jadwal Comeback", icon: "📅" },
  { href: "/admin/orders", label: "Pesanan", icon: "🧾" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full sm:w-60 shrink-0 bg-gray-950 border-r border-gray-900 sm:min-h-screen">
      <div className="p-4 border-b border-gray-900">
        <p className="text-[#39FF14] font-black text-lg tracking-wide">DAEBAKLOG</p>
        <p className="text-gray-500 text-xs">Admin Panel</p>
      </div>
      <nav className="p-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#39FF14] text-black font-bold"
                  : "text-gray-300 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 mt-2 border-t border-gray-900">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-gray-900">
          <span>←</span>
          <span>Kembali ke Situs</span>
        </Link>
      </div>
    </aside>
  );
}
