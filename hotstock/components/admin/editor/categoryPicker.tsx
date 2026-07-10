"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";

interface CategoryPickerProps {
  value?: number;
  onChange: (id: number) => void;
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const { data: categories } = useAdminCategories();

  return (
    <Select value={value ? value.toString() : undefined} onValueChange={(val) => onChange(parseInt(val))}>
      <SelectTrigger>
        <SelectValue placeholder="Chọn danh mục" />
      </SelectTrigger>
      <SelectContent>
        {categories?.map((c) => (
          <SelectItem key={c.id} value={c.id.toString()}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
