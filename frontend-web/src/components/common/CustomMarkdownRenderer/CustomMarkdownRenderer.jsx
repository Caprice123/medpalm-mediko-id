import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './CustomMarkdownRenderer.module.css';

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
          <h1 className={styles.heading1} {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className={styles.heading2} {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className={styles.heading3} {...props} />
        ),
        p: ({ node, ...props }) => <p className={styles.paragraph} {...props} />,
        ul: ({ node, ...props }) => (
          <ul className={styles.unorderedList} {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className={styles.orderedList} {...props} />
        ),
        li: ({ node, ...props }) => <li className={styles.listItem} {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            className={styles.blockquote}
            {...props}
          />
        ),
        a: ({ node, href, ...props }) => (
          <a 
            href={href}
            className={styles.link}
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
