"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AdminPlan, AdminPlanTheme } from "@/hooks/admin/useAdminPlans";
import {
  type PlanFormState,
} from "../_lib/planFormHelpers";

interface PlanFormDialogProps {
  isOpen: boolean;
  editingPlan: AdminPlan | null;
  form: PlanFormState;
  isSubmitting: boolean;
  onFormChange: (updates: Partial<PlanFormState>) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function PlanFormDialog({
  isOpen,
  editingPlan,
  form,
  isSubmitting,
  onFormChange,
  onSubmit,
  onClose,
}: PlanFormDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto bg-[#000000] border-2 border-[#222] rounded-none shadow-[8px_8px_0_#222] p-6">
        <DialogHeader className="border-b-2 border-[#222] pb-4 mb-4">
          <DialogTitle className="text-[#ffffff] text-[20px] font-black uppercase tracking-widest">{editingPlan ? "Chỉnh sửa gói cước" : "Tạo gói cước mới"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-2 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Left column: Basic info + Pricing */}
          <div className="space-y-6">
            <Card className="bg-[#0A0A0A] border-2 border-[#222] shadow-[4px_4px_0_#222] rounded-none">
              <CardHeader className="border-b border-[#222] pb-4">
                <CardTitle className="text-[14px] text-[#ffffff] font-black uppercase tracking-widest">1. Thông tin cơ bản</CardTitle>
                <CardDescription className="text-[#888] font-medium text-[12px] mt-1">
                  Đây là phần admin nhập để hiển thị cho người dùng ở trang membership và bảng giá.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên gói</Label>
                  <Input
                    id="name"
                    placeholder="Ví dụ: Premium Gold"
                    value={form.name}
                    onChange={(e) => onFormChange({ name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="premium-gold"
                    value={form.slug}
                    disabled={Boolean(editingPlan)}
                    onChange={(e) =>
                      onFormChange({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Mô tả ngắn</Label>
                  <Input
                    id="tagline"
                    placeholder="Dành cho nhà đầu tư cần dữ liệu đầy đủ"
                    value={form.tagline}
                    onChange={(e) => onFormChange({ tagline: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Tên icon</Label>
                  <Input
                    id="icon"
                    placeholder="shield, crown, gem..."
                    value={form.icon}
                    onChange={(e) => onFormChange({ icon: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme màu</Label>
                  <Select
                    value={form.theme}
                    onValueChange={(value: AdminPlanTheme) => onFormChange({ theme: value })}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Chọn theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level plan</Label>
                  <Input
                    id="level"
                    type="number"
                    value={form.level}
                    disabled={Boolean(editingPlan)}
                    onChange={(e) => onFormChange({ level: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badge">Badge nổi bật</Label>
                  <Input
                    id="badge"
                    placeholder="Phổ biến nhất"
                    value={form.badge}
                    onChange={(e) => onFormChange({ badge: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ctaLabel">Nội dung nút CTA</Label>
                  <Input
                    id="ctaLabel"
                    placeholder="Chọn gói Premium"
                    value={form.ctaLabel}
                    onChange={(e) => onFormChange({ ctaLabel: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Mô tả chi tiết</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Mô tả rõ giá trị của plan cho người dùng"
                    value={form.description}
                    onChange={(e) => onFormChange({ description: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="features">Tính năng</Label>
                  <Textarea
                    id="features"
                    rows={6}
                    placeholder={"Mỗi dòng là một tính năng\nVí dụ:\nXem toàn bộ danh mục Premium\nNhận lý do hỗ trợ từng mã"}
                    value={form.featuresText}
                    onChange={(e) => onFormChange({ featuresText: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0A0A0A] border-2 border-[#222] shadow-[4px_4px_0_#222] rounded-none">
              <CardHeader className="border-b border-[#222] pb-4">
                <CardTitle className="text-[14px] text-[#ffffff] font-black uppercase tracking-widest">2. Giá bán & trạng thái</CardTitle>
                <CardDescription className="text-[#888] font-medium text-[12px] mt-1">
                  Quản lý giá, ưu đãi và mức độ hiển thị của plan trên giao diện người dùng.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyPrice">Giá tháng</Label>
                  <Input
                    id="monthlyPrice"
                    type="number"
                    placeholder="8000000"
                    value={form.monthlyPrice}
                    onChange={(e) => onFormChange({ monthlyPrice: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semiAnnualPrice">Giá 6 tháng</Label>
                  <Input
                    id="semiAnnualPrice"
                    type="number"
                    placeholder="31680000"
                    value={form.semiAnnualPrice}
                    onChange={(e) => onFormChange({ semiAnnualPrice: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Giá gốc</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    placeholder="48000000"
                    value={form.originalPrice}
                    onChange={(e) => onFormChange({ originalPrice: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercent">Giảm giá (%)</Label>
                  <Input
                    id="discountPercent"
                    type="number"
                    placeholder="34"
                    value={form.discountPercent}
                    onChange={(e) => onFormChange({ discountPercent: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => onFormChange({ sortOrder: e.target.value })}
                  />
                </div>

                <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
                  {(
                    [
                      { id: "isPopular", label: "Phổ biến", key: "isPopular" },
                      { id: "highlighted", label: "Nhấn mạnh", key: "highlighted" },
                      { id: "isActive", label: "Đang hoạt động", key: "isActive" },
                    ] as const
                  ).map(({ id, label, key }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between rounded-none border-2 border-[#222] bg-[#111] shadow-[2px_2px_0_#222] p-3"
                    >
                      <Label htmlFor={id} className="text-[#ffffff] font-bold uppercase tracking-widest text-[10px]">
                        {label}
                      </Label>
                      <Switch
                        id={id}
                        checked={form[key]}
                        onCheckedChange={(checked) => onFormChange({ [key]: checked })}
                        className="data-[state=checked]:bg-[#c084fc] rounded-none border-2 border-[#222]"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Notes */}
          <div className="space-y-6">
            <Card className="bg-[#0A0A0A] border-2 border-[#222] shadow-[4px_4px_0_#222] rounded-none">
              <CardHeader className="border-b border-[#222] pb-4">
                <CardTitle className="text-[14px] text-[#ffffff] font-black uppercase tracking-widest">3. Gợi ý trường dữ liệu nên lưu thêm</CardTitle>
                <CardDescription className="text-[#888] font-medium text-[12px] mt-1">
                  Những trường này giúp admin nhập dễ hơn và frontend hiển thị linh hoạt hơn.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-[12px] font-medium text-[#888] pt-4">
                <p>• icon: để map ra icon riêng theo plan.</p>
                <p>• theme: đồng bộ màu card / badge / CTA.</p>
                <p>• badge: nhãn như &quot;Phổ biến nhất&quot;, &quot;Khuyên dùng&quot;.</p>
                <p>• highlighted: để nhấn mạnh plan trên landing page.</p>
                <p>• ctaLabel: nội dung nút CTA riêng cho từng gói.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t-2 border-[#222] pt-6">
          <Button variant="outline" onClick={onClose} className="rounded-none border-2 border-[#222] bg-[#111] text-[#fff] hover:bg-[#222] font-black uppercase tracking-widest text-[12px] h-10 transition-colors shadow-[4px_4px_0_#222] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
            Hủy
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting} className="rounded-none border-2 border-[#222] bg-[#c084fc] hover:bg-[#a855f7] text-black font-black uppercase tracking-widest text-[12px] h-10 transition-colors shadow-[4px_4px_0_#222] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
            {editingPlan ? "Lưu thay đổi" : "Tạo gói cước"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
