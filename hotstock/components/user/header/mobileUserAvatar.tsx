"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlanBadge } from "./planBadge";

interface MobileUserAvatarProps {
  user: {
    username?: string;
    email?: string;
    avatarUrl?: string;
    plan?: { name?: string; slug?: string } | null;
  };
}

export function MobileUserAvatar({ user }: MobileUserAvatarProps) {
  const avatarFallback = useMemo(() => {
    return user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  }, [user.username, user.email]);

  return (
    <div className="w-full px-4 py-2 flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatarUrl} alt={user.username} />
        <AvatarFallback>
          {avatarFallback}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{user.username || user.email}</p>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
      </div>
      <PlanBadge plan={user.plan ?? null} />
    </div>
  );
}

