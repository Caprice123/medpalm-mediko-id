import { useState, useMemo, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSummaryNotesByNode, searchSummaryNotesV2 } from '@store/summaryNotes/v2/userAction'
import {
  SidebarContainer, SearchBox, SearchIcon, SearchInput,
  ScrollArea, SectionBlock, SectionHeader, SectionLabel, TabGroup, Tab,
  NodeRow, ChevronIcon, NodeIcon, NodeLabel,
  NoteRow, NoteIcon, NoteLabel, LoadingRow,
  Divider, RecentHeader, RecentNoteRow, EmptyHint,
} from './CurriculumSidebar.styles'

function buildTree(flatNodes, parentId = null) {
  return flatNodes
    .filter(n => n.parentId === parentId)
    .map(n => ({ ...n, children: buildTree(flatNodes, n.id) }))
}

function TreeNode({ node, depth, selectedNoteId, nodeNotes, expandedNodes, onToggleNode, onSelectNote }) {
  const isOpen = expandedNodes.has(node.id)
  const hasChildren = node.children?.length > 0
  const nodeData = nodeNotes[node.id]
  const notes = nodeData?.notes || []
  const isLoading = nodeData?.isLoading

  return (
    <>
      <NodeRow
        $depth={depth}
        $clickable
        onClick={() => onToggleNode(node.id)}
      >
        <ChevronIcon $open={isOpen}>▶</ChevronIcon>
        <NodeIcon>{hasChildren ? '📚' : '📁'}</NodeIcon>
        <NodeLabel>{node.name}</NodeLabel>
      </NodeRow>

      {isOpen && (
        <>
          {node.children?.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedNoteId={selectedNoteId}
              nodeNotes={nodeNotes}
              expandedNodes={expandedNodes}
              onToggleNode={onToggleNode}
              onSelectNote={onSelectNote}
            />
          ))}
          {isLoading && (
            <LoadingRow $depth={depth + 1}>Memuat...</LoadingRow>
          )}
          {!isLoading && notes.map(note => (
            <NoteRow
              key={note.id}
              $depth={depth + 1}
              $selected={note.uniqueId === selectedNoteId}
              onClick={() => onSelectNote(note.uniqueId)}
            >
              <NoteIcon>📄</NoteIcon>
              <NoteLabel $selected={note.uniqueId === selectedNoteId}>{note.title}</NoteLabel>
            </NoteRow>
          ))}
          {!isLoading && nodeData?.isLoaded && notes.length === 0 && !hasChildren && (
            <LoadingRow $depth={depth + 1}>Tidak ada ringkasan</LoadingRow>
          )}
        </>
      )}
    </>
  )
}

function CurriculumSidebar({ selectedNoteId, onSelectNote }) {
  const dispatch = useDispatch()
  const { nodes, nodeNotes, loading, recentlyViewed, searchResults } = useSelector(s => s.summaryNotesV2)

  const [treeMode, setTreeMode] = useState('semester')
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [search, setSearch] = useState('')

  const debounceRef = useRef(null)

  const tree = useMemo(() => buildTree(nodes), [nodes])

  const rootNodes = useMemo(() => {
    if (treeMode === 'semester') return tree
    return tree.flatMap(n => n.children || [])
  }, [tree, treeMode])

  const handleSearchChange = useCallback((value) => {
    setSearch(value)
    clearTimeout(debounceRef.current)
    if (value.trim()) {
      debounceRef.current = setTimeout(() => {
        dispatch(searchSummaryNotesV2(value.trim()))
      }, 350)
    }
  }, [dispatch])

  const handleToggleNode = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
        if (!nodeNotes[nodeId]?.isLoaded) {
          dispatch(fetchSummaryNotesByNode(nodeId))
        }
      }
      return next
    })
  }, [dispatch, nodeNotes])

  const isSearching = search.trim().length > 0

  return (
    <SidebarContainer>
      <SearchBox>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput
          placeholder="Search summaries..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
        />
      </SearchBox>

      <ScrollArea>
        {isSearching ? (
          <SectionBlock>
            {loading.isSearchLoading ? (
              <EmptyHint>Mencari...</EmptyHint>
            ) : searchResults.length === 0 ? (
              <EmptyHint>Tidak ada hasil</EmptyHint>
            ) : searchResults.map(note => (
              <NoteRow
                key={note.id}
                $depth={0}
                $selected={note.uniqueId === selectedNoteId}
                onClick={() => onSelectNote(note.uniqueId)}
              >
                <NoteIcon>📄</NoteIcon>
                <NoteLabel $selected={note.uniqueId === selectedNoteId}>{note.title}</NoteLabel>
              </NoteRow>
            ))}
          </SectionBlock>
        ) : (
          <>
            <SectionBlock>
              <SectionHeader>
                <SectionLabel>📖 Kurikulum</SectionLabel>
                <TabGroup>
                  <Tab $active={treeMode === 'semester'} onClick={() => setTreeMode('semester')}>Semester</Tab>
                  <Tab $active={treeMode === 'subject'} onClick={() => setTreeMode('subject')}>Subject</Tab>
                </TabGroup>
              </SectionHeader>

              {loading.isNodesLoading ? (
                <EmptyHint>Memuat kurikulum...</EmptyHint>
              ) : rootNodes.length === 0 ? (
                <EmptyHint>Belum ada folder kurikulum</EmptyHint>
              ) : rootNodes.map(node => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedNoteId={selectedNoteId}
                  nodeNotes={nodeNotes}
                  expandedNodes={expandedNodes}
                  onToggleNode={handleToggleNode}
                  onSelectNote={onSelectNote}
                />
              ))}
            </SectionBlock>

            {recentlyViewed.length > 0 && (
              <>
                <Divider />
                <SectionBlock>
                  <RecentHeader>🕐 Terakhir Dilihat</RecentHeader>
                  {recentlyViewed.map(item => (
                    <RecentNoteRow
                      key={item.id}
                      $selected={item.metadata?.uniqueId === selectedNoteId}
                      onClick={() => onSelectNote(item.metadata?.uniqueId)}
                    >
                      {item.metadata?.title}
                    </RecentNoteRow>
                  ))}
                </SectionBlock>
              </>
            )}
          </>
        )}
      </ScrollArea>
    </SidebarContainer>
  )
}

export default CurriculumSidebar
