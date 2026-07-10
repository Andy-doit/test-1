import { UserBackground } from "@/components/user/userBackground";

export function ProfileLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <UserBackground />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    </div>
  );
}

