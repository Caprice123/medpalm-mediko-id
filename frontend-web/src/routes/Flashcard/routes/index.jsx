import { FlashcardListRouter, FlashcardDetailRouter, FlashcardReviewRouter } from './FlashcardRouter'

export class FlashcardRoute {
  static moduleRoute = '/flashcards'
  static initialRoute = FlashcardRoute.moduleRoute
  static detailRoute = FlashcardRoute.moduleRoute + '/:id'
  static reviewRoute = FlashcardRoute.moduleRoute + '/review'
}

export const flashcardRoutes = [
  { path: FlashcardRoute.reviewRoute, element: <FlashcardReviewRouter /> },
  { path: FlashcardRoute.initialRoute, element: <FlashcardListRouter /> },
  { path: FlashcardRoute.detailRoute, element: <FlashcardDetailRouter /> },
]
