"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Shield, Crown, Sparkles, Leaf, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { getPlanName, getPlanColor } from "@/components/user/header/planBadge";
import type { User } from "@/types/iAccount";
import { formatUserDate, getInitials } from "@/lib/utils/auth";

const ChangePasswordDialog = dynamic(
  () => import("@/components/profile/changePasswordDialog").then((mod) => mod.ChangePasswordDialog),
  { ssr: false }
);

const getPlanIcon = (planName: string, className: string) => {
  switch (planName.toLowerCase()) {
    case "bronze":
      return <Shield className={className} />;
    case "titan":
      return <Shield className={className} />;
    case "gold":
      return <Crown className={className} />;
    case "premium":
      return <Sparkles className={className} />;
    default:
      return <Leaf className={className} />;
  }
};

const calculateMembershipDays = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

interface ProfileContentProps {
  initialUser: User;
}

export function ProfileContent({ initialUser }: ProfileContentProps) {
  const router = useRouter();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [user] = useState(initialUser);

  const handleUpdateSuccess = async () => {
    router.refresh();
  };

  const planName = getPlanName(user.plan);
  const planColorClass = getPlanColor(planName);
  const planIcon = getPlanIcon(planName, "h-5 w-5 text-primary");
  const membershipDays = calculateMembershipDays(user.createdAt);

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-2xl overflow-hidden bg-card/95 backdrop-blur-xl">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-orange-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-orange-400/20" />
            </div>

            <div className="px-6 pb-6 pt-20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                <div className="relative -mt-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-xl" />
                  <Avatar className="relative h-28 w-28 border-4 border-background shadow-2xl">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-3xl font-bold">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{user.username}</h2>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <Badge variant="outline" className={`${planColorClass} border-2`}>
                        {planName.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Đổi mật khẩu
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <Card className="border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Thành viên</p>
                    <p className="text-2xl font-bold text-foreground">{membershipDays}</p>
                    <p className="text-xs text-muted-foreground mt-1">ngày</p>
                  </CardContent>
                </Card>

                <Card className="border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Ngày tham gia</p>
                    <p className="text-lg font-bold text-foreground">{formatUserDate(user.createdAt)}</p>
                  </CardContent>
                </Card>

                <Card className="border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Gói thành viên</p>
                    <Badge variant="outline" className={`mt-1 ${planColorClass}`}>
                      {planName.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="username" className="text-sm font-semibold mb-3 block">
                    Tên đăng nhập
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        id="username"
                        value={user.username}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold mb-3 block">
                    Email
                  </Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        readOnly
                        className="bg-muted/50 pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="plan" className="text-sm font-semibold mb-3 block">
                    Gói thành viên
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-3">
                      {planIcon}
                    </div>
                    <Badge variant="outline" className={`text-base px-4 py-2 ${planColorClass}`}>
                      {planName.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ChangePasswordDialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
}
