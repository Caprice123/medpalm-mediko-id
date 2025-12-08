import Login from '@routes/Auth/pages/Login';
import Home from '@routes/Home';
import Dashboard from '@routes/Dashboard';
import AdminPanel from '@routes/Admin/AdminPanel';
import SessionDetail from '@routes/SessionDetail';
import FlashcardPage from '@routes/Flashcard';
import ExercisePage from '@routes/Exercise';
import UITest from '@routes/UITest';
import PrivateRoute from '@middleware/PrivateRoute';
import { AuthRoute } from './routes/Auth/routes';
import { calculatorRoutes } from './routes/Calculator/routes';
import { anatomyQuizRoutes } from './routes/AnatomyQuiz/routes';

const appRoutes = [
    { path: '/', element: <Home /> },
    { path: AuthRoute.signInRoute, element: <Login /> },
    { path: '/ui-test', element: <UITest /> },
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
                path: '/flashcards',
                element: (
                        <FlashcardPage />
                    
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
