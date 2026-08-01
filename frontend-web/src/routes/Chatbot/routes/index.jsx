import Chatbot from '../pages';

export class ChatbotRoute {
    static moduleRoute = "/chat-assistant"
}

export const chatbotRoutes = [
    { path: ChatbotRoute.moduleRoute, element: <Chatbot /> },
]
