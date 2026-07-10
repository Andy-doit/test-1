// Utility functions for normalizing and converting article content formats
// to HTML for rendering in the block editor and preview.

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char] ?? char;
  });

export const plainTextToHtml = (value: string): string =>
  value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");

const extractTextFromChildren = (children: unknown[]): string =>
  children
    .map((child) => {
      if (typeof child === "string") return child;
      if (!child || typeof child !== "object") return "";
      const node = child as Record<string, unknown>;
      if (typeof node.text === "string") return node.text;
      if (Array.isArray(node.children)) return extractTextFromChildren(node.children);
      return "";
    })
    .filter(Boolean)
    .join("");

export const tipTapJsonToHtml = (node: unknown): string => {
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;

  if (typeof n.text === "string") {
    let text = escapeHtml(n.text);

    if (Array.isArray(n.marks)) {
      n.marks.forEach((mark: unknown) => {
        const m = mark as Record<string, unknown>;
        if (m?.type === "bold") text = `<strong>${text}</strong>`;
        if (m?.type === "italic") text = `<em>${text}</em>`;
        if (m?.type === "underline") text = `<u>${text}</u>`;
        if (m?.type === "link" && typeof (m?.attrs as Record<string, unknown>)?.href === "string") {
          text = `<a href="${escapeHtml((m.attrs as Record<string, unknown>).href as string)}">${text}</a>`;
        }
      });
    }

    return text;
  }

  const children = Array.isArray(n.content) ? n.content.map(tipTapJsonToHtml).join("") : "";

  switch (n.type) {
    case "doc":
      return children;
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading": {
      const attrs = n.attrs as Record<string, unknown> | undefined;
      const level = Math.min(Math.max(Number(attrs?.level) || 2, 1), 6);
      return `<h${level}>${children}</h${level}>`;
    }
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList":
      return `<ol>${children}</ol>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${children}</code></pre>`;
    case "hardBreak":
      return "<br>";
    case "image": {
      const attrs = n.attrs as Record<string, unknown> | undefined;
      return attrs?.src
        ? `<img src="${escapeHtml(String(attrs.src))}" alt="${escapeHtml(String(attrs.alt ?? ""))}"/>`
        : "";
    }
    default:
      return children;
  }
};

const parseJsonIfPossible = (value: string): unknown => {
  const trimmed = value.trim();
  if (!trimmed || !/^[\[{]/.test(trimmed)) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};

export const normalizeEditorContent = (value: unknown): string => {
  if (!value) return "";

  if (typeof value === "string") {
    const parsed = parseJsonIfPossible(value);
    if (parsed !== value) return normalizeEditorContent(parsed);

    const trimmed = value.trim();
    if (!trimmed) return "";

    return /\/?[a-z][\s\S]*>/i.test(trimmed) ? trimmed : plainTextToHtml(trimmed);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "";

    return value
      .map((item: unknown) => {
        if (typeof item === "string") return plainTextToHtml(item);
        if (!item || typeof item !== "object") return "";
        const node = item as Record<string, unknown>;
        if (node.type && Array.isArray(node.content)) return tipTapJsonToHtml(node);
        if (Array.isArray(node.children)) return plainTextToHtml(extractTextFromChildren(node.children));
        return normalizeEditorContent(
          node.content ?? node.body ?? node.text ?? node.html ?? node.richText ?? node.value
        );
      })
      .join("");
  }

  if (typeof value === "object") {
    const node = value as Record<string, unknown>;
    if (node.type && Array.isArray(node.content)) return tipTapJsonToHtml(node);
    if (Array.isArray(node.children))
      return plainTextToHtml(extractTextFromChildren(node.children));

    return normalizeEditorContent(
      node.content ?? node.body ?? node.text ?? node.html ?? node.richText ?? node.markdown ?? node.value
    );
  }

  return "";
};

const extractBlockContent = (block: unknown): string => {
  if (!block || typeof block !== "object") return normalizeEditorContent(block);
  const b = block as Record<string, unknown>;
  return normalizeEditorContent(
    b.content ?? b.body ?? b.text ?? b.html ?? b.richText ?? b.markdown ?? b.value ?? b.children ?? block
  );
};

const normalizeBlocksSource = (value: unknown): unknown[] | undefined => {
  if (!value) return undefined;

  if (typeof value === "string") {
    const parsed = parseJsonIfPossible(value);
    return parsed !== value ? normalizeBlocksSource(parsed) : undefined;
  }

  if (Array.isArray(value)) return value;

  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    return normalizeBlocksSource(
      v.contentBlocks ?? v.blocks ?? v.items ?? v.data ?? v.content ?? v.children
    );
  }

  return undefined;
};

export type NormalizedBlock = {
  id: string;
  type: "text";
  content: string;
};

export const getInitialBlocks = (article?: Record<string, unknown>): NormalizedBlock[] => {
  const rawBlocks =
    normalizeBlocksSource(article?.contentBlocks) ??
    normalizeBlocksSource(article?.blocks) ??
    normalizeBlocksSource(article?.content);

  if (rawBlocks?.length) {
    const normalized = rawBlocks
      .map((block: unknown, index) => {
        const b = (block as Record<string, unknown>) ?? {};
        return {
          ...(typeof b === "object" ? b : {}),
          id: String(b.id ?? `block-${index}-${Math.random().toString(36).substring(2, 11)}`),
          type: "text" as const,
          content: extractBlockContent(block),
        };
      })
      .filter((block) => block.content.trim().length > 0);

    if (normalized.length) return normalized;
  }

  const fallback =
    normalizeEditorContent(article?.contentBlocks) ||
    normalizeEditorContent(article?.blocks) ||
    normalizeEditorContent(article?.content);

  return [{ id: "default-block", type: "text", content: fallback }];
};
