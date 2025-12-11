import TaskItemOriginal from "@tiptap/extension-task-item";

const TaskItem = TaskItemOriginal.configure({
  nested: true,
  HTMLAttributes: {
    class: "flex items-start my-4",
  },
});

export default TaskItem
