import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Automatically adjust textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    };

    textarea.addEventListener('input', adjustHeight);
    return () => textarea.removeEventListener('input', adjustHeight);
  }, []);

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900 backdrop-blur-md backdrop-filter">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-zinc-200 shadow-sm min-h-[44px] max-h-[200px] text-sm"
            placeholder="메시지를 입력하세요..."
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
          <button
            className={`absolute right-2 bottom-2 rounded-full p-2 ${
              message.trim() && !disabled
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
            } transition-colors duration-200`}
            onClick={handleSendMessage}
            disabled={!message.trim() || disabled}
          >
            <FaPaperPlane size={14} className={disabled ? 'animate-pulse' : ''} />
          </button>
        </div>
        <div className="mt-2 text-xs text-center text-zinc-500 dark:text-zinc-400">
          Enter 키를 눌러 전송하고, Shift+Enter 키로 줄바꿈을 할 수 있습니다.
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 