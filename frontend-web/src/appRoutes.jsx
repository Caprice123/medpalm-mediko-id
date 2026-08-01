import PrivateRoute from '@middleware/PrivateRoute';
import ProfileGuard from '@middleware/ProfileGuard';
import AppLayout from '@components/AppLayout';
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
import { atlasQuizRoutes } from './routes/AtlasQuiz/routes';
import { webinarRoutes } from './routes/Webinar/routes';
import { eventRoutes } from './routes/Event/routes';
import { challengeRoutes } from './routes/Challenge/routes';
import { profileRoutes } from './routes/Profile/routes';
import { dashboardRoutes } from './routes/Dashboard/routes';
import { topicHubRoutes } from './routes/TopicHub/routes';

import EmbedVideoPage from '@routes/EmbedVideo';
import Login from '@routes/Auth/pages/Login';
import Home from '@routes/Home';
import AdminPanel from '@routes/Admin/AdminPanel';
import UITest from '@routes/UITest';
import EditorTest from '@routes/EditorTest';
import SentryTest from '@routes/SentryTest/SentryTest';
import HtmlToDocxExample from '@components/HtmlToDocxExample';
import ExcalidrawBuilderMockup from '@mockups/ExcalidrawBuilder/ExcalidrawBuilderMockup';

const appRoutes = [
    { path: '/', element: <Home /> },
    { path: AuthRoute.signInRoute, element: <Login /> },
    { path: '/ui-test', element: <UITest /> },
    { path: '/sentry-test', element: <SentryTest /> },
    { path: '/editor-test', element: <EditorTest /> },
    { path: '/docx-test', element: <HtmlToDocxExample /> },
    { path: '/excalidraw-mockup', element: <ExcalidrawBuilderMockup /> },
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
                    // Embed pages — no AppLayout (no sidebar), rendered inside an <iframe>
                    { path: '/embed/video', element: <EmbedVideoPage /> },
                    {
                        path: "/",
                        element: <AppLayout />,
                        children: [
                            ...dashboardRoutes,
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
                            ...atlasQuizRoutes,
                            ...webinarRoutes,
                            ...eventRoutes,
                            ...challengeRoutes,
                            ...topicHubRoutes,
                            {
                                path: '/admin',
                                element: <AdminPanel />
                            },
                        ]
                    }
                ]
            }
        ]
    }
];

export default appRoutes;
