export type ImpactLevel = "Thấp" | "Trung bình" | "Cao";

export interface EconomicEventItem {
  time: string;
  country: string;
  countryFlag: string;
  title: string;
  sectors: string[];
  summary: string;
  impact: ImpactLevel;
  actual?: string;
  previous?: string;
}

export interface EconomicEvent {
  id: string;
  date: string;
  displayDate: string;
  isToday?: boolean;
  events: EconomicEventItem[];
}

// News Item Interfaces
// Filter Options
export interface FilterOption {
  value: string;
  label: string;
}

export type ArticleCategorySlug = string;

export interface ArticlePlan {
  id: number;
  documentId: string;
  name: string;
  level: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ArticleTag {
  id: number;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ArticleCategory {
  id: number;
  documentId: string;
  name: string;
  slug: ArticleCategorySlug;
  description: string;
  isVisibleOnUI?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ArticleAuthor {
  id: number;
  documentId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Block Types
export interface SharedMediaBlock {
  __component: "shared.media";
  id: number;
}

export interface SharedRichTextBlock {
  __component: "shared.rich-text";
  id: number;
  body: string;
}

export interface SharedSliderBlock {
  __component: "shared.slider";
  id: number;
}

export interface SharedQuoteBlock {
  __component: "shared.quote";
  id: number;
  title?: string;
  body?: string;
}

export interface EditorTextBlock {
  id: string | number;
  type: "text";
  content: string;
}

export type ArticleBlock =
  | SharedMediaBlock
  | SharedRichTextBlock
  | SharedSliderBlock
  | SharedQuoteBlock
  | EditorTextBlock;

export interface ApiCategory {
  id: number;
  name: string;
  slug: ArticleCategorySlug;
}

export interface ApiTag {
  id: number;
  name: string;
  slug: string;
}

export interface ApiAuthor {
  id: number;
  name?: string;
  username?: string;
  avatarUrl?: string | null;
}

export interface ApiArticleListItem {
  id: number;
  title: string;
  description: string;
  slug: string;
  publishedAt: string | null;
  coverUrl: string | null;
  category: ApiCategory;
  tag?: ApiTag | null;
  tags?: ApiTag[];
  author: ApiAuthor | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPlanRelation {
  planId: number;
  plan: {
    slug: string;
    level: number;
  };
}

export interface ApiArticleDetail extends ApiArticleListItem {
  contentBlocks?:
    | ArticleBlock[]
    | {
        blocks?: ArticleBlock[];
        data?: ArticleBlock[];
        items?: ArticleBlock[];
      }
    | null;
  blocks?: ArticleBlock[] | null;
  plans?: ApiPlanRelation[];
}

export interface PaginatedArticlesResponse {
  data: ApiArticleListItem[];
  nextCursor: number | null;
  hasNextPage: boolean;
}

export interface ArticleDetailApiResponse {
  data: ApiArticleDetail;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  plans: ArticlePlan[];
  category: ArticleCategory | null;
  tag: ArticleTag | null;
  cover: { url: string } | null;
  coverUrl: string;
}

export interface ArticleDetail extends Article {
  blocks: ArticleBlock[];
  author: ArticleAuthor | null;
}

export const ARTICLE_CATEGORY_ROUTE_SEGMENTS: Record<string, string> = {
  business: "business",
  economic: "economic",
  "report-analysis": "reportAnalysis",
  "daily-market": "dailyMarket",
  "chien-luoc": "chienLuoc",
};

export const ARTICLE_CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  business: "Tin tức doanh nghiệp",
  economic: "Tin tức kinh tế",
  "report-analysis": "Phân tích báo cáo",
  "daily-market": "Nhận định thị trường hằng ngày",
  "chien-luoc": "Chiến lược",
};

export const getArticleCategoryDisplayName = (
  slug?: ArticleCategorySlug | null,
  fallback?: string | null,
) => {
  if (!slug) {
    return fallback ?? "";
  }

  return ARTICLE_CATEGORY_DISPLAY_NAMES[slug] ?? fallback ?? "";
};

