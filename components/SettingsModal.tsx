import React, { useState, useEffect } from 'react';
import { ApiKeys } from '../hooks/useSettings';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKeys: ApiKeys;
    onSave: (keys: ApiKeys) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKeys, onSave }) => {
    const [keys, setKeys] = useState<ApiKeys>(apiKeys);

    useEffect(() => {
        setKeys(apiKeys);
    }, [apiKeys, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setKeys(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(keys);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">설정</h2>
                    <p className="text-sm text-slate-500 mt-1">API 키를 입력하여 AI 기능을 활성화하세요.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="geminiApiKey" className="block text-sm font-medium text-slate-700 mb-1">
                            Gemini API Key
                            {apiKeys.geminiApiKey && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    ✓ 설정됨
                                </span>
                            )}
                        </label>
                        <input
                            type="password"
                            id="geminiApiKey"
                            name="geminiApiKey"
                            value={keys.geminiApiKey}
                            onChange={handleChange}
                            placeholder={apiKeys.geminiApiKey ? "••••••••••••••••••••••••••••••••" : "AI Studio에서 발급받은 키 입력"}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
                        />
                        <p className="text-xs text-slate-400 mt-1">Google AI Studio에서 무료로 발급받을 수 있습니다.</p>
                    </div>



                    <div className="flex items-center justify-end gap-3 pt-6 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-dark shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            저장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
