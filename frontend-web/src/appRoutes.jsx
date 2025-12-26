import Login from '@routes/Auth/pages/Login';
import Home from '@routes/Home';
import Dashboard from '@routes/Dashboard';
import AdminPanel from '@routes/Admin/AdminPanel';
import SessionDetail from '@routes/SessionDetail';
import ExercisePage from '@routes/Exercise';
import UITest from '@routes/UITest';
import EditorTest from '@routes/EditorTest';
import PrivateRoute from '@middleware/PrivateRoute';
import { AuthRoute } from './routes/Auth/routes';
import { calculatorRoutes } from './routes/Calculator/routes';
import { anatomyQuizRoutes } from './routes/AnatomyQuiz/routes';
import { summaryNotesRoutes } from './routes/SummaryNotes/routes';
import { multipleChoiceRoutes } from './routes/MultipleChoice/routes';
import { flashcardRoutes } from './routes/Flashcard/routes';
import { chatbotRoutes } from './routes/Chatbot/routes';
import { skripsiRoutes } from './routes/SkripsiBuilder/routes';

const appRoutes = [
    { path: '/', element: <Home /> },
    { path: AuthRoute.signInRoute, element: <Login /> },
    { path: '/ui-test', element: <UITest /> },
    { path: '/editor-test', element: <EditorTest /> },
    {
        path: "/",
        element: <PrivateRoute />,
        children: [
            {
                path: '/dashboard',
                element: (
                        <Dashboard />
                    
                )
            },
            {
                path: '/exercises',
                element: (
                        <ExercisePage />

                )
            },
            ...anatomyQuizRoutes,
            ...calculatorRoutes,
            ...summaryNotesRoutes,
            ...multipleChoiceRoutes,
            ...flashcardRoutes,
            ...chatbotRoutes,
            ...skripsiRoutes,
            {
                path: '/admin',
                element: (
                        <AdminPanel />

                )
            },
        ]
    }
];

export default appRoutes;
