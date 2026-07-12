import { FlashcardListRouter, FlashcardDetailRouter, FlashcardReviewRouter, FlashcardReviewAllRouter, FlashcardReviewCustomRouter, FlashcardSessionRouter } from './FlashcardRouter'

export class FlashcardRoute {
  static moduleRoute = '/flashcards'
  static initialRoute = FlashcardRoute.moduleRoute
  static detailRoute = FlashcardRoute.moduleRoute + '/:id'
  static reviewRoute = FlashcardRoute.moduleRoute + '/review'
  static reviewAllRoute = FlashcardRoute.moduleRoute + '/review/all'
  static reviewCustomRoute = FlashcardRoute.moduleRoute + '/review/custom'
  static sessionRoute = (uniqueId) => `${FlashcardRoute.moduleRoute}/session/${uniqueId}`
  static sessionRoutePath = FlashcardRoute.moduleRoute + '/session/:uniqueId'
}

export const flashcardRoutes = [
  { path: FlashcardRoute.sessionRoutePath,  element: <FlashcardSessionRouter /> },
  { path: FlashcardRoute.reviewAllRoute,    element: <FlashcardReviewAllRouter /> },
  { path: FlashcardRoute.reviewCustomRoute, element: <FlashcardReviewCustomRouter /> },
  { path: FlashcardRoute.reviewRoute,       element: <FlashcardReviewRouter /> },
  { path: FlashcardRoute.initialRoute,      element: <FlashcardListRouter /> },
  { path: FlashcardRoute.detailRoute,       element: <FlashcardDetailRouter /> },
]
