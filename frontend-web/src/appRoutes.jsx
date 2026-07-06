import { Suspense } from 'react';
import lazyWithRetry from '@utils/lazyWithRetry';
const lazy = lazyWithRetry;
import PrivateRoute from '@middleware/PrivateRoute';
import ProfileGuard from '@middleware/ProfileGuard';
import PageLoader from '@components/PageLoader';
import { AuthRoute } from './routes/Auth/routes';
import { calculatorRoutes } from './routes/Calculator/routes';
import { diagnosticQuizRoutes } from './routes/DiagnosticQuiz/routes';
import { anatomyQuizRoutes } from './routes/AnatomyQuiz/routes';
import { summaryNotesRoutes } from './routes/SummaryNotes/routes';
import { multipleChoiceRoutes } from './routes/MultipleChoice/routes';
import { flashcardRoutes } from './routes/Flashcard/routes';
import { exerciseRoutes } from './routes/Exercise/routes';
import { chatbotRoutes } from './routes/Chatbot/routes';
import { skripsiRoutes } from './routes/SkripsiBuilder/routes';
import { topupRoutes } from './routes/Topup/routes';
import { oscePracticeRoutes } from './routes/OscePractice/routes';
import { atlasRoutes } from './routes/Atlas/routes';
import { webinarRoutes } from './routes/Webinar/routes';
import { eventRoutes } from './routes/Event/routes';
import { challengeRoutes } from './routes/Challenge/routes';
import { profileRoutes } from './routes/Profile/routes';

// Lazy load components
const Login = lazy(() => import('@routes/Auth/pages/Login'));
const Home = lazy(() => import('@routes/Home'));
const Dashboard = lazy(() => import('@routes/Dashboard'));
const AdminPanel = lazy(() => import('@routes/Admin/AdminPanel'));
const UITest = lazy(() => import('@routes/UITest'));
const EditorTest = lazy(() => import('@routes/EditorTest'));
const SentryTest = lazy(() => import('@routes/SentryTest/SentryTest'));
const HtmlToDocxExample = lazy(() => import('@components/HtmlToDocxExample'));
const ExcalidrawBuilderMockup = lazy(() => import('@mockups/ExcalidrawBuilder/ExcalidrawBuilderMockup'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader text="Loading..." size={200} />}>
        {Component}
    </Suspense>
);

const appRoutes = [
    { path: '/', element: withSuspense(<Home />) },
    { path: AuthRoute.signInRoute, element: withSuspense(<Login />) },
    { path: '/ui-test', element: withSuspense(<UITest />) },
    { path: '/sentry-test', element: withSuspense(<SentryTest />) },
    { path: '/editor-test', element: withSuspense(<EditorTest />) },
    { path: '/docx-test', element: withSuspense(<HtmlToDocxExample />) },
    { path: '/excalidraw-mockup', element: withSuspense(<ExcalidrawBuilderMockup />) },
    {
        path: "/",
        element: <PrivateRoute />,
        children: [
            // Profile setup — no ProfileGuard so users can reach it before completing profile
            ...profileRoutes,
            {
                // All other protected routes require a completed profile
                path: "/",
                element: <ProfileGuard />,
                children: [
                    {
                        path: '/dashboard',
                        element: withSuspense(<Dashboard />)
                    },
                    ...exerciseRoutes,
                    ...diagnosticQuizRoutes,
                    ...anatomyQuizRoutes,
                    ...calculatorRoutes,
                    ...summaryNotesRoutes,
                    ...multipleChoiceRoutes,
                    ...flashcardRoutes,
                    ...chatbotRoutes,
                    ...skripsiRoutes,
                    ...topupRoutes,
                    ...oscePracticeRoutes,
                    ...atlasRoutes,
                    ...webinarRoutes,
                    ...eventRoutes,
                    ...challengeRoutes,
                    {
                        path: '/admin',
                        element: withSuspense(<AdminPanel />)
                    },
                ]
            }
        ]
    }
];

export default appRoutes;
