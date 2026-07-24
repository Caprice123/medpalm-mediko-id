import { FlashcardListRouter } from './FlashcardRouter'

export class FlashcardRoute {
  static moduleRoute = '/flashcards'
  static initialRoute = FlashcardRoute.moduleRoute
  // kept for v1/v2 component references — not actively routed
  static detailRoute = FlashcardRoute.moduleRoute + '/:id'
  static reviewRoute = FlashcardRoute.moduleRoute + '/review'
  static reviewAllRoute = FlashcardRoute.moduleRoute + '/review/all'
  static reviewCustomRoute = FlashcardRoute.moduleRoute + '/review/custom'
  static sessionRoute = (uniqueId) => `${FlashcardRoute.moduleRoute}/session/${uniqueId}`
  static sessionRoutePath = FlashcardRoute.moduleRoute + '/session/:uniqueId'
}

export const flashcardRoutes = [
  { path: FlashcardRoute.initialRoute, element: <FlashcardListRouter /> },
]
