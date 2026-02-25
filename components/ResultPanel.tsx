import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Spinner } from './Spinner';
import { GeneratedPost } from './GeneratedPost';
import { ActionCard } from './ActionCard';
import { PencilIcon, YoutubeIcon, SparklesIcon, ThreadsIcon, TranslateIcon } from './icons';
import { LoadingState, BlogPost, RepurposeType, TranslateLanguage } from '../types';
import { useModal } from '../contexts/ModalContext';
import { useToast } from '../contexts/ToastContext';

interface ResultPanelProps {
    loading: LoadingState;
    loadingDetail: string | null;
    post: BlogPost | null;
    notionError: boolean;
    handleSavePost: () => void;
    handleRepurpose: (type: RepurposeType) => void;
    repurposedContent: Record<string, any>;
    handleTranslate: (lang: TranslateLanguage) => void;
    translatedPost: Record<string, { title: string; content: string }>;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
    loading,
    loadingDetail,
    post,
    notionError,
    handleSavePost,
    handleRepurpose,
    repurposedContent,
    handleTranslate,
    translatedPost,
}) => {
    const { showSuccess, showError } = useModal();
    const { success: showSuccessToast, info } = useToast();

    const onSavePost = () => {
        handleSavePost();
        // Note: We'll need to modify useBlogGenerator to call modal on success/error
    };

    const onRepurpose = (type: RepurposeType) => {
        handleRepurpose(type);
        info('콘텐츠를 생성하고 있습니다...');
    };

    const onTranslate = (lang: TranslateLanguage) => {
        handleTranslate(lang);
        info('번역을 진행하고 있습니다...');
    };
    return (
        <div id="right-column" className="space-y-8 overflow-y-auto pr-4 -mr-4">
            {loading === LoadingState.Post && (
                <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-white rounded-2xl shadow-lg animate-fade-in">
                    <Spinner large={true} />
                    <p className="mt-6 text-xl text-slate-600 font-semibold">AI가 당신의 이야기를 만들고 있습니다...</p>
                    <p className="text-base text-slate-500">잠시만 기다려주세요. 멋진 글이 곧 완성됩니다!</p>
                </div>
            )}

            {!post && loading !== LoadingState.Post && (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl shadow-lg animate-fade-in">
                    <PencilIcon className="w-20 h-20 text-slate-300" />
                    <h3 className="mt-6 text-2xl font-semibold text-slate-700">블로그 글이 여기에 표시됩니다.</h3>
                    <p className="mt-2 text-base text-slate-500">좌측의 정보를 입력하고 '블로그 글 생성하기'를 눌러주세요.</p>
                </div>
            )}

            {post && (
                <div className="animate-slide-in-up">
                    <GeneratedPost post={post} onSave={onSavePost} isSaved={!!post.pageId} isSaving={loading === LoadingState.SavingPost} hasError={notionError} />
                </div>
            )}

            {/* SNS 콘텐츠 변환 및 블로그 포스트 번역 영역 숨김 처리 */}
            {/* {post && (
                <>
                    <ActionCard title="SNS 콘텐츠로 변환">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button onClick={() => onRepurpose('youtubeScript')} disabled={loading === LoadingState.Repurpose} className="p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 flex items-center justify-center gap-2 disabled:opacity-50 font-semibold">
                                {loadingDetail === 'youtubeScript' ? <Spinner /> : <><YoutubeIcon className="w-6 h-6" /> 유튜브 스크립트</>}
                            </button>
                            <button onClick={() => onRepurpose('shortsIdeas')} disabled={loading === LoadingState.Repurpose} className="p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 flex items-center justify-center gap-2 disabled:opacity-50 font-semibold">
                                {loadingDetail === 'shortsIdeas' ? <Spinner /> : <><SparklesIcon className="w-6 h-6" /> 숏츠 아이디어</>}
                            </button>
                            <button onClick={() => onRepurpose('threadsPosts')} disabled={loading === LoadingState.Repurpose} className="p-4 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 flex items-center justify-center gap-2 disabled:opacity-50 font-semibold">
                                {loadingDetail === 'threadsPosts' ? <Spinner /> : <><ThreadsIcon className="w-6 h-6" /> Threads 게시물</>}
                            </button>
                        </div>
                        {repurposedContent.youtubeScript && <div className="mt-4 p-4 bg-slate-100 rounded-lg whitespace-pre-wrap font-mono text-base">{repurposedContent.youtubeScript}</div>}
                        {repurposedContent.shortsIdeas && <div className="mt-4 p-4 bg-slate-100 rounded-lg">{repurposedContent.shortsIdeas.map((idea: any, i: number) => <div key={i} className="mb-2 p-3 border-b border-slate-200"><h4 className="font-bold text-lg">{idea.title}</h4><p className="text-base">{idea.script}</p><p className="text-sm text-slate-500 italic mt-1">{idea.suggestion}</p></div>)}</div>}
                        {repurposedContent.threadsPosts && <div className="mt-4 p-4 bg-slate-100 rounded-lg space-y-3">{repurposedContent.threadsPosts.map((p: string, i: number) => <p key={i} className="p-3 border rounded-md bg-white text-base whitespace-pre-wrap">{p}</p>)}</div>}
                    </ActionCard>

                    <ActionCard title="블로그 포스트 번역">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button onClick={() => onTranslate('English')} disabled={loading === LoadingState.Translate} className="p-4 bg-sky-50 text-sky-700 rounded-xl hover:bg-sky-100 flex items-center justify-center gap-2 disabled:opacity-50 font-semibold">
                                {loadingDetail === 'English' ? <Spinner /> : <><TranslateIcon className="w-6 h-6" /> 영어 (English)</>}
                            </button>
                            <button onClick={() => onTranslate('Chinese')} disabled={loading === LoadingState.Translate} className="p-4 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50 font-semibold">
                                {loadingDetail === 'Chinese' ? <Spinner /> : <><TranslateIcon className="w-6 h-6" /> 중국어 (中文)</>}
                            </button>
                            <button onClick={() => onTranslate('Spanish')} disabled={loading === LoadingState.Translate} className="p-4 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50 font-semibold">
                                {loadingDetail === 'Spanish' ? <Spinner /> : <><TranslateIcon className="w-6 h-6" /> 스페인어 (Español)</>}
                            </button>
                        </div>
                        {Object.entries(translatedPost).map(([lang, translated]) => (
                            <div key={lang} className="mt-4 p-6 bg-slate-100 rounded-lg">
                                <h4 className="font-bold text-2xl">{(translated as any).title}</h4>
                                <div className="prose max-w-none mt-4 prose-headings:font-bold prose-a:text-brand-primary prose-img:rounded-xl">
                                    <ReactMarkdown>{(translated as any).content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </ActionCard>
                </>
            )} */}
        </div>
    );
};
