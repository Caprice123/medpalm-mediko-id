import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
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

// Memoized markdown components config
const markdownComponents = {
  h1: ({ node, ...props }) => <Heading1 {...props} />,
  h2: ({ node, ...props }) => <Heading2 {...props} />,
  h3: ({ node, ...props }) => <Heading3 {...props} />,
  p: ({ node, ...props }) => <Paragraph {...props} />,
  ul: ({ node, ...props }) => <UnorderedList {...props} />,
  ol: ({ node, ...props }) => <OrderedList {...props} />,
  li: ({ node, ...props }) => <ListItem {...props} />,
  blockquote: ({ node, ...props }) => <Blockquote {...props} />,
  a: ({ node, href, ...props }) => (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
};

// Memoized block renderer - only re-renders if content changes
const MarkdownBlock = React.memo(({ content }) => {
  const processedText = content.replace(/\n/g, '  \n');

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      urlTransform={(url) => ({
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
      components={markdownComponents}
    >
      {processedText}
    </ReactMarkdown>
  );
});

const CustomMarkdownRenderer = ({ item, isStreaming = false }) => {
  const text = typeof item === 'string' ? item : '';

  // Split content into completed blocks and typing block for streaming optimization
  const { completedBlocks, typingBlock } = useMemo(() => {
    if (!isStreaming || !text) {
      return { completedBlocks: [], typingBlock: text };
    }

    // Split by paragraph boundaries (double newline or heading markers)
    // This keeps completed paragraphs stable while only the last one updates
    const blocks = text.split(/(?=\n\n|^#{1,6}\s)/);

    if (blocks.length <= 1) {
      return { completedBlocks: [], typingBlock: text };
    }

    // Keep all but the last block as completed (stable)
    const completed = blocks.slice(0, -1);
    const typing = blocks[blocks.length - 1];

    return {
      completedBlocks: completed,
      typingBlock: typing
    };
  }, [text, isStreaming]);

  // For streaming: render completed blocks (won't re-render) + typing block (updates)
  if (isStreaming && completedBlocks.length > 0) {
    return (
      <>
        {completedBlocks.map((block, index) => (
          <MarkdownBlock key={`block-${index}`} content={block} />
        ))}
        <MarkdownBlock key="typing" content={typingBlock} />
      </>
    );
  }

  // For non-streaming or single block: render normally
  const processedText = text.replace(/\n/g, '  \n');

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={markdownComponents}
    >
      {processedText}
    </ReactMarkdown>
  );
};

export default React.memo(CustomMarkdownRenderer);
