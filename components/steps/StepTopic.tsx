import React from 'react';
import { StepCard } from '../StepCard';
import { Spinner } from '../Spinner';
import { SparklesIcon } from '../icons';
import { LoadingState } from '../../types';
import { useToast } from '../../contexts/ToastContext';

const BLOG_CATEGORIES = [
  "IT/기술", "경제/금융", "여행", "요리/음식", "건강/피트니스", "자기계발", "문화/예술", "일상",
];

interface StepTopicProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  category: string;
  setCategory: (category: string) => void;
  userInputIdea: string;
  setUserInputIdea: (idea: string) => void;
  topic: string;
  suggestedTopics: string[];
  handleGetTopicIdeas: () => void;
  handleSelectTopic: (topic: string) => void;
  loading: LoadingState;
}

export const StepTopic: React.FC<StepTopicProps> = ({
  activeStep,
  setActiveStep,
  category,
  setCategory,
  userInputIdea,
  setUserInputIdea,
  topic,
  suggestedTopics,
  handleGetTopicIdeas,
  handleSelectTopic,
  loading,
}) => {
  const { success } = useToast();
  const formInputClass = "block w-full px-4 py-3 text-base bg-white border-2 border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary rounded-xl shadow-sm transition-colors";

  const onSelectTopic = (selectedTopic: string) => {
    handleSelectTopic(selectedTopic);
    success('주제가 선택되었습니다');
  };

  return (
    <StepCard
      number={1}
      title="아이디어 얻기"
      description="AI에게 글의 주제를 추천받으세요."
      isActive={activeStep === 1}
      isCompleted={!!topic}
      onClickHeader={() => setActiveStep(1)}
      summary={
        <div className="space-y-3 text-base text-slate-600">
          <div><span className="font-semibold text-slate-700">카테고리:</span><span className="ml-2 bg-slate-100 px-3 py-1 rounded-lg">{category || '전체 트렌드'}</span></div>
          {topic && <div><span className="font-semibold text-slate-700">선택한 주제:</span><p className="mt-2 p-3 bg-slate-100 border border-slate-200 rounded-lg">{topic}</p></div>}
        </div>
      }
    >
      <label htmlFor="category" className="block text-base font-semibold text-slate-800">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-sm mr-2">1</span>
        카테고리 선택 <span className="text-sm font-normal text-slate-500">(선택 사항)</span>
      </label>
      <select id="category" value={category} onChange={e => setCategory(e.target.value)} className={`mt-2 ${formInputClass}`}>
        <option value="">전체 트렌드</option>
        {BLOG_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <div className="mt-6 relative"><div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-300" /></div><div className="relative flex justify-center"><span className="bg-white px-3 text-base text-slate-500">또는</span></div></div>
      <div className="mt-6">
        <label htmlFor="userInputIdea" className="block text-base font-semibold text-slate-800">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-white text-sm mr-2">2</span>
          키워드/문장 직접 입력 <span className="text-sm font-normal text-slate-500">(선택 사항)</span>
        </label>
        <input id="userInputIdea" type="text" value={userInputIdea} onChange={e => setUserInputIdea(e.target.value)} placeholder="예: 생성형 AI의 미래, 여름 휴가 여행지 추천" className={`mt-2 ${formInputClass}`} />
      </div>
      <button onClick={handleGetTopicIdeas} disabled={loading === LoadingState.TopicIdeas} className="mt-6 w-full flex items-center justify-center gap-3 px-6 py-3 bg-brand-primary text-white text-lg font-bold rounded-xl shadow-md hover:bg-brand-dark disabled:bg-slate-400 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-primary/50">
        {loading === LoadingState.TopicIdeas ? <Spinner /> : <><SparklesIcon className="w-6 h-6" />AI에게 아이디어 얻기</>}
      </button>
      {suggestedTopics.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">추천 주제 (하나를 선택하세요)</h4>
          {suggestedTopics.map((suggTopic) => (
            <button key={suggTopic} onClick={() => onSelectTopic(suggTopic)} className={`w-full text-left p-4 rounded-xl transition text-base ${topic === suggTopic ? 'bg-blue-100 text-blue-800 font-semibold ring-2 ring-blue-400' : 'bg-slate-100 hover:bg-slate-200'}`}>{suggTopic}</button>
          ))}
        </div>
      )}
    </StepCard>
  );
};
