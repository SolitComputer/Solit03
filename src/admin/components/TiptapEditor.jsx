import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, ImageIcon, LinkIcon, Undo, Redo, Minus, VideoIcon,
} from "lucide-react";
import { uploadArticleImage, uploadArticleVideo } from "../../services/storage";
import { useState } from "react";
import VideoNode from "./tiptap/VideoNode";

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition ${
        active ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default function TiptapEditor({ value, onChange, placeholder = "Tulis isi artikel di sini..." }) {
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: "rounded-xl max-w-full" } }),
      VideoNode,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-600 underline" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadArticleImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      console.error(err);
      alert("Gagal upload gambar");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleVideoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingVideo(true);
      const url = await uploadArticleVideo(file);
      editor.chain().focus().setVideo({ src: url }).run();
    } catch (err) {
      console.error(err);
      alert(err.message || "Gagal upload video");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
    }
  }

  function handleSetLink() {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL link:", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton title="Ordered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton title="Garis Pemisah" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={16} />
        </ToolbarButton>
        <ToolbarButton title="Link" active={editor.isActive("link")} onClick={handleSetLink}>
          <LinkIcon size={16} />
        </ToolbarButton>

        <label className={`p-1.5 rounded-lg transition cursor-pointer text-gray-500 hover:bg-gray-100 ${uploading ? "opacity-50 pointer-events-none" : ""}`} title="Sisipkan Gambar (bisa berkali-kali)">
          <ImageIcon size={16} />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>

        <label className={`p-1.5 rounded-lg transition cursor-pointer text-gray-500 hover:bg-gray-100 ${uploadingVideo ? "opacity-50 pointer-events-none" : ""}`} title="Sisipkan Video (maks 15MB, bisa berkali-kali)">
          <VideoIcon size={16} />
          <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
        </label>

        <span className="flex-1" />

        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo size={16} />
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
      {uploading && <p className="px-4 pb-2 text-xs text-blue-500">Mengupload gambar...</p>}
      {uploadingVideo && <p className="px-4 pb-2 text-xs text-blue-500">Mengupload video...</p>}
    </div>
  );
}
