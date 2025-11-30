import Login from '@routes/Auth/pages/Login';
import Home from '@routes/Home';
import Dashboard from '@routes/Dashboard';
import AdminPanel from '@routes/Admin/AdminPanel';
import SessionDetail from '@routes/SessionDetail';
import FlashcardPage from '@routes/Flashcard';
import ExercisePage from '@routes/Exercise';
import CalculatorPage from '@routes/Calculator';
import PrivateRoute from '@middleware/PrivateRoute';
import { AuthRoute } from './routes/Auth/routes';

const appRoutes = [
    { path: '/', element: <Home /> },
    { path: AuthRoute.signInRoute, element: <Login /> },
    {
        path: '/dashboard',
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    },
    {
        path: '/flashcards',
        element: (
            <PrivateRoute>
                <FlashcardPage />
            </PrivateRoute>
        )
    },
    {
        path: '/exercises',
        element: (
            <PrivateRoute>
                <ExercisePage />
            </PrivateRoute>
        )
    },
    {
        path: '/calculators',
        element: (
            <PrivateRoute>
                <CalculatorPage />
            </PrivateRoute>
        )
    },
    {
        path: '/admin',
        element: (
            <PrivateRoute>
                <AdminPanel />
            </PrivateRoute>
        )
    },
    {
        path: '/session/:sessionId',
        element: (
            <PrivateRoute>
                <SessionDetail />
            </PrivateRoute>
        )
    },
];

export default appRoutes;
