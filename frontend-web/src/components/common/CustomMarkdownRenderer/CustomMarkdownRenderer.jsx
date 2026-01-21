import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Heading1,
  Heading2,
  Heading3,
  Paragraph,
  UnorderedList,
  OrderedList,
  ListItem,
  Blockquote,
  Link
} from './CustomMarkdownRenderer.styles';

const CustomMarkdownRenderer = ({ item }) => {
  // Pre-process the text to convert single newlines to line breaks in Markdown
  const processedText = typeof item === 'string' 
    ? item.replace(/\n/g, '  \n') // Add two spaces before each newline for Markdown line breaks
    : item;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <Heading1 {...props} />
        ),
        h2: ({ node, ...props }) => (
          <Heading2 {...props} />
        ),
        h3: ({ node, ...props }) => (
          <Heading3 {...props} />
        ),
        p: ({ node, ...props }) => <Paragraph {...props} />,
        ul: ({ node, ...props }) => (
          <UnorderedList {...props} />
        ),
        ol: ({ node, ...props }) => (
          <OrderedList {...props} />
        ),
        li: ({ node, ...props }) => <ListItem {...props} />,
        blockquote: ({ node, ...props }) => (
          <Blockquote {...props} />
        ),
        a: ({ node, href, ...props }) => (
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
      }}
    >
      {processedText}
    </ReactMarkdown>
  );
};

export default CustomMarkdownRenderer;
