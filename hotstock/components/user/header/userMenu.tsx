"use client";

import { useMemo } from "react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
  user: {
    username: string;
    email: string;
    avatarUrl?: string;
    plan?: { name?: string; slug?: string } | null;
  };
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  // Memoize avatar fallback để tránh tính toán lại
  const avatarFallback = useMemo(() => {
    return user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  }, [user.username, user.email]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            {user.username && (
              <p className="text-sm font-medium leading-none">{user.username}</p>
            )}
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            Hồ sơ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

