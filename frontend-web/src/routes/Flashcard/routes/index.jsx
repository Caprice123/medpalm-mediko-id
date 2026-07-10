import { FlashcardListRouter, FlashcardDetailRouter } from './FlashcardRouter'

export class FlashcardRoute {
  static moduleRoute = '/flashcards'
  static initialRoute = FlashcardRoute.moduleRoute
  static detailRoute = FlashcardRoute.moduleRoute + '/:id'
}

export const flashcardRoutes = [
  { path: FlashcardRoute.initialRoute, element: <FlashcardListRouter /> },
  { path: FlashcardRoute.detailRoute, element: <FlashcardDetailRouter /> },
]
