import { useState } from 'react'
import { EditorRoot, EditorContent, EditorCommand, EditorCommandItem, EditorCommandEmpty, EditorBubble } from 'novel'
import {
  Container,
  Header,
  Title,
  EditorWrapper,
  OutputSection,
  OutputTitle,
  OutputContent,
  EditorGlobalStyles
} from './EditorTest.styles'

function EditorTest() {
  const [content, setContent] = useState('')

  return (
    <>
      <EditorGlobalStyles />
      <Container>
      <Header>
        <Title>📝 Notion-like Editor Test</Title>
      </Header>

      <EditorWrapper>
        <h3>Try it out:</h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Type <strong>/</strong> for commands • Select text for formatting
        </p>

        <EditorRoot>
          <EditorContent
            initialContent={{
              type: 'doc',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Start typing here... Try using / for slash commands!'
                    }
                  ]
                }
              ]
            }}
            onUpdate={({ editor }) => {
              const json = editor?.getJSON()
              if (json) {
                setContent(JSON.stringify(json, null, 2))
              }
            }}
            editorProps={{
              attributes: {
                class: 'prose prose-lg focus:outline-none min-h-[300px]',
              },
            }}
          >
            <EditorCommand className="slash-command">
              <EditorCommandEmpty className="slash-command-empty">
                No results
              </EditorCommandEmpty>
              <EditorCommandItem
                value="heading"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 1 })
                    .run()
                }}
                className="slash-command-item"
              >
                <span>💠 Heading 1</span>
              </EditorCommandItem>
              <EditorCommandItem
                value="heading2"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 2 })
                    .run()
                }}
                className="slash-command-item"
              >
                <span>📌 Heading 2</span>
              </EditorCommandItem>
              <EditorCommandItem
                value="bullet"
                onCommand={({ editor, range }) => {
                  editor.chain().focus().deleteRange(range).toggleBulletList().run()
                }}
                className="slash-command-item"
              >
                <span>• Bullet List</span>
              </EditorCommandItem>
              <EditorCommandItem
                value="numbered"
                onCommand={({ editor, range }) => {
                  editor.chain().focus().deleteRange(range).toggleOrderedList().run()
                }}
                className="slash-command-item"
              >
                <span>1. Numbered List</span>
              </EditorCommandItem>
              <EditorCommandItem
                value="quote"
                onCommand={({ editor, range }) => {
                  editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleNode('paragraph', 'paragraph')
                    .toggleBlockquote()
                    .run()
                }}
                className="slash-command-item"
              >
                <span>❝ Quote</span>
              </EditorCommandItem>
              <EditorCommandItem
                value="code"
                onCommand={({ editor, range }) => {
                  editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
                }}
                className="slash-command-item"
              >
                <span>💻 Code Block</span>
              </EditorCommandItem>
            </EditorCommand>

            <EditorBubble className="bubble-menu">
              <button
                onClick={(e) => {
                  e.preventDefault()
                }}
                className="bubble-menu-button"
                data-active="false"
              >
                Bold
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                }}
                className="bubble-menu-button"
                data-active="false"
              >
                Italic
              </button>
            </EditorBubble>
          </EditorContent>
        </EditorRoot>
      </EditorWrapper>

      <OutputSection>
        <OutputTitle>📄 Output JSON</OutputTitle>
        <OutputContent>
          <pre>{content || 'Start typing to see the output...'}</pre>
        </OutputContent>
      </OutputSection>
    </Container>
    </>
  )
}

export default EditorTest
