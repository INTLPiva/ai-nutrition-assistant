import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '~/config/constants';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View className="flex-row items-center border-t border-gray-200 bg-white px-4 py-3">
        <View className="mr-2 flex-1 flex-row items-center rounded-full bg-gray-100 px-4 py-2">
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder="Digite sua mensagem..."
            placeholderTextColor={COLORS.GRAY_400}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            editable={!isLoading}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
        </View>

        <TouchableOpacity
          className={`h-12 w-12 items-center justify-center rounded-full pl-1 ${
            message.trim() && !isLoading ? 'bg-green-500' : 'bg-gray-300'
          }`}
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
          activeOpacity={0.7}>
          <Ionicons
            name="send"
            size={20}
            color={message.trim() && !isLoading ? COLORS.WHITE : COLORS.GRAY_400}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInput;
