import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  Container,
  MainContent,
  TabBar,
  Tab,
  TabContent,
  Content,
} from '../SessionPractice.styles'
import styled from 'styled-components'

const SidebarSkeleton = styled.div`
  width: 320px;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    display: none;
  }
`

const MessagesSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
`

const MessageBubble = styled.div`
  max-width: 70%;
  align-self: ${props => props.align || 'flex-start'};
`

function SessionSkeleton() {
  return (
    <Container>
      <Content>
        {/* Sidebar Skeleton */}
        <SidebarSkeleton>
          <Skeleton height={30} width="60%" />
          <Skeleton height={60} />
          <Skeleton height={20} width="40%" style={{ marginTop: '20px' }} />
          <Skeleton count={3} height={15} />
          <Skeleton height={40} style={{ marginTop: 'auto' }} />
        </SidebarSkeleton>

        {/* Main Content Skeleton */}
        <MainContent>
          {/* Tab Bar */}
          <TabBar>
            {[1, 2, 3, 4].map(i => (
              <Tab key={i} active={i === 1}>
                <Skeleton width={80} height={20} />
              </Tab>
            ))}
          </TabBar>

          {/* Tab Content */}
          <TabContent>
            <MessagesSkeleton>
              {/* Assistant Message */}
              <MessageBubble align="flex-start">
                <Skeleton height={15} width={80} style={{ marginBottom: '8px' }} />
                <Skeleton count={2} height={15} />
              </MessageBubble>

              {/* User Message */}
              <MessageBubble align="flex-end">
                <Skeleton height={15} width={60} />
              </MessageBubble>

              {/* Assistant Message */}
              <MessageBubble align="flex-start">
                <Skeleton height={15} width={80} style={{ marginBottom: '8px' }} />
                <Skeleton count={3} height={15} />
              </MessageBubble>
            </MessagesSkeleton>

            {/* Input Skeleton */}
            <div style={{ padding: '20px', borderTop: '1px solid #e0e0e0', marginTop: 'auto' }}>
              <Skeleton height={50} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Skeleton height={40} width={120} />
                <Skeleton height={40} width={80} />
              </div>
            </div>
          </TabContent>
        </MainContent>
      </Content>
    </Container>
  )
}

export default SessionSkeleton
