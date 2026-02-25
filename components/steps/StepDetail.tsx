import React from 'react';
import { StepCard } from '../StepCard';
import { Spinner } from '../Spinner';
import { SuggestionButton } from '../SuggestionButton';
import { PencilIcon } from '../icons';
import { LoadingState, WordCount, BlogPost } from '../../types';

interface StepDetailProps {
    activeStep: number;
    setActiveStep: (step: number) => void;
    topic: string;
    setTopic: (topic: string) => void;
    suggestedKeywords: string[];
    keywords: string[];
    handleKeywordToggle: (keyword: string) => void;
    suggestedTags: string[];
    tags: string[];
    handleTagToggle: (tag: string) => void;
    targetAudience: string;
    setTargetAudience: (audience: string) => void;
    wordCount: WordCount;
    setWordCount: (count: WordCount) => void;
    authorInsight: string;
    setAuthorInsight: (insight: string) => void;
    handleGeneratePost: () => void;
    loading: LoadingState;
    post: BlogPost | null;
}

export const StepDetail: React.FC<StepDetailProps> = ({
    activeStep,
    setActiveStep,
    topic,
    setTopic,
    suggestedKeywords,
    keywords,
    handleKeywordToggle,
    suggestedTags,
    tags,
    handleTagToggle,
    targetAudience,
    setTargetAudience,
    wordCount,
    setWordCount,
    authorInsight,
    setAuthorInsight,
    handleGeneratePost,
    loading,
    post,
}) => {
    const formInputClass = "block w-full px-4 py-3 text-base bg-white border-2 border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary rounded-xl shadow-sm transition-colors";

    const WordCountButton = ({ value, label }: { value: WordCount; label: string }) => (
        <button onClick={() => setWordCount(value)} className={`px-4 py-2 text-base font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${wordCount === value ? "bg-brand-primary text-white hover:bg-brand-dark focus:ring-brand-dark" : "bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-brand-secondary"}`}>
            {label}
        </button>
    );

    return (
        <StepCard
            number={2}
            title="내용 상세화"
            description="글의 방향성을 더 명확하게 하여 결과물 품질을 높여보세요."
            isActive={activeStep === 2}
            isCompleted={!!post}
            onClickHeader={() => { if (topic) setActiveStep(2); }}
        >
            <div>
                <label htmlFor="topic" className="block text-base font-semibold text-slate-800">
                    글 주제<span className="text-red-500 ml-1">*</span>
                </label>
                <input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="AI가 추천한 주제를 선택하거나 직접 입력하세요" className={`mt-2 ${formInputClass}`} />
            </div>
            <div className="mt-6">
                <label className="block text-base font-semibold text-slate-800">주요 키워드 및 태그 <span className="text-sm font-normal text-slate-500">(선택 사항)</span></label>
                {loading === LoadingState.KeywordsAndTags && <div className="flex items-center gap-2 mt-2 text-base text-slate-500"><Spinner /> 키워드와 태그를 생성 중입니다...</div>}
                {suggestedKeywords.length > 0 && (
                    <div className="mt-3">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">추천 키워드</h4>
                        <div className="mt-2 flex flex-wrap gap-3">
                            {suggestedKeywords.map(kw => (<SuggestionButton key={kw} text={kw} onClick={() => handleKeywordToggle(kw)} isActive={keywords.includes(kw)} />))}
                        </div>
                    </div>
                )}
                {suggestedTags.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">추천 태그</h4>
                        <div className="mt-2 flex flex-wrap gap-3">
                            {suggestedTags.map(tag => (<SuggestionButton key={tag} text={`#${tag}`} onClick={() => handleTagToggle(tag)} isActive={tags.includes(tag)} />))}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">선택 사항 (품질 향상)</h3>
                <p className="text-base text-slate-500 mb-4">AI가 더 좋은 글을 쓸 수 있도록 추가 정보를 제공해주세요.</p>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="targetAudience" className="block text-base font-semibold text-slate-800">타겟 독자</label>
                        <input id="targetAudience" type="text" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="예: AI 기술에 관심 많은 30대 직장인" className={`mt-2 ${formInputClass}`} />
                    </div>
                    <div>
                        <label className="block text-base font-semibold text-slate-800">총 글자 수</label>
                        <div className="mt-3 flex items-center gap-3 flex-wrap">
                            <WordCountButton value="short" label="짧은 글 (~800자)" />
                            <WordCountButton value="medium" label="중간 글 (~1200자)" />
                            <WordCountButton value="long" label="긴 글 (1500자+)" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="authorInsight" className="block text-base font-semibold text-slate-800">필자의 실제 인사이트</label>
                        <textarea id="authorInsight" value={authorInsight} onChange={e => setAuthorInsight(e.target.value)} rows={4} placeholder="글에 담고 싶은 자신의 경험이나 독특한 관점을 1-2문단으로 입력하세요." className={`mt-2 ${formInputClass}`}></textarea>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <button onClick={handleGeneratePost} disabled={!topic || loading === LoadingState.Post || loading === LoadingState.KeywordsAndTags} className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-brand-secondary text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-600/50 disabled:bg-slate-400 transition-transform transform hover:scale-105">
                    {loading === LoadingState.Post ? <Spinner /> : <><PencilIcon className="w-7 h-7" />블로그 글 생성하기</>}
                </button>
            </div>
        </StepCard>
    );
};
