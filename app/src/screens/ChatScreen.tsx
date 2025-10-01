import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import MessageBubble from '../components/MessageBubble';
import LoadingIndicator from '../components/LoadingIndicator';
import ChatInput from '../components/ChatInput';
import NutritionPlanScreen from './NutritionPlanScreen';
import { Message, ChatState } from '../types/message';
import { MessageResponse, sendMessage } from '../services/apiService';
import { generateSessionId, saveSessionId, getSessionId } from '../services/storageService';
import { COLORS } from '~/config/constants';

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
  const [planData, setPlanData] = useState<{ text: string; apiResponse: MessageResponse } | null>(
    null
  );
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadSessionId();
  }, []);

  const loadSessionId = async () => {
    const existingSessionId = await getSessionId();
    setChatState((prev) => ({ ...prev, sessionId: existingSessionId }));
  };

  const startConversation = async () => {
    try {
      const newSessionId = generateSessionId();
      await saveSessionId(newSessionId);

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
        message: 'olá',
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
      console.error('Error starting conversation:', error);
      Alert.alert(
        'Erro',
        'Não foi possível iniciar a conversa. Verifique sua conexão e tente novamente.'
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
      console.error('Error sending message:', error);
      Alert.alert('Erro', 'Não foi possível enviar a mensagem. Tente novamente.');
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

  const renderMessage = ({ item }: { item: Message }) => <MessageBubble message={item} />;

  const scrollToBottom = () => {
    if (flatListRef.current && chatState.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <View className="flex-1 bg-white">
        <View className="bg-green-500 px-6 py-6">
          <Text className="text-center text-xl font-bold text-white">Nutricionista IA</Text>
          <Text className="mt-1 text-center text-green-100">
            Seu assistente pessoal de nutrição
          </Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-green-50">
            <Ionicons name="nutrition" size={48} color={COLORS.PRIMARY} />
          </View>

          <Text className="mb-3 text-center text-2xl font-bold text-gray-800">Bem-vindo!</Text>

          <Text className="mb-8 text-center leading-6 text-gray-600">
            Vou te ajudar a criar um plano alimentar personalizado baseado nas suas necessidades e
            preferências.
          </Text>

          <TouchableOpacity
            className="rounded-full bg-green-500 px-8 py-4 shadow-lg"
            onPress={startConversation}
            disabled={chatState.isLoading}
            activeOpacity={0.8}>
            {chatState.isLoading ? (
              <ActivityIndicator color={COLORS.WHITE} />
            ) : (
              <Text className="text-lg font-semibold text-white">Começar conversa</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center bg-green-500 px-4 py-6">
        <TouchableOpacity onPress={handleGoBackToStart} className="mr-3">
          <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-white">Nutricionista IA</Text>
          <Text className="text-sm text-green-100">
            {chatState.isCompleted ? 'Consulta finalizada' : 'Online'}
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={chatState.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={chatState.isLoading ? <LoadingIndicator /> : null}
      />

      {!chatState.isCompleted && (
        <ChatInput onSendMessage={handleSendMessage} isLoading={chatState.isLoading} />
      )}
    </View>
  );
};

export default ChatScreen;
