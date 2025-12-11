import HorizontalRuleOriginal from "@tiptap/extension-horizontal-rule";

const HorizontalRule = HorizontalRuleOriginal.configure({
  HTMLAttributes: {
    class: "mt-4 mb-6 border-t border-muted-foreground",
  },
});

export default HorizontalRule
