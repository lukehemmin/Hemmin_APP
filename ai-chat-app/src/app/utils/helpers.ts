import { v4 as uuidv4 } from 'uuid';
import { Message, Chat } from '../types';

export const generateId = (): string => {
  return uuidv4();
};

export const generateChatTitle = (messages: Message[]): string => {
  const userMessages = messages.filter((msg) => msg.role === 'user');
  if (userMessages.length === 0) return '새 채팅';
  
  const firstUserMessage = userMessages[0].content;
  const maxLength = 30;
  
  if (firstUserMessage.length <= maxLength) {
    return firstUserMessage;
  }
  
  return `${firstUserMessage.substring(0, maxLength)}...`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const saveChatsToLocalStorage = (chats: Chat[]): void => {
  try {
    localStorage.setItem('chats', JSON.stringify(chats));
  } catch (error) {
    console.error('Failed to save chats to localStorage:', error);
  }
};

export const getChatsFromLocalStorage = (): Chat[] => {
  try {
    const chatsJson = localStorage.getItem('chats');
    if (!chatsJson) return [];
    
    const chats = JSON.parse(chatsJson);
    
    // Date 객체로 변환
    return chats.map((chat: any) => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Failed to get chats from localStorage:', error);
    return [];
  }
}; 