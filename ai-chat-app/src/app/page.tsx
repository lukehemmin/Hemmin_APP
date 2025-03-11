'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Chat, ChatSettings } from '../types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import Auth from './components/Auth';
import { sendMessage } from './services/api';
import {
  generateId,
  generateChatTitle,
} from './utils/helpers';
import { getChats, createChat, addMessage, deleteChat } from '../utils/chatService';
import { useAuth } from './context/AuthContext';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const [settings, setSettings] = useState<ChatSettings>({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  });

  useEffect(() => {
    // 다크 모드 설정 불러오기
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // 로그인된 사용자의 채팅 데이터 불러오기
    const loadChats = async () => {
      if (user) {
        try {
          const userChats = await getChats(user.id);
          setChats(userChats);
          if (userChats.length > 0) {
            setActiveChat(userChats[0]);
          }
        } catch (error) {
          console.error('Error loading chats:', error);
        }
      }
    };

    if (user && !authLoading) {
      loadChats();
    }
  }, [user, authLoading]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNewChat = async () => {
    if (!user) return;
    
    const now = Date.now();
    const newChat: Chat = {
      id: generateId(),
      title: '새 채팅',
      messages: [],
      settings,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const createdChat = await createChat(user.id, newChat);
      setChats([createdChat, ...chats]);
      setActiveChat(createdChat);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);
      const updatedChats = chats.filter((chat) => chat.id !== chatId);
      setChats(updatedChats);
      
      if (activeChat?.id === chatId) {
        setActiveChat(updatedChats.length > 0 ? updatedChats[0] : null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat || !user) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    // 사용자 메시지 추가
    const updatedMessages = [...activeChat.messages, userMessage];
    const updatedChat = {
      ...activeChat,
      messages: updatedMessages,
      title: activeChat.messages.length === 0 ? generateChatTitle([userMessage]) : activeChat.title,
      updatedAt: Date.now(),
    };

    // 상태 업데이트
    const updatedChats = chats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat));
    setChats(updatedChats);
    setActiveChat(updatedChat);

    try {
      // Supabase에 메시지 저장
      await addMessage(activeChat.id, userMessage);
      
      // AI 응답 요청
      setLoading(true);
      const response = await sendMessage(updatedMessages, settings);
      
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      // Supabase에 AI 응답 저장
      await addMessage(activeChat.id, assistantMessage);

      // AI 응답 추가
      const finalMessages = [...updatedMessages, assistantMessage];
      const finalChat = {
        ...updatedChat,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      // 상태 업데이트
      const finalChats = chats.map((chat) => (chat.id === activeChat.id ? finalChat : chat));
      setChats(finalChats);
      setActiveChat(finalChat);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // 오류 처리 로직 추가
    } finally {
      setLoading(false);
    }
  };

  // 사용자가 로그인하지 않았을 경우 인증 화면 표시
  if (!user && !authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Auth onLogin={() => {}} />
      </div>
    );
  }

  // 인증 로딩 중일 경우 로딩 화면 표시
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-pulse flex space-x-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenSettings={() => setSettingsOpen(true)}
        onSignOut={signOut}
        userName={user?.email || '사용자'}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-2 border-b border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
          </button>
        </div>
        {activeChat ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-50 dark:bg-zinc-950">
              <div className="max-w-3xl mx-auto">
                {activeChat.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">AI 채팅 어시스턴트</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
                      질문이나 대화를 시작하세요. AI가 답변해 드립니다.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full">
                      <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                        <h3 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">일반적인 질문</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">AI에게 어떤 질문이든 물어보세요.</p>
                      </div>
                      <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                        <h3 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">코드 작성</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">프로그래밍 문제 해결을 도와드립니다.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 py-4">
                    {activeChat.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {loading && (
                      <div className="flex justify-center py-4">
                        <div className="animate-pulse flex space-x-2">
                          <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full"></div>
                          <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full"></div>
                          <div className="w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-zinc-50 dark:bg-zinc-950">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">AI 채팅 어시스턴트에 오신 것을 환영합니다</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
              왼쪽 사이드바에서 새 채팅을 시작하세요.
            </p>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2"
              onClick={handleNewChat}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              새 채팅 시작하기
            </button>
          </div>
        )}
      </div>
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />
    </div>
  );
}
