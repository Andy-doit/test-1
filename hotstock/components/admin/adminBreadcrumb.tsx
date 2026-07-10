"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

const routeNames: Record<string, string> = {
  admin: "Quản trị",
  articles: "Bài viết",
  create: "Thêm mới",
  users: "Người dùng",
  categories: "Danh mục",
  portfolio: "Danh mục đầu tư",
  portfolios: "Danh mục đầu tư",
  roles: "Phân quyền",
  plans: "Gói cước",
  queues: "Hàng đợi",
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;
          const name = routeNames[path] || path;

          return (
            <Fragment key={path}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-primary capitalize">
                    {name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="capitalize">
                      {name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
