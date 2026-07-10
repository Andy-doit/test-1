"use client";

import { useEffect, useMemo } from "react";
import { marked } from "marked";
import { logger } from "@/lib/utils/logger";

interface QuillRendererProps {
  content: string;
  className?: string;
}

// Cấu hình renderer cho marked – tùy biến ảnh, link, bảng, v.v.
const baseRenderer = new marked.Renderer();
const renderer = new marked.Renderer();

const escapeHtmlAttribute = (value: string) =>
  value
    .replace(/&/g, "\u0026amp;")
    .replace(/"/g, "\u0026quot;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;");

const normalizeSafeUrl = (value: string) => {
  const normalized = value.trim();

  if (!normalized) return "";
  if (normalized.startsWith("//")) return `https:${normalized}`;

  try {
    const url = new URL(normalized, window.location.origin);
    if (["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) {
      return normalized;
    }
  } catch {
    return "";
  }

  return "";
};

const sanitizeHtml = (html: string) => {
  if (typeof window === "undefined") return "";

  const template = document.createElement("template");
  template.innerHTML = html;

  const allowedTags = new Set([
    "A",
    "B",
    "BLOCKQUOTE",
    "BR",
    "CODE",
    "DIV",
    "EM",
    "FIGCAPTION",
    "FIGURE",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HR",
    "I",
    "IMG",
    "LI",
    "OL",
    "P",
    "PRE",
    "SPAN",
    "STRONG",
    "TABLE",
    "TBODY",
    "TD",
    "TH",
    "THEAD",
    "TR",
    "UL",
  ]);

  const allowedAttributes: Record<string, Set<string>> = {
    A: new Set(["href", "title", "target", "rel", "class"]),
    IMG: new Set(["src", "alt", "title", "loading", "decoding", "fetchpriority", "class"]),
    FIGURE: new Set(["class"]),
    FIGCAPTION: new Set(["class"]),
    DIV: new Set(["class"]),
    CODE: new Set(["class"]),
    PRE: new Set(["class"]),
    SPAN: new Set(["class"]),
    TABLE: new Set(["class"]),
  };

  // `class` values are only trusted when they're classes this renderer itself
  // generates below (full-bleed-image, article-link, table-wrapper...). Content
  // pasted into the editor from other sites can carry arbitrary classes (e.g.
  // Tailwind "absolute", "top-0") that collide with this site's own CSS and pull
  // elements out of the normal document flow, so any other class token is dropped.
  const ALLOWED_CLASS_TOKENS = new Set([
    "full-bleed-image",
    "full-bleed-caption",
    "article-link",
    "table-wrapper",
    "article-content",
  ]);

  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        const tagName = element.tagName;

        if (!allowedTags.has(tagName)) {
          element.replaceWith(...Array.from(element.childNodes));
          return;
        }

        [...element.attributes].forEach((attribute) => {
          const name = attribute.name.toLowerCase();
          const allowed = allowedAttributes[tagName]?.has(name) ?? false;

          if (!allowed || name.startsWith("on")) {
            element.removeAttribute(attribute.name);
            return;
          }

          if (name === "class") {
            const filtered = attribute.value
              .split(/\s+/)
              .filter((token) => ALLOWED_CLASS_TOKENS.has(token))
              .join(" ");

            if (filtered) {
              element.setAttribute("class", filtered);
            } else {
              element.removeAttribute("class");
            }
            return;
          }

          if (["href", "src"].includes(name)) {
            const safeUrl = normalizeSafeUrl(attribute.value);
            if (!safeUrl) {
              element.removeAttribute(attribute.name);
            } else {
              element.setAttribute(attribute.name, safeUrl);
            }
          }
        });

        if (tagName === "A") {
          element.setAttribute("target", "_blank");
          element.setAttribute("rel", "noopener noreferrer");
        }

        walk(element);
      }
    });
  };

  walk(template.content);
  return template.innerHTML;
};

renderer.image = ({ href = "", title, text = "" }) => {
  const safeHref = escapeHtmlAttribute(normalizeSafeUrl(href));
  const safeTitle = title ? escapeHtmlAttribute(title) : "";
  const safeText = text ? escapeHtmlAttribute(text) : "";
  const titleAttr = safeTitle ? ` title="${safeTitle}"` : "";
  const altAttr = safeText ? ` alt="${safeText}"` : ' alt=""';
  const caption =
    safeText.trim().length > 0
      ? `<figcaption class="full-bleed-caption">${safeText}</figcaption>`
      : "";

  if (!safeHref) return "";

  return `
    <figure class="full-bleed-image">
      <img src="${safeHref}"${titleAttr}${altAttr} loading="lazy" decoding="async" fetchpriority="low" />
      ${caption}
    </figure>
  `;
};

renderer.link = ({ href = "", title, text = "" }) => {
  const safeHref = escapeHtmlAttribute(normalizeSafeUrl(href));
  const safeTitle = title ? escapeHtmlAttribute(title) : "";
  const titleAttr = safeTitle ? ` title="${safeTitle}"` : "";

  if (!safeHref) return text;

  return `<a href="${safeHref}"${titleAttr} target="_blank" rel="noopener noreferrer" class="article-link">${text}</a>`;
};

renderer.table = (token) => {
  const tableHtml = baseRenderer.table(token);

  return `
    <div class="table-wrapper">
      ${tableHtml}
    </div>
  `;
};

marked.setOptions({
  gfm: true,
  breaks: true,
  renderer,
});

const STYLE_ID = "quill-renderer-styles";

const GLOBAL_STYLES = `
  .quill-renderer-wrapper {
    overflow: visible;
  }

  .quill-renderer-wrapper .article-content {
    border: none;
    font-size: 1.05rem;
    line-height: 1.9;
    font-weight: 400;
    letter-spacing: 0.01em;
    color: inherit;
  }

  .quill-renderer-wrapper .article-content p {
    margin-block: 1.2em;
  }

  .quill-renderer-wrapper .article-content h1,
  .quill-renderer-wrapper .article-content h2,
  .quill-renderer-wrapper .article-content h3,
  .quill-renderer-wrapper .article-content h4 {
    font-weight: 800;
    margin-block: 1.4em 0.6em;
  }

  .quill-renderer-wrapper .article-content ul,
  .quill-renderer-wrapper .article-content ol {
    padding-left: 1.5em;
    margin-block: 1.2em;
  }

  .quill-renderer-wrapper .article-content blockquote {
    border-left: 4px solid rgba(107, 33, 168, 0.4);
    padding-left: 1.5rem;
    margin-block: 2rem;
    font-style: italic;
  }

  .dark .quill-renderer-wrapper .article-content blockquote {
    border-left-color: rgba(167, 139, 250, 0.6);
  }

  .quill-renderer-wrapper .article-content code {
    background-color: rgba(107, 33, 168, 0.08);
    padding: 0.1rem 0.4rem;
    border-radius: 0.35rem;
  }

  .dark .quill-renderer-wrapper .article-content code {
    background-color: rgba(167, 139, 250, 0.15);
  }

  .quill-renderer-wrapper .article-content pre {
    background-color: rgba(15, 23, 42, 0.9);
    color: rgb(243, 244, 246);
    padding: 1.5rem;
    border-radius: 1rem;
    overflow-x: auto;
    border: 1px solid rgba(148, 163, 184, 0.3);
  }

  .table-wrapper {
    margin: 2rem 0;
    border-radius: 1.5rem;
    border: 1px solid rgba(148, 163, 184, 0.3);
    overflow-x: auto;
  }

  .table-wrapper table {
    width: 100%;
    border-collapse: collapse;
  }

  .table-wrapper th,
  .table-wrapper td {
    border-bottom: 1px solid rgba(148, 163, 184, 0.3);
    padding: 0.85rem 1.25rem;
    text-align: left;
  }

  .article-link {
    color: #6b21a8;
    text-decoration: underline;
  }

  .article-link:hover {
    color: #581c87;
  }

  .dark .article-link {
    color: #a78bfa;
  }

  /* Ảnh full-width theo CONTENT (không tràn màn hình) */
  .full-bleed-image {
    width: 100%;
    margin: 1.75rem 0;
  }

  .full-bleed-image img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 1.25rem;
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.35);
  }

  .full-bleed-caption {
    font-size: 0.9rem;
    line-height: 1.6;
    text-align: center;
    color: rgba(15, 23, 42, 0.7);
    margin-top: 0.75rem;
  }

  .dark .full-bleed-caption {
    color: rgba(226, 232, 240, 0.8);
  }
`;

export function QuillRenderer({ content, className = "" }: QuillRendererProps) {
  const htmlContent = useMemo(() => {
    try {
      const parsed = marked.parse(content ?? "");
      return typeof parsed === "string" ? sanitizeHtml(parsed) : "";
    } catch (error) {
      logger.error("Failed to parse markdown:", error);
      return "";
    }
  }, [content]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = GLOBAL_STYLES;
  }, []);

  return (
    <div className={`quill-renderer-wrapper ${className}`}>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}


