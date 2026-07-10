export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground space-y-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p>Đang tải dữ liệu bài viết...</p>
    </div>
  );
}
