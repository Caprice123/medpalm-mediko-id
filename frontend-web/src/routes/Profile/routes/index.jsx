import ProfileSetup from '../pages/Setup'

export class ProfileRoute {
  static setupRoute = '/profile/setup'
}

export const profileRoutes = [
  { path: ProfileRoute.setupRoute, element: <ProfileSetup /> },
]
