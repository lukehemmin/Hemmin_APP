import React, { useState } from 'react';
import { ChatSettings } from '../types';
import { FaTimes, FaCheck, FaInfoCircle } from 'react-icons/fa';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSaveSettings: (settings: ChatSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<ChatSettings>(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-md shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 transform transition-all">
        <div className="flex justify-between items-center p-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">설정</h2>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>
        <div className="p-5 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">AI 모델</label>
              <div className="relative">
                <select
                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
                  value={localSettings.model}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, model: e.target.value })
                  }
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Temperature: {localSettings.temperature.toFixed(1)}
                </label>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <FaInfoCircle size={12} />
                  <span>값이 높을수록 더 창의적인 응답을 생성합니다</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={localSettings.temperature}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    temperature: parseFloat(e.target.value),
                  })
                }
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                <span>정확함</span>
                <span>균형</span>
                <span>창의적</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  최대 토큰 수: {localSettings.maxTokens}
                </label>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <FaInfoCircle size={12} />
                  <span>AI가 생성할 수 있는 최대 토큰 수</span>
                </div>
              </div>
              <input
                type="range"
                min="256"
                max="4096"
                step="256"
                value={localSettings.maxTokens}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    maxTokens: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                <span>짧은 응답</span>
                <span>긴 응답</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <FaCheck size={12} /> 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 