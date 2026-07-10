"use client";

// This is a placeholder for a heavy rich text editor library like Draft.js, Quill, or TinyMCE
export default function RichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 border-b flex gap-2">
        <button className="px-2 py-1 text-xs bg-card border rounded hover:bg-accent font-bold">B</button>
        <button className="px-2 py-1 text-xs bg-card border rounded hover:bg-accent italic">I</button>
        <button className="px-2 py-1 text-xs bg-card border rounded hover:bg-accent underline">U</button>
      </div>
      <textarea
        className="w-full min-h-[300px] p-4 bg-transparent outline-none resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your article content here..."
      />
    </div>
  );
}
