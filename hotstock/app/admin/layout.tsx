"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/stores/adminStore";
import { useAuthServer } from "@/hooks/useAuthServer";
import { AdminSidebar } from "@/components/admin/layout/adminSidebar";
import { AdminHeader } from "@/components/admin/layout/adminHeader";

function AdminLoadingSkeleton() {
  return (
    <div className="flex h-screen bg-[#050505] text-[#ededed] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Đang xác thực quyền truy cập...</p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, toggleSidebar } = useAdminStore();
  const { user, logout, isLoading, checkProfile, isAuthenticated } = useAuthServer();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);
  const isVerified = hasChecked && isAuthenticated && user?.role === "admin";

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await checkProfile();
      if (isMounted) {
        setHasChecked(true);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [checkProfile]);

  useEffect(() => {
    // Wait until auth loading is complete before checking role
    if (isLoading) return;

    // Wait until we have verified or if we are not authenticated
    if (!hasChecked && !isAuthenticated) return;

    if (!isAuthenticated || !user) {
      // Not logged in — redirect to login
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      // Logged in but not admin — redirect to home
      router.replace("/");
      return;
    }

    // User is admin — allow render
  }, [user, isLoading, hasChecked, isAuthenticated, router]);

  // Show loading skeleton while verifying auth
  if (isLoading || !isVerified) {
    return <AdminLoadingSkeleton />;
  }

  return (
    <div className="dark admin-theme flex h-screen bg-[#050505] text-[#ededed] overflow-hidden selection:bg-blue-500/30">
      <AdminSidebar
        isSidebarOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onLogout={logout}
        userRole={user?.role}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#000000] relative">
        <AdminHeader username={user?.username} role={user?.role} />

        <div className="flex-1 overflow-y-auto p-6 relative z-0">
          <div className="mx-auto max-w-[1600px] w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
