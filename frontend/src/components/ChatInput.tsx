import { useState, type KeyboardEvent } from "react";
import { PaperPlaneRight } from "phosphor-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end space-x-2 max-w-4xl mx-auto">
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
          <textarea
            className="flex-1 bg-transparent outline-none resize-none text-base text-gray-800 placeholder-gray-500 max-h-32"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            rows={1}
            maxLength={500}
          />
        </div>

        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            message.trim() && !isLoading
              ? "bg-green-500 hover:bg-green-600 cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
        >
          <PaperPlaneRight
            size={20}
            weight="fill"
            className={
              message.trim() && !isLoading ? "text-white" : "text-gray-500"
            }
          />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
