import React from 'react';
import { View, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Message } from '../types/message';
import { COLORS } from '~/config/constants';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const bubbleStyle = message.isUser
    ? 'bg-green-500 ml-12 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
    : 'bg-gray-100 mr-12 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl';

  const textStyle = message.isUser ? 'text-white' : 'text-gray-800';

  return (
    <View className={`mb-3 ${message.isUser ? 'items-end' : 'items-start'}`}>
      <View className={`max-w-xs px-4 py-3 ${bubbleStyle}`}>
        {message.isMarkdown ? (
          <Markdown
            style={{
              body: { color: message.isUser ? COLORS.WHITE : COLORS.GRAY_800 },
              paragraph: { marginTop: 0, marginBottom: 8 },
              strong: { fontWeight: 'bold' },
              em: { fontStyle: 'italic' },
              list_item: { marginBottom: 4 },
            }}>
            {message.text}
          </Markdown>
        ) : (
          <Text className={`text-base ${textStyle}`}>{message.text}</Text>
        )}
      </View>
      <Text className="mt-1 px-2 text-xs text-gray-500">
        {message.timestamp.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo',
        })}
      </Text>
    </View>
  );
};

export default MessageBubble;
