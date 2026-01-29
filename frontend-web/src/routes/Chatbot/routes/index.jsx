import { lazy, Suspense } from 'react';
import PageLoader from '@components/PageLoader';

const Chatbot = lazy(() => import('../index'));

const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader fullScreen={false} text="Loading Chatbot..." />}>
        {Component}
    </Suspense>
);

export class ChatbotRoute {
    static moduleRoute = "/chat-assistant"
}

export const chatbotRoutes = [
    { path: ChatbotRoute.moduleRoute, element: withSuspense(<Chatbot />) },
]
