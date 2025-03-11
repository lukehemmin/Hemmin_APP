import { useState } from 'react';
import { signUp, signIn } from '../../utils/auth';

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password);
        alert('회원가입이 완료되었습니다. 이메일 확인 후 로그인해주세요.');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        onLogin();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
        {isSignUp ? '회원가입' : '로그인'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
            이메일
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mb-4 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
        </button>
      </form>
      
      <div className="text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
        </button>
      </div>
    </div>
  );
} 