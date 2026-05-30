"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContractEditor({
  content,
  onChange,
  editable = true,
}: {
  content?: JSONContent | null;
  editable?: boolean;
  onChange?: (content: JSONContent, html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start drafting the agreement..." }),
      CharacterCount.configure({ limit: 50000 }),
      Color,
      TextStyle,
      Highlight,
      Typography,
      Underline,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content ?? { type: "doc", content: [{ type: "paragraph" }] },
    onUpdate({ editor: currentEditor }) {
      onChange?.(currentEditor.getJSON(), currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {editable ? (
        <div className="flex flex-wrap gap-2 border-b border-slate-200 p-3 dark:border-zinc-800">
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</Button>
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</Button>
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullets</Button>
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbers</Button>
          <Button size="sm" variant="ghost" onClick={() => editor?.chain().focus().toggleHighlight().run()}>Highlight</Button>
        </div>
      ) : null}
      <EditorContent editor={editor} className={cn("min-h-[320px] px-4 py-4 prose prose-zinc max-w-none dark:prose-invert [&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:outline-none")} />
      <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
        {editor?.storage.characterCount.characters() ?? 0} characters
      </div>
    </div>
  );
}
