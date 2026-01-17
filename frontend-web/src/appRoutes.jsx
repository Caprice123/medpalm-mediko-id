import { lazy, Suspense } from 'react';
import PrivateRoute from '@middleware/PrivateRoute';
import PageLoader from '@components/PageLoader';
import { AuthRoute } from './routes/Auth/routes';
import { calculatorRoutes } from './routes/Calculator/routes';
import { anatomyQuizRoutes } from './routes/AnatomyQuiz/routes';
import { summaryNotesRoutes } from './routes/SummaryNotes/routes';
import { multipleChoiceRoutes } from './routes/MultipleChoice/routes';
import { flashcardRoutes } from './routes/Flashcard/routes';
import { exerciseRoutes } from './routes/Exercise/routes';
import { chatbotRoutes } from './routes/Chatbot/routes';
import { skripsiRoutes } from './routes/SkripsiBuilder/routes';
import { topupRoutes } from './routes/Topup/routes';
import { oscePracticeRoutes } from './routes/OscePractice/routes';

// Lazy load components
const Login = lazy(() => import('@routes/Auth/pages/Login'));
const Home = lazy(() => import('@routes/Home'));
const Dashboard = lazy(() => import('@routes/Dashboard'));
const AdminPanel = lazy(() => import('@routes/Admin/AdminPanel'));
const UITest = lazy(() => import('@routes/UITest'));
const EditorTest = lazy(() => import('@routes/EditorTest'));
const HtmlToDocxExample = lazy(() => import('@components/HtmlToDocxExample'));
const ExcalidrawBuilderMockup = lazy(() => import('@mockups/ExcalidrawBuilder/ExcalidrawBuilderMockup'));

// Wrapper to add Suspense to each route
const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader text="Loading..." size={200} />}>
        {Component}
    </Suspense>
);

const appRoutes = [
    { path: '/', element: withSuspense(<Home />) },
    { path: AuthRoute.signInRoute, element: withSuspense(<Login />) },
    { path: '/ui-test', element: withSuspense(<UITest />) },
    { path: '/editor-test', element: withSuspense(<EditorTest />) },
    { path: '/docx-test', element: withSuspense(<HtmlToDocxExample />) },
    { path: '/excalidraw-mockup', element: withSuspense(<ExcalidrawBuilderMockup />) },
    {
        path: "/",
        element: <PrivateRoute />,
        children: [
            {
                path: '/dashboard',
                element: withSuspense(<Dashboard />)
            },
            ...exerciseRoutes,
            ...anatomyQuizRoutes,
            ...calculatorRoutes,
            ...summaryNotesRoutes,
            ...multipleChoiceRoutes,
            ...flashcardRoutes,
            ...chatbotRoutes,
            ...skripsiRoutes,
            ...topupRoutes,
            ...oscePracticeRoutes,
            {
                path: '/admin',
                element: withSuspense(<AdminPanel />)
            },
        ]
    }
];

export default appRoutes;
