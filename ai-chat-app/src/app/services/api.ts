import axios from 'axios';
import { Message, ChatSettings } from '../types';

// 실제 API 엔드포인트로 대체해야 합니다
const API_URL = '/api';

export const sendMessage = async (
  messages: Message[],
  settings: ChatSettings
): Promise<string> => {
  try {
    const response = await axios.post('/api/chat', {
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      model: settings.model,
      temperature: settings.temperature,
      max_tokens: settings.maxTokens
    });
    
    return response.data.message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('메시지 전송 중 오류가 발생했습니다.');
  }
}; 