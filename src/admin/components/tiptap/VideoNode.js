import { Node, mergeAttributes } from "@tiptap/core";

// Node <video> sederhana untuk Tiptap — belum ada extension resmi dari @tiptap
// untuk video, jadi dibuat manual mengikuti pola Image bawaan mereka.
const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, { controls: "true", class: "rounded-xl max-w-full" }),
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: options });
        },
    };
  },
});

export default Video;
