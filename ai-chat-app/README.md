# AI 채팅 애플리케이션

Openwebui와 유사한 AI 채팅 웹 애플리케이션입니다. 이 프로젝트는 Next.js와 Tailwind CSS를 사용하여 구축되었습니다.

## 주요 기능

- 다양한 AI 모델과 채팅 (GPT-3.5, GPT-4, Claude 등)
- 채팅 기록 저장 및 관리
- 마크다운 및 코드 하이라이팅 지원
- 사용자 친화적인 인터페이스
- 모델 설정 조정 (temperature, max tokens 등)

## 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

1. 저장소를 클론합니다:

```bash
git clone https://github.com/yourusername/ai-chat-app.git
cd ai-chat-app
```

2. 의존성을 설치합니다:

```bash
npm install
# 또는
yarn install
```

3. 개발 서버를 실행합니다:

```bash
npm run dev
# 또는
yarn dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인합니다.

## 실제 AI API 연동하기

현재 이 애플리케이션은 모의 응답을 사용합니다. 실제 AI API를 연동하려면 다음 단계를 따르세요:

1. OpenAI, Anthropic 등의 API 키를 얻습니다.
2. `.env.local` 파일을 생성하고 API 키를 추가합니다:

```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

3. `src/app/api/chat/route.ts` 파일을 수정하여 실제 API 호출을 구현합니다.

## 기술 스택

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com/) - 스타일링
- [TypeScript](https://www.typescriptlang.org/) - 타입 안전성
- [React Markdown](https://github.com/remarkjs/react-markdown) - 마크다운 렌더링
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - 코드 하이라이팅

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
