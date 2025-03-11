import { Chat, Message } from '../types';
import { supabase } from './supabase';

// 사용자의 모든 채팅 가져오기
export async function getChats(userId: string): Promise<Chat[]> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
    
  if (error) {
    throw new Error(error.message);
  }
  
  const chatsWithMessages = await Promise.all(
    data.map(async (chat) => {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chat.id)
        .order('timestamp', { ascending: true });
        
      if (messagesError) {
        throw new Error(messagesError.message);
      }
      
      // API 응답 형식을 프론트엔드 타입에 맞게 변환
      return {
        id: chat.id,
        title: chat.title,
        messages: messagesData.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp).getTime()
        })),
        settings: JSON.parse(chat.settings),
        createdAt: new Date(chat.created_at).getTime(),
        updatedAt: new Date(chat.updated_at).getTime(),
      };
    })
  );
  
  return chatsWithMessages;
}

// 새 채팅 생성
export async function createChat(userId: string, chat: Chat): Promise<Chat> {
  const { data, error } = await supabase
    .from('chats')
    .insert([
      {
        id: chat.id,
        title: chat.title,
        user_id: userId,
        settings: JSON.stringify(chat.settings),
        created_at: new Date(chat.createdAt).toISOString(),
        updated_at: new Date(chat.updatedAt).toISOString()
      }
    ])
    .select()
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  if (chat.messages && chat.messages.length > 0) {
    await addMessages(chat.id, chat.messages);
  }
  
  return {
    id: data.id,
    title: data.title,
    messages: chat.messages || [],
    settings: JSON.parse(data.settings),
    createdAt: new Date(data.created_at).getTime(),
    updatedAt: new Date(data.updated_at).getTime(),
  };
}

// 메시지 추가
export async function addMessage(chatId: string, message: Message): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        id: message.id,
        chat_id: chatId,
        role: message.role,
        content: message.content,
        timestamp: new Date(message.timestamp).toISOString()
      }
    ])
    .select()
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  // 채팅의 updated_at 갱신
  await supabase
    .from('chats')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', chatId);
    
  return {
    id: data.id,
    role: data.role,
    content: data.content,
    timestamp: new Date(data.timestamp).getTime()
  };
}

// 여러 메시지 추가
export async function addMessages(chatId: string, messages: Message[]): Promise<void> {
  const messagesForInsert = messages.map(msg => ({
    id: msg.id,
    chat_id: chatId,
    role: msg.role,
    content: msg.content,
    timestamp: new Date(msg.timestamp).toISOString()
  }));
  
  const { error } = await supabase
    .from('messages')
    .insert(messagesForInsert);
    
  if (error) {
    throw new Error(error.message);
  }
}

// 채팅 삭제
export async function deleteChat(chatId: string): Promise<void> {
  // 먼저 관련 메시지 삭제
  const { error: messagesError } = await supabase
    .from('messages')
    .delete()
    .eq('chat_id', chatId);
    
  if (messagesError) {
    throw new Error(messagesError.message);
  }
  
  // 그 다음 채팅 삭제
  const { error: chatError } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId);
    
  if (chatError) {
    throw new Error(chatError.message);
  }
}

// 채팅 제목 업데이트
export async function updateChatTitle(chatId: string, title: string): Promise<void> {
  const { error } = await supabase
    .from('chats')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', chatId);
    
  if (error) {
    throw new Error(error.message);
  }
} 