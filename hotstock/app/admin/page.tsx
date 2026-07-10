"use client";

import { useDashboardStats } from "@/hooks/admin/useDashboardStats";
import { FileText, Users, FolderTree, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminPageHeader } from "@/components/admin/shared/adminPageHeader";
import { AdminErrorState } from "@/components/admin/shared/adminErrorState";
import { AdminLoadingState } from "@/components/admin/shared/adminLoadingState";
import { StatusBadge, isArticlePublished } from "@/components/admin/shared/statusBadge";

const OVERVIEW_CARDS = (stats: ReturnType<typeof useDashboardStats>["data"]) => [
  {
    title: "Tổng Bài viết",
    value: stats?.overview.totalArticles || 0,
    desc: `${stats?.overview.publishedArticles || 0} đã xuất bản`,
    icon: FileText,
  },
  {
    title: "Tổng Thành viên",
    value: stats?.overview.totalUsers || 0,
    desc: "Số lượng user hiện tại",
    icon: Users,
  },
  {
    title: "Danh mục Đầu tư",
    value: stats?.overview.totalPortfolios || 0,
    desc: "Portfolio & Khuyến nghị",
    icon: Briefcase,
  },
  {
    title: "Chuyên mục",
    value: stats?.overview.totalCategories || 0,
    desc: "Phân loại bài viết",
    icon: FolderTree,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) return <AdminLoadingState message="Đang tải dữ liệu tổng quan..." />;
  if (error || !stats) return <AdminErrorState message="Đã có lỗi xảy ra khi tải dữ liệu." />;

  const cards = OVERVIEW_CARDS(stats);

  return (
    <div className="space-y-8 pb-12">
      <AdminPageHeader title="Bảng điều khiển" description="Tổng quan thông tin hệ thống Hotstock." />

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="group relative bg-[#000000] border border-[#222] p-6 hover:border-[#c084fc] transition-all duration-300 shadow-[4px_4px_0_#222] hover:shadow-[4px_4px_0_#c084fc] hover:-translate-y-1 hover:-translate-x-1"
          >
            <div className="flex justify-between items-start mb-8">
              <p className="text-[12px] font-bold tracking-widest text-[#888] uppercase">{card.title}</p>
              <div className="w-8 h-8 flex items-center justify-center bg-[#111] border border-[#333] group-hover:bg-[#c084fc] group-hover:border-[#c084fc] transition-colors">
                <card.icon className="w-4 h-4 text-[#888] group-hover:text-black transition-colors" />
              </div>
            </div>
            <div>
              <p className="text-5xl font-black tracking-tighter text-white mb-2">{card.value}</p>
              <p className="text-[12px] text-[#666] font-medium">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-[#000000] border border-[#222] shadow-[4px_4px_0_#222] flex flex-col"
        >
          <div className="p-5 border-b border-[#222]">
            <h3 className="text-[14px] font-bold uppercase tracking-widest text-white">Bài viết theo danh mục</h3>
          </div>
          <div className="p-5 h-[320px]">
            {stats.articlesByCategory?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.articlesByCategory}
                  margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                  <XAxis
                    dataKey="name"
                    stroke="#666"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "#111" }}
                    contentStyle={{
                      backgroundColor: "#000000",
                      borderColor: "#c084fc",
                      borderRadius: "0px",
                      fontSize: "12px",
                      color: "#ededed",
                      boxShadow: "2px 2px 0 #c084fc"
                    }}
                    itemStyle={{ color: "#c084fc", fontWeight: "bold" }}
                  />
                  <Bar dataKey="count" fill="#ffffff" radius={[0, 0, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#888] text-sm">
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#000000] border border-[#222] shadow-[4px_4px_0_#222] flex flex-col"
        >
          <div className="p-5 border-b border-[#222]">
            <h3 className="text-[14px] font-bold uppercase tracking-widest text-white">Thành viên mới</h3>
          </div>
          <div className="p-5 flex-1">
            <div className="space-y-6">
              {stats.recentUsers?.map((user) => (
                <div key={user.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#111] border border-[#333] group-hover:border-[#c084fc] flex items-center justify-center text-[12px] font-black text-white transition-colors shadow-[2px_2px_0_#222] group-hover:shadow-[2px_2px_0_#c084fc]">
                      {user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-white group-hover:text-[#c084fc] transition-colors">{user.username}</p>
                      <p className="text-[12px] text-[#666]">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold border border-[#333] bg-[#111] text-[#888] px-2 py-1 uppercase tracking-wider">
                    {user.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Articles */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#000000] border border-[#222] shadow-[4px_4px_0_#222]"
      >
        <div className="flex flex-row items-center justify-between p-5 border-b border-[#222]">
          <h3 className="text-[14px] font-bold uppercase tracking-widest text-white">Bài viết gần đây</h3>
          <Link
            href="/admin/articles"
            className="text-[12px] font-bold uppercase text-[#888] hover:text-[#c084fc] transition-colors border-b border-transparent hover:border-[#c084fc]"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#050505] text-[#888] border-b border-[#222] text-[11px] uppercase tracking-widest">
              <tr>
                <th className="px-5 py-4 font-bold">Tiêu đề</th>
                <th className="px-5 py-4 font-bold">Danh mục</th>
                <th className="px-5 py-4 font-bold">Trạng thái</th>
                <th className="px-5 py-4 font-bold text-right">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {stats.recentArticles?.map((article) => (
                <tr key={article.id} className="hover:bg-[#0A0A0A] transition-colors hover:shadow-[inset_2px_0_0_#c084fc]">
                  <td className="px-5 py-4 font-medium text-white truncate max-w-[300px]">
                    <Link href={`/admin/articles/${article.slug}`} className="hover:text-[#c084fc] transition-colors">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[11px] bg-[#111] border border-[#333] text-[#888] px-2 py-1 font-medium">
                      {article.category?.name || "Chưa phân loại"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge isPublished={isArticlePublished(article.publishedAt)} />
                  </td>
                  <td className="px-5 py-4 text-right text-[#666] text-[12px] font-medium">
                    {format(new Date(article.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </td>
                </tr>
              ))}
              {(!stats.recentArticles || stats.recentArticles.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-[#666] text-sm">
                    Không có bài viết nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

