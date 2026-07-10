"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ArticleFiltersProps {
  filterStatus: string;
  filterCategory: string;
  filterAuthor: string;
  categories: string[];
  authors: string[];
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
}

export function ArticleFilters({
  filterStatus,
  filterCategory,
  filterAuthor,
  categories,
  authors,
  onStatusChange,
  onCategoryChange,
  onAuthorChange,
}: ArticleFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Select value={filterStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="published">Đã xuất bản</SelectItem>
          <SelectItem value="draft">Bản nháp</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Chuyên mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả chuyên mục</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filterAuthor} onValueChange={onAuthorChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Tác giả" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả tác giả</SelectItem>
          {authors.map((author) => (
            <SelectItem key={author} value={author}>
              {author}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
