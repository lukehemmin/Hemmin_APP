import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, model, temperature, max_tokens } = body;

    // 여기에 실제 AI API 호출 코드를 구현해야 합니다
    // 예: OpenAI API, Claude API 등
    
    // 모의 응답 (실제 구현에서는 이 부분을 대체해야 합니다)
    const lastMessage = messages[messages.length - 1];
    let responseText = '';
    
    if (lastMessage.role === 'user') {
      const userMessage = lastMessage.content.toLowerCase();
      
      if (userMessage.includes('안녕') || userMessage.includes('hello')) {
        responseText = '안녕하세요! 무엇을 도와드릴까요?';
      } else if (userMessage.includes('도움') || userMessage.includes('help')) {
        responseText = '저는 AI 어시스턴트입니다. 질문이나 정보가 필요하시면 언제든지 물어보세요.';
      } else if (userMessage.includes('날씨') || userMessage.includes('weather')) {
        responseText = '죄송합니다, 현재 실시간 날씨 정보에 접근할 수 없습니다. 하지만 날씨에 관한 일반적인 질문에는 답변할 수 있습니다.';
      } else {
        responseText = `"${lastMessage.content}"에 대한 답변입니다. 이것은 모의 응답입니다. 실제 AI API 연동이 필요합니다.`;
      }
    }

    // 응답 지연 시뮬레이션 (실제 구현에서는 제거)
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ message: responseText });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: '메시지 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 