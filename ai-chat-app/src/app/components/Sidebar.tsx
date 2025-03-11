import React from 'react';
import { Chat } from '../types';
import { FaPlus, FaTrash, FaCog, FaComments } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';

interface SidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onOpenSettings: () => void;
  onSignOut: () => Promise<void>;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenSettings,
  onSignOut,
  userName,
}) => {
  return (
    <div className="w-64 h-screen flex flex-col bg-zinc-100 border-r border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shrink-0 md:w-72">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          onClick={onNewChat}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          새 채팅
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {chats.length > 0 ? (
          <div className="space-y-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 ${
                  activeChat?.id === chat.id
                    ? 'bg-blue-50 text-blue-600 dark:bg-zinc-800 dark:text-blue-400'
                    : 'hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-300'
                }`}
                onClick={() => onSelectChat(chat)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{chat.title}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                    {formatDate(new Date(chat.updatedAt))}
                  </div>
                </div>
                <button
                  className="p-1 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700 opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  aria-label="채팅 삭제"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
            대화 내역이 없습니다.
            <br />
            새 채팅을 시작해보세요.
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        <div className="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div className="truncate">{userName}</div>
        </div>
        
        <button
          className="w-full flex items-center px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md"
          onClick={onOpenSettings}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          설정
        </button>
        
        <button
          className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md"
          onClick={onSignOut}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 