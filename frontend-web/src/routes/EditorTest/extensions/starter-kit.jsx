import StarterKitOriginal from "@tiptap/starter-kit";

const StarterKit = StarterKitOriginal.configure({
  bulletList: {
    HTMLAttributes: {
      class: "list-disc list-outside leading-3 -mt-2",
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: "list-decimal list-outside leading-3 -mt-2",
    },
  },
  listItem: {
    HTMLAttributes: {
      class: "leading-normal -mb-2",
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: "border-l-4 border-primary",
    },
  },
  codeBlock: {
    HTMLAttributes: {
      class: "rounded-sm bg-muted border p-5 font-mono font-medium",
    },
  },
  code: {
    HTMLAttributes: {
      class: "rounded-md bg-muted px-1.5 py-1 font-mono font-medium",
      spellcheck: "false",
    },
  },
  horizontalRule: false,
  dropcursor: {
    color: "#DBEAFE",
    width: 4,
  },
  gapcursor: false,
});

export default StarterKit
