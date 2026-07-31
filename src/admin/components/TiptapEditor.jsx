import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, ImageIcon, LinkIcon, Undo, Redo, Minus, VideoIcon,
  Wand2, Check, X,
} from "lucide-react";
import { uploadArticleImage, uploadArticleVideo } from "../../services/storage";
import { useState, useRef, useEffect } from "react";
import VideoNode from "./tiptap/VideoNode";
import { sanitizeArticleHtml } from "../../utils/sanitizeArticleHtml";

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition ${
        active ? "bg-blue-100 text-blue-600" : "text-content-muted hover:bg-gray-100"
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

export default function TiptapEditor({ value, onChange, placeholder = "Tulis isi artikel di sini..." }) {
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [cleanupResult, setCleanupResult] = useState(null); // { changes: string[], preview: string }
  const [pasteToast, setPasteToast] = useState(null); // string message
  const editorRef = useRef(null);

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
    editorProps: {
      handlePaste(view, event) {
        const clipboardHtml = event.clipboardData?.getData("text/html");
        if (!clipboardHtml || clipboardHtml.length < 50) return false;

        // Check if from external source
        const isExternalHtml = /<(meta|style|span|div)\b/i.test(clipboardHtml)
          || /style\s*=\s*"/i.test(clipboardHtml)
          || /class\s*=\s*"/i.test(clipboardHtml);

        if (!isExternalHtml) return false;

        event.preventDefault();

        const { html: cleaned, changes } = sanitizeArticleHtml(clipboardHtml);
        if (cleaned && editorRef.current) {
          editorRef.current.commands.insertContent(cleaned);

          const changeCount = changes.filter(c => c !== "Konten sudah rapi, tidak ada perubahan").length;
          if (changeCount > 0) {
            setPasteToast(`✨ Auto-rapikan: ${changeCount} perbaikan diterapkan`);
            setTimeout(() => setPasteToast(null), 3000);
          }
        }

        return true;
      },
    },
  });

  // Keep ref in sync
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

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

  function handleCleanup() {
    const currentHtml = editor.getHTML();
    const { html: cleanedHtml, changes } = sanitizeArticleHtml(currentHtml);
    setCleanupResult({ changes, preview: cleanedHtml, original: currentHtml });
  }

  function applyCleanup() {
    if (!cleanupResult) return;
    editor.commands.setContent(cleanupResult.preview);
    onChange(cleanupResult.preview);
    setCleanupResult(null);
  }

  function cancelCleanup() {
    setCleanupResult(null);
  }

  return (
    <div className="border-2 border-border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-surface-muted">
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

        <label className={`p-1.5 rounded-lg transition cursor-pointer text-content-muted hover:bg-gray-100 ${uploading ? "opacity-50 pointer-events-none" : ""}`} title="Sisipkan Gambar (bisa berkali-kali)">
          <ImageIcon size={16} />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>

        <label className={`p-1.5 rounded-lg transition cursor-pointer text-content-muted hover:bg-gray-100 ${uploadingVideo ? "opacity-50 pointer-events-none" : ""}`} title="Sisipkan Video (maks 15MB, bisa berkali-kali)">
          <VideoIcon size={16} />
          <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
        </label>

        {/* Separator */}
        <span className="w-px h-5 bg-border mx-1" />

        {/* Auto Rapikan Button */}
        <button
          type="button"
          onClick={handleCleanup}
          title="Auto Rapikan — Bersihkan style copas, tag sampah, dll."
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-gradient-to-r from-violet-50 to-blue-50 text-violet-600 border border-violet-200/60 hover:from-violet-100 hover:to-blue-100 hover:border-violet-300 hover:shadow-sm transition-all"
        >
          <Wand2 size={13} />
          <span className="hidden sm:inline">Rapikan</span>
        </button>

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
        className="prose prose-sm max-w-none px-4 py-3 min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-content-muted [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
      {uploading && <p className="px-4 pb-2 text-xs text-blue-500">Mengupload gambar...</p>}
      {uploadingVideo && <p className="px-4 pb-2 text-xs text-blue-500">Mengupload video...</p>}

      {/* Paste auto-clean toast */}
      {pasteToast && (
        <div className="px-4 pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-lg text-xs font-medium animate-pulse">
            <Wand2 size={12} />
            {pasteToast}
          </div>
        </div>
      )}

      {/* ═══ Cleanup Results Modal ═══ */}
      {cleanupResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={cancelCleanup}>
          <div
            className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-violet-50 to-blue-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-violet-100 text-violet-600 rounded-xl">
                  <Wand2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-content">Auto Rapikan Konten</h3>
                  <p className="text-[11px] text-content-muted">Hasil pembersihan otomatis</p>
                </div>
              </div>
              <button
                type="button"
                onClick={cancelCleanup}
                className="p-1.5 rounded-full hover:bg-gray-200 text-content-muted transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Changes List */}
            <div className="px-5 py-4 space-y-3 max-h-[50vh] overflow-y-auto">
              <p className="text-xs font-bold text-content-soft uppercase tracking-wider">
                {cleanupResult.changes.length > 1 || cleanupResult.changes[0] !== "Konten sudah rapi, tidak ada perubahan"
                  ? `${cleanupResult.changes.length} perubahan ditemukan:`
                  : "Status:"}
              </p>
              <ul className="space-y-1.5">
                {cleanupResult.changes.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-content-soft">
                    <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                      c === "Konten sudah rapi, tidak ada perubahan"
                        ? "bg-emerald-500"
                        : "bg-violet-500"
                    }`}>
                      <Check size={10} />
                    </span>
                    <span className="leading-snug">{c}</span>
                  </li>
                ))}
              </ul>

              {/* Size comparison */}
              {cleanupResult.original !== cleanupResult.preview && (
                <div className="mt-3 p-3 bg-surface-muted rounded-xl border border-border">
                  <div className="flex items-center justify-between text-[11px] text-content-muted">
                    <span>Ukuran sebelum:</span>
                    <span className="font-mono font-bold">{(cleanupResult.original.length / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-content-muted mt-1">
                    <span>Ukuran sesudah:</span>
                    <span className="font-mono font-bold text-emerald-600">{(cleanupResult.preview.length / 1024).toFixed(1)} KB</span>
                  </div>
                  {cleanupResult.original.length > cleanupResult.preview.length && (
                    <div className="flex items-center justify-between text-[11px] mt-1.5 pt-1.5 border-t border-border">
                      <span className="text-content-muted">Dihemat:</span>
                      <span className="font-mono font-bold text-violet-600">
                        -{((1 - cleanupResult.preview.length / cleanupResult.original.length) * 100).toFixed(0)}%
                        ({((cleanupResult.original.length - cleanupResult.preview.length) / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-border bg-surface-muted/50">
              <button
                type="button"
                onClick={cancelCleanup}
                className="flex-1 py-2.5 px-4 text-xs font-bold text-content-soft bg-surface border border-border rounded-xl hover:bg-gray-100 transition"
              >
                Batal
              </button>
              {cleanupResult.original !== cleanupResult.preview ? (
                <button
                  type="button"
                  onClick={applyCleanup}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl hover:from-violet-700 hover:to-blue-700 shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check size={14} />
                  Terapkan Perubahan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cancelCleanup}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check size={14} />
                  Oke, Sudah Rapi!
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

