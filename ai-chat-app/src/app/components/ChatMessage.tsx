import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaUser, FaRobot } from 'react-icons/fa';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`mb-4 ${isUser ? 'pr-4' : 'pl-4'}`}>
      <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`rounded-2xl p-4 ${
            isUser 
              ? 'bg-blue-600 text-white rounded-br-none shadow-sm' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-none shadow-sm'
          }`}>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                // @ts-ignore
                components={{
                  // @ts-ignore
                  code({ className, children }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      // @ts-ignore
                      <SyntaxHighlighter
                        // @ts-ignore
                        style={atomDark}
                        // @ts-ignore
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md text-sm"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`${className} bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded text-sm`}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-2 last:mb-0">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 last:mb-0">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  a: ({ href, children }) => (
                    <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
          <div className={`text-xs text-zinc-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className={`flex-shrink-0 ${isUser ? 'order-1' : 'order-2'}`}>
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
              <FaUser size={14} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <FaRobot size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 