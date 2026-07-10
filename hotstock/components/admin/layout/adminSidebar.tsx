"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Menu,
  LogOut,
  ChevronLeft,
  FolderTree,
  Briefcase,
  Tags,
} from "lucide-react";

const NAV_GROUPS = [
  {
    title: "Tổng quan",
    items: [{ name: "Bảng điều khiển", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Nội dung",
    items: [
      { name: "Bài viết", href: "/admin/articles", icon: FileText },
      { name: "Danh mục", href: "/admin/categories", icon: FolderTree },
      { name: "Thẻ (Tags)", href: "/admin/tags", icon: Tags },
      { name: "Danh mục ĐT", href: "/admin/portfolio", icon: Briefcase },
    ],
  },
  {
    title: "Thành viên",
    items: [
      { name: "Người dùng", href: "/admin/users", icon: Users },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { name: "Gói cước", href: "/admin/plans", icon: CreditCard },
    ],
  },
];

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  userRole?: string;
}

export function AdminSidebar({ isSidebarOpen, onToggle, onLogout, userRole }: AdminSidebarProps) {
  const pathname = usePathname();

  const filteredGroups = NAV_GROUPS.map(group => {
    if (userRole === "editor") {
      return {
        ...group,
        items: group.items.filter(item => item.name === "Bài viết")
      };
    }
    return group;
  }).filter(group => group.items.length > 0);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 260 : 76 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-[#000000] border-r border-[#222] flex flex-col relative z-20 shrink-0 h-screen"
    >
      {/* Logo + Toggle */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#222]">
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-[#c084fc] flex items-center justify-center shadow-[0_0_10px_rgba(192, 132, 252, 0.5)]">
              <span className="text-black text-[14px] font-black tracking-tighter">H</span>
            </div>
            <span className="font-bold text-[15px] tracking-tight text-white uppercase">Hotstock</span>
          </motion.div>
        )}
        <button
          onClick={onToggle}
          className={`p-2 bg-[#111] border border-[#333] hover:border-[#c084fc] hover:text-[#c084fc] text-[#888] transition-colors ${
            !isSidebarOpen && "mx-auto"
          }`}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 scrollbar-hide px-3">
        <div className="space-y-8">
          {filteredGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {isSidebarOpen && (
                <h4 className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
                  {group.title}
                </h4>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (pathname?.startsWith(item.href) && item.href !== "/admin");
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-all duration-200 border border-transparent ${
                          isActive
                            ? "bg-[#111] text-[#c084fc] border-[#333] shadow-[inset_2px_0_0_#c084fc]"
                            : "text-[#888] hover:bg-[#111] hover:text-white hover:border-[#222]"
                        } ${!isSidebarOpen && "justify-center px-0 py-2.5 mx-auto w-10 h-10"}`}
                        title={!isSidebarOpen ? item.name : undefined}
                      >
                        <item.icon
                          size={18}
                          strokeWidth={isActive ? 2.5 : 1.5}
                          className={`shrink-0 transition-all ${
                            isActive ? "text-[#c084fc] drop-shadow-[0_0_5px_rgba(192, 132, 252, 0.5)]" : "text-[#888] group-hover:text-white"
                          }`}
                        />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#222] bg-[#000000]">
        <div
          className={`flex items-center gap-2 ${
            isSidebarOpen ? "justify-between" : "flex-col justify-center"
          }`}
        >
          <button
            onClick={onLogout}
            className={`group flex items-center gap-3 text-[13px] font-medium text-[#888] hover:text-[#ff0033] hover:bg-[#111] border border-transparent hover:border-[#ff0033]/30 transition-all p-2.5 w-full ${
              !isSidebarOpen && "justify-center w-10 h-10 mx-auto px-0"
            }`}
            title={!isSidebarOpen ? "Đăng xuất" : undefined}
          >
            <LogOut size={18} className="shrink-0 transition-colors group-hover:text-[#ff0033]" />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

