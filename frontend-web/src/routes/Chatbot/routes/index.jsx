import ChatPage from '../v2/pages/Chat'

export class ChatbotRoute {
    static moduleRoute = "/chat-assistant"
}

// `/chat-assistant` is served by the V2 page. The V1 implementation stays on
// disk under `../v1/pages` as the archived original and is no longer mounted
// anywhere; `/api/v1/chatbot` still serves it if it is ever remounted.
export const chatbotRoutes = [
    { path: ChatbotRoute.moduleRoute, element: <ChatPage /> },
]
