import { useState, useEffect, useRef } from "react";
import { ArrowLeft, CircleNotch } from "phosphor-react";
import MessageBubble from "../components/MessageBubble";
import LoadingIndicator from "../components/LoadingIndicator";
import ChatInput from "../components/ChatInput";
import NutritionPlanScreen from "./NutritionPlanScreen";
import type { Message, ChatState } from "../types/message";
import { sendMessage, type MessageResponse } from "../services/apiService";
import {
  generateSessionId,
  saveSessionId,
  getSessionId,
} from "../services/storageService";

const ChatScreen: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    isCompleted: false,
    sessionId: null,
    lastApiResponse: null,
  });

  const [isStarted, setIsStarted] = useState(false);
  const [showNutritionPlan, setShowNutritionPlan] = useState(false);
  const [planData, setPlanData] = useState<{
    text: string;
    apiResponse: MessageResponse;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessionId();
  }, []);

  const loadSessionId = () => {
    const existingSessionId = getSessionId();
    setChatState((prev) => ({ ...prev, sessionId: existingSessionId }));
  };

  const startConversation = async () => {
    try {
      const newSessionId = generateSessionId();
      saveSessionId(newSessionId);

      setChatState((prev) => ({
        ...prev,
        sessionId: newSessionId,
        isLoading: true,
        messages: [],
        isCompleted: false,
        lastApiResponse: null,
      }));

      setIsStarted(true);
      setShowNutritionPlan(false);
      setPlanData(null);

      const response = await sendMessage({
        sessionId: newSessionId,
        message: "olá",
      });

      const botMessage: Message = {
        id: Date.now().toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        isMarkdown: false,
      };

      setChatState((prev) => ({
        ...prev,
        messages: [botMessage],
        isLoading: false,
        isCompleted: response.json.completed,
        lastApiResponse: response,
      }));
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert(
        "Não foi possível iniciar a conversa. Verifique sua conexão e tente novamente."
      );
      setChatState((prev) => ({ ...prev, isLoading: false }));
      setIsStarted(false);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!chatState.sessionId || chatState.isCompleted) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const response = await sendMessage({
        sessionId: chatState.sessionId,
        message: messageText,
      });

      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        isCompleted: response.json.completed,
        lastApiResponse: response,
      }));

      if (response.json.completed) {
        setPlanData({
          text: response.text,
          apiResponse: response,
        });
        setShowNutritionPlan(true);

        setChatState((prev) => ({
          ...prev,
          messages: [],
        }));
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          isUser: false,
          timestamp: new Date(),
          isMarkdown: false,
        };

        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Não foi possível enviar a mensagem. Tente novamente.");
      setChatState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleGoBackToStart = () => {
    setIsStarted(false);
    setShowNutritionPlan(false);
    setPlanData(null);
    setChatState({
      messages: [],
      isLoading: false,
      isCompleted: false,
      sessionId: null,
      lastApiResponse: null,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  if (showNutritionPlan && planData) {
    return (
      <NutritionPlanScreen
        planText={planData.text}
        apiResponse={planData.apiResponse}
        onGoBack={handleGoBackToStart}
      />
    );
  }

  if (!isStarted) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <div className="bg-green-500 px-6 py-4">
          <h1 className="text-white text-xl font-bold text-center">
            NutriFácil
          </h1>
          <p className="text-green-100 text-center mt-1">
            Seu assistente pessoal de nutrição
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-6">
          <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <img src="icon.png" alt="Nutricionista IA" className="w-24 h-24" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
            Bem-vindo!
          </h2>

          <p className="text-gray-600 text-center mb-8 leading-6 max-w-md">
            Vou te ajudar a criar um plano alimentar personalizado baseado nas
            suas necessidades e preferências.
          </p>

          <button
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-colors"
            onClick={startConversation}
            disabled={chatState.isLoading}
          >
            {chatState.isLoading ? (
              <div className="flex items-center space-x-2">
                <CircleNotch size={20} weight="bold" className="animate-spin" />
                <span>Iniciando...</span>
              </div>
            ) : (
              "Começar conversa"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="bg-green-500 px-4 py-3 flex items-center shadow-md">
        <button
          onClick={handleGoBackToStart}
          className="mr-3 text-white hover:bg-green-600 rounded-full p-2 transition-colors"
        >
          <ArrowLeft size={24} weight="bold" />
        </button>
        <div className="flex-1">
          <h1 className="text-white text-lg font-bold">NutriFácil</h1>
          <p className="text-green-100 text-sm">
            {chatState.isCompleted ? "Consulta finalizada" : "Online"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {chatState.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {chatState.isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {!chatState.isCompleted && (
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={chatState.isLoading}
        />
      )}
    </div>
  );
};

export default ChatScreen;
