"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor, JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Strikethrough, Heading1, Heading2,
  List, ListOrdered, Quote, ImageIcon, LinkIcon, Undo, Redo
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface TipTapEditorProps {
  content: JSONContent | string;
  onChange: (content: JSONContent) => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Nhập URL hình ảnh:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // FIX: Validate URL protocol — block javascript:, data:, and other dangerous protocols
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        window.alert('Chỉ chấp nhận URL bắt đầu bằng http:// hoặc https://')
        return
      }
    } catch {
      window.alert('URL không hợp lệ')
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/40 border-b border-border rounded-t-lg">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-muted' : ''}
        title="In đậm (Cmd+B)"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-muted' : ''}
        title="In nghiêng (Cmd+I)"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-muted' : ''}
        title="Gạch ngang"
      >
        <Strikethrough className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        title="Tiêu đề 2"
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        title="Tiêu đề 3"
      >
        <Heading2 className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        title="Danh sách"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        title="Danh sách số"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-muted' : ''}
        title="Trích dẫn"
      >
        <Quote className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={setLink}
        className={editor.isActive('link') ? 'bg-muted' : ''}
        title="Chèn Link"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={addImage}
        title="Chèn hình ảnh"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Hoàn tác"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Làm lại"
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  )
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Image.configure({
        inline: true,
        // FIX: Remove allowBase64 to prevent XSS via embedded scripts in images
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        // FIX: Validate URLs before setting links (also done in setLink handler above)
        validate: (href) => {
          try {
            const parsed = new URL(href)
            return ['http:', 'https:'].includes(parsed.protocol)
          } catch {
            return false
          }
        },
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết nội dung của bạn...',
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="bg-background" />
    </div>
  );
}
