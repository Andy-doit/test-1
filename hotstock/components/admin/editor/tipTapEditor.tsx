  "use client";

import { ChangeEvent, ClipboardEvent, useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadsService } from "@/lib/services/uploadsService";
import { toast } from "sonner";

interface TipTapEditorProps {
  content: string | Record<string, unknown>;
  onChange: (content: string) => void;
}

const normalizeContent = (content: TipTapEditorProps["content"]) => {
  if (!content) return "";
  if (typeof content === "string") return content;

  // Narrow Record to extract common content fields safely
  const obj = content as Record<string, unknown>;
  const possibleContent =
    (typeof obj.content === "string" ? obj.content : null) ??
    (typeof obj.body === "string" ? obj.body : null) ??
    (typeof obj.html === "string" ? obj.html : null) ??
    (typeof obj.text === "string" ? obj.text : null) ??
    "";

  return possibleContent;
};

// Content pasted from another page/Word/Google Docs carries its source's own
// `class`/`style` (e.g. Tailwind "absolute", "top-0"...). Those attributes can
// collide with this site's own CSS and pull elements (mainly images) out of the
// normal document flow. Strip everything except a safe tag/attribute allowlist
// so pasted content only keeps semantic structure, not source-site positioning.
const PASTE_ALLOWED_TAGS = new Set([
  "A", "B", "STRONG", "I", "EM", "U", "BR", "P",
  "H1", "H2", "H3", "H4", "H5", "H6",
  "UL", "OL", "LI", "BLOCKQUOTE", "PRE", "CODE",
  "IMG", "TABLE", "THEAD", "TBODY", "TR", "TH", "TD", "HR",
]);

const PASTE_ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  A: new Set(["href"]),
  IMG: new Set(["src", "alt", "title"]),
};

const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

// A bare allowlist of the `href`/`src` attribute names isn't enough — the
// value itself can carry a `javascript:` URI. Resolve against the current
// origin and only keep it if the scheme is one we're willing to navigate to.
const sanitizeUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed, window.location.origin);
    return SAFE_URL_PROTOCOLS.has(url.protocol) ? trimmed : "";
  } catch {
    return "";
  }
};

const sanitizePastedHtml = (html: string): string => {
  const template = document.createElement("template");
  template.innerHTML = html;

  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
        return;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) return;

      const element = child as HTMLElement;
      const tagName = element.tagName;

      if (tagName === "SCRIPT" || tagName === "STYLE") {
        element.remove();
        return;
      }

      if (!PASTE_ALLOWED_TAGS.has(tagName)) {
        element.replaceWith(...Array.from(element.childNodes));
        walk(node);
        return;
      }

      [...element.attributes].forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        const allowed = PASTE_ALLOWED_ATTRIBUTES[tagName]?.has(name) ?? false;

        if (!allowed) {
          element.removeAttribute(attribute.name);
          return;
        }

        if (name === "href" || name === "src") {
          const safeUrl = sanitizeUrl(attribute.value);
          if (!safeUrl) {
            element.removeAttribute(attribute.name);
          } else {
            element.setAttribute(attribute.name, safeUrl);
          }
        }
      });

      walk(element);
    });
  };

  walk(template.content);
  return template.innerHTML;
};

const isEmptyHtml = (html: string) => {
  const withoutTags = html
    .replace(/<img[^>]*>/gi, "image")
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<\/?[^>]+>/gi, "")
    .replace(/&nbsp;/gi, "")
    .trim();

  return withoutTags.length === 0;
};

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastExternalContentRef = useRef("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const nextContent = normalizeContent(content);
    if (nextContent === lastExternalContentRef.current) return;
    if (editor.innerHTML === nextContent) return;

    editor.innerHTML = nextContent;
    lastExternalContentRef.current = nextContent;
  }, [content]);

  const emitChange = () => {
    const html = editorRef.current?.innerHTML ?? "";
    const normalized = isEmptyHtml(html) ? "" : html;

    lastExternalContentRef.current = normalized;
    onChange(normalized);
  };

  const runCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    emitChange();
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    const html = event.clipboardData.getData("text/html");
    if (html) {
      document.execCommand("insertHTML", false, sanitizePastedHtml(html));
    } else {
      const text = event.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    }

    emitChange();
  };

  const setBlock = (tag: "P" | "H1" | "H2" | "H3" | "BLOCKQUOTE" | "PRE") => {
    runCommand("formatBlock", tag);
  };

  const setLink = () => {
    const url = window.prompt("URL Link:");
    if (!url) return;
    runCommand("createLink", url);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, GIF, WebP)");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadsService.uploadFile(file);
      runCommand("insertImage", url);
      toast.success("Tải ảnh lên thành công");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Lỗi khi tải ảnh: " + message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="border border-border rounded-md bg-background overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-muted/50 border-b border-border">
        <Button type="button" variant="ghost" size="icon" onClick={() => setBlock("H1")}>
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => setBlock("H2")}>
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => setBlock("H3")}>
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1 self-center" />

        <Button type="button" variant="ghost" size="icon" onClick={() => runCommand("bold")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => runCommand("italic")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => runCommand("underline")}>
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1 self-center" />

        <Button type="button" variant="ghost" size="icon" onClick={() => runCommand("insertUnorderedList")}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => runCommand("insertOrderedList")}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => setBlock("BLOCKQUOTE")}>
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => setBlock("PRE")}>
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1 self-center" />

        <Button type="button" variant="ghost" size="icon" onClick={setLink}>
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/gif, image/webp"
          className="hidden"
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        onPaste={handlePaste}
        className="prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[180px] p-4"
        data-placeholder="Nhập nội dung bài viết..."
      />
    </div>
  );
}