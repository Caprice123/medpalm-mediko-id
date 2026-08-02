import styled from 'styled-components'

/* ── Shared by TopicListPage, TopicDetailPage, UnlinkedQuestionsPage, QuestionsPage ── */

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

/* ── Shared page title (TopicDetailPage + QuestionsPage) ── */

export const PageTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`
