import React, { useState } from 'react';
import { NotionIcon, SettingsIcon, CheckIcon, ChevronDownIcon } from './icons';

export const NotionSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isConfigured = true; 

  return (
    <div className={`bg-white rounded-2xl shadow-lg transition-all duration-300 ${isOpen ? 'ring-2 ring-brand-secondary' : ''}`}>
        <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-6 sm:p-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${isConfigured ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                       {isConfigured ? <CheckIcon className="w-8 h-8" /> : <SettingsIcon className="w-8 h-8" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                           <NotionIcon className="w-7 h-7" />
                           Notion 연동 설정
                        </h2>
                        <p className={`mt-1 text-base ${isConfigured ? 'text-green-600' : 'text-slate-500'}`}>
                            {isConfigured ? '서버에 설정이 구성되었습니다.' : '생성한 글을 Notion에 영구 저장하세요.'}
                        </p>
                    </div>
                </div>
                 <ChevronDownIcon className={`w-8 h-8 text-slate-400 flex-shrink-0 ml-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
        </button>

      {isOpen && (
        <div className="px-8 pb-8 animate-fade-in">
          <div className="border-t border-slate-200 pt-8 space-y-4">
             <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-6 rounded-lg text-base space-y-4">
                <div>
                  <p className="font-bold text-lg">개발자 안내</p>
                  <p className="mt-2">이 앱이 정상적으로 작동하려면 서버 환경 변수 설정이 필수입니다. 로컬 개발 시에는 Vercel CLI 사용을 권장합니다.</p>
                </div>
                
                <div>
                    <h4 className="font-semibold text-base">로컬 개발 (Local Development)</h4>
                    <p className="mt-1">프로젝트 최상단에 <code className="font-mono text-sm bg-blue-100 p-1 rounded">.env.local</code> 파일을 생성하고 다음 변수들을 추가하세요. 그 후 터미널에서 <code className="font-mono text-sm bg-blue-100 p-1 rounded">vercel dev</code> 명령어로 앱을 실행하세요.</p>
                    <pre className="mt-2 font-mono text-sm bg-slate-100 p-4 rounded-md overflow-x-auto text-slate-700">
{`GEMINI_API_KEY="여러분의 제미나이 API 키"
NOTION_API_KEY="여러분의 노션 API 키"
NOTION_DATABASE_ID="여러분의 노션 데이터베이스 ID"`}
                    </pre>
                </div>

                <div>
                    <h4 className="font-semibold text-base">배포 환경 (Vercel 등)</h4>
                    <p className="mt-1">호스팅 플랫폼의 프로젝트 설정에서 아래 환경 변수들을 직접 설정해야 합니다.</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 font-mono text-sm bg-blue-100 p-3 rounded-md">
                        <li>GEMINI_API_KEY</li>
                        <li>NOTION_API_KEY</li>
                        <li>NOTION_DATABASE_ID</li>
                    </ul>
                    <a href="https://vercel.com/docs/projects/environment-variables" target="_blank" rel="noopener noreferrer" className="text-brand-secondary font-semibold hover:underline mt-4 inline-block">
                        Vercel 환경 변수 설정 방법 알아보기 &rarr;
                    </a>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
