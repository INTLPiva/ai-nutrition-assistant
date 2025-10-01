import ReactMarkdown from "react-markdown";
import type { Message } from "../types/message";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const bubbleStyle = message.isUser
    ? "bg-green-500 ml-auto rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
    : "bg-gray-100 mr-auto rounded-tl-2xl rounded-tr-2xl rounded-br-2xl";

  const textStyle = message.isUser ? "text-white" : "text-gray-800";

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
  };

  return (
    <div
      className={`mb-3 flex ${
        message.isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-[70%]">
        <div className={`px-4 py-3 ${bubbleStyle}`}>
          {message.isMarkdown ? (
            <div className={textStyle}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 mb-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-4 mb-2">{children}</ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          ) : (
            <p className={`text-base ${textStyle} whitespace-pre-wrap`}>
              {message.text}
            </p>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 px-2">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
