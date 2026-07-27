import { TopicHubRouter, TopicDetailRouter, SubtopicDetailRouter } from './TopicHubRouter'

export class TopicHubRoute {
  static moduleRoute = '/topik'
  static initialRoute = TopicHubRoute.moduleRoute
  static detailRoute = TopicHubRoute.moduleRoute + '/:topicSlug'
  static subtopicRoute = TopicHubRoute.moduleRoute + '/:topicSlug/:subtopicSlug'
}

export const topicHubRoutes = [
  { path: TopicHubRoute.initialRoute, element: <TopicHubRouter /> },
  { path: TopicHubRoute.detailRoute, element: <TopicDetailRouter /> },
  { path: TopicHubRoute.subtopicRoute, element: <SubtopicDetailRouter /> },
]
