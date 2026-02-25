import React, { useMemo } from 'react';
import { useBlogGenerator } from './hooks/useBlogGenerator';
import { useSettings } from './hooks/useSettings';
import { StepTopic } from './components/steps/StepTopic';
import { StepDetail } from './components/steps/StepDetail';
import { ResultPanel } from './components/ResultPanel';
import { SettingsModal } from './components/SettingsModal';
import { SparklesIcon, PlusIcon, SettingsIcon } from './components/icons';
import { ModalProvider } from './contexts/ModalContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProgressSteps, Step } from './components/ui/ProgressSteps';

const App: React.FC = () => {
  const { apiKeys, saveApiKeys, isSettingsOpen, openSettings, closeSettings } = useSettings();

  const {
    activeStep, setActiveStep,
    category, setCategory,
    userInputIdea, setUserInputIdea,
    suggestedTopics,
    topic, setTopic,
    suggestedKeywords,
    keywords, handleKeywordToggle,
    suggestedTags,
    tags, handleTagToggle,
    targetAudience, setTargetAudience,
    wordCount, setWordCount,
    authorInsight, setAuthorInsight,
    post,
    repurposedContent,
    translatedPost,
    loading,
    loadingDetail,
    error,
    notionError,
    handleStartNewPost,
    handleGetTopicIdeas,
    handleSelectTopic,
    handleGeneratePost,
    handleRepurpose,
    handleTranslate,
    handleSavePost
  } = useBlogGenerator(apiKeys);

  // Calculate progress steps
  const steps: Step[] = useMemo(() => [
    {
      id: 1,
      label: '주제 선택',
      description: '글 주제 정하기',
      status: topic ? 'completed' : activeStep === 1 ? 'current' : 'upcoming',
    },
    {
      id: 2,
      label: '상세 입력',
      description: '키워드 및 옵션',
      status: post ? 'completed' : activeStep === 2 ? 'current' : 'upcoming',
    },
    {
      id: 3,
      label: '생성 완료',
      description: '블로그 글 확인',
      status: post ? 'completed' : 'upcoming',
    },
  ], [topic, post, activeStep]);

  const handleStepClick = (stepId: number) => {
    if (stepId === 1 && topic) {
      setActiveStep(1);
    } else if (stepId === 2 && topic) {
      setActiveStep(2);
    }
  };

  return (
    <ModalProvider>
      <ToastProvider>
        <div className="h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
          <header className="bg-white/80 backdrop-blur-lg shadow-sm z-10 shrink-0 border-b border-slate-200">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SparklesIcon className="w-10 h-10 text-brand-primary" />
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI SEO 블로그 글 생성기</h1>
              </div>
              <button
                onClick={openSettings}
                className="p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-100 rounded-full transition-colors"
                title="설정"
              >
                <SettingsIcon className="w-7 h-7" />
              </button>
            </div>
          </header>

          <ProgressSteps steps={steps} onStepClick={handleStepClick} />

          <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-screen-2xl w-full mx-auto overflow-hidden px-4 sm:px-6 lg:px-8 py-8">
            <div className="overflow-y-auto pr-4 -mr-4 space-y-6">
              <div className="animate-fade-in">
                <button onClick={handleStartNewPost} className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-brand-primary border-2 border-brand-primary text-lg font-bold rounded-xl shadow-md hover:bg-brand-light transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-primary/50">
                  <PlusIcon className="w-6 h-6" />
                  새로운 글 생성하기
                </button>
              </div>

              <StepTopic
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                category={category}
                setCategory={setCategory}
                userInputIdea={userInputIdea}
                setUserInputIdea={setUserInputIdea}
                topic={topic}
                suggestedTopics={suggestedTopics}
                handleGetTopicIdeas={handleGetTopicIdeas}
                handleSelectTopic={handleSelectTopic}
                loading={loading}
              />

              <StepDetail
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                topic={topic}
                setTopic={setTopic}
                suggestedKeywords={suggestedKeywords}
                keywords={keywords}
                handleKeywordToggle={handleKeywordToggle}
                suggestedTags={suggestedTags}
                tags={tags}
                handleTagToggle={handleTagToggle}
                targetAudience={targetAudience}
                setTargetAudience={setTargetAudience}
                wordCount={wordCount}
                setWordCount={setWordCount}
                authorInsight={authorInsight}
                setAuthorInsight={setAuthorInsight}
                handleGeneratePost={handleGeneratePost}
                loading={loading}
                post={post}
              />
            </div>

            <ResultPanel
              loading={loading}
              loadingDetail={loadingDetail}
              post={post}
              notionError={notionError}
              handleSavePost={handleSavePost}
              handleRepurpose={handleRepurpose}
              repurposedContent={repurposedContent}
              handleTranslate={handleTranslate}
              translatedPost={translatedPost}
            />
          </main>

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={closeSettings}
            apiKeys={apiKeys}
            onSave={saveApiKeys}
          />
        </div>
      </ToastProvider>
    </ModalProvider>
  );
};

export default App;