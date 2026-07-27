import { Suspense } from 'react'
import lazyWithRetry from '@utils/lazyWithRetry'
import PageLoader from '@components/PageLoader'

const TopicHubPage = lazyWithRetry(() => import('../pages/TopicHub'))
const TopicDetailPage = lazyWithRetry(() => import('../pages/TopicDetail'))
const SubtopicDetailPage = lazyWithRetry(() => import('../pages/SubtopicDetail'))

export function TopicHubRouter() {
  return <Suspense fallback={<PageLoader />}><TopicHubPage /></Suspense>
}

export function TopicDetailRouter() {
  return <Suspense fallback={<PageLoader />}><TopicDetailPage /></Suspense>
}

export function SubtopicDetailRouter() {
  return <Suspense fallback={<PageLoader />}><SubtopicDetailPage /></Suspense>
}
