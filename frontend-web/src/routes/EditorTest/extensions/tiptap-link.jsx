import Link from "@tiptap/extension-link";

const TiptapLink = Link.configure({
  HTMLAttributes: {
    class:
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
  },
});
export default TiptapLink
