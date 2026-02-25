import { useState, useCallback } from 'react';
import { generateTopicIdeas, generateKeywords, generateTags, generateBlogPost, generateRepurposedContent, translateContent } from '../services/geminiService';
import { savePostToNotion } from '../services/notionService';
import { LoadingState, BlogPost, RepurposeType, TranslateLanguage, WordCount } from '../types';
import { ApiKeys } from './useSettings';

export const useBlogGenerator = (apiKeys: ApiKeys) => {
    const [activeStep, setActiveStep] = useState(1);
    const [category, setCategory] = useState<string>('');
    const [userInputIdea, setUserInputIdea] = useState<string>('');
    const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
    const [topic, setTopic] = useState<string>('');
    const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [targetAudience, setTargetAudience] = useState<string>('');
    const [wordCount, setWordCount] = useState<WordCount>('');
    const [authorInsight, setAuthorInsight] = useState<string>('');
    const [post, setPost] = useState<BlogPost | null>(null);
    const [repurposedContent, setRepurposedContent] = useState<Record<string, any>>({});
    const [translatedPost, setTranslatedPost] = useState<Record<string, { title: string; content: string }>>({});
    const [loading, setLoading] = useState<LoadingState>(LoadingState.Idle);
    const [loadingDetail, setLoadingDetail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notionError, setNotionError] = useState(false);

    const handleStartNewPost = () => {
        setActiveStep(1); setCategory(''); setUserInputIdea(''); setSuggestedTopics([]); setTopic('');
        setSuggestedKeywords([]); setKeywords([]); setSuggestedTags([]); setTags([]);
        setTargetAudience(''); setWordCount(''); setAuthorInsight(''); setPost(null);
        setRepurposedContent({}); setTranslatedPost({}); setError(null);
    };

    const resetStateFromTopic = () => {
        setTopic(''); setSuggestedKeywords([]); setKeywords([]); setSuggestedTags([]); setTags([]);
        setTargetAudience(''); setWordCount(''); setAuthorInsight(''); setPost(null);
        setRepurposedContent({}); setTranslatedPost({}); setActiveStep(1);
    };

    const handleGetTopicIdeas = useCallback(async () => {
        setLoading(LoadingState.TopicIdeas); setError(null); setSuggestedTopics([]); resetStateFromTopic();
        try {
            const result = await generateTopicIdeas(category, userInputIdea, apiKeys.geminiApiKey);
            setSuggestedTopics(result);
        } catch (e: any) { setError(e.message || '주제 아이디어를 생성하는 데 실패했습니다.'); }
        finally { setLoading(LoadingState.Idle); }
    }, [category, userInputIdea, apiKeys.geminiApiKey]);

    const handleGenerateKeywordsAndTags = useCallback(async (selectedTopic: string) => {
        if (!selectedTopic) return;
        setLoading(LoadingState.KeywordsAndTags); setError(null);
        setSuggestedKeywords([]); setKeywords([]); setSuggestedTags([]); setTags([]);
        try {
            const [keywordsResult, tagsResult] = await Promise.all([
                generateKeywords(selectedTopic, apiKeys.geminiApiKey), generateTags(selectedTopic, apiKeys.geminiApiKey)
            ]);
            setSuggestedKeywords(keywordsResult); setSuggestedTags(tagsResult);
        } catch (e: any) { setError(e.message || '키워드 및 태그를 생성하는 데 실패했습니다.'); }
        finally { setLoading(prev => prev === LoadingState.KeywordsAndTags ? LoadingState.Idle : prev); }
    }, [apiKeys.geminiApiKey]);

    const handleSelectTopic = useCallback((selectedTopic: string) => {
        setTopic(selectedTopic); handleGenerateKeywordsAndTags(selectedTopic); setActiveStep(2);
    }, [handleGenerateKeywordsAndTags]);

    const handleKeywordToggle = (keyword: string) => setKeywords(prev => prev.includes(keyword) ? prev.filter(k => k !== keyword) : [...prev, keyword]);
    const handleTagToggle = (tag: string) => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

    const handleGeneratePost = useCallback(async () => {
        if (!topic) return;
        setLoading(LoadingState.Post); setError(null); setPost(null); setRepurposedContent({}); setTranslatedPost({});
        try {
            const result = await generateBlogPost(topic, keywords, tags, targetAudience, authorInsight, wordCount, category, apiKeys.geminiApiKey);
            setPost(result);
        } catch (e: any) { setError(e.message || '블로그 글을 생성하는 데 실패했습니다.'); }
        finally { setLoading(LoadingState.Idle); }
    }, [category, topic, keywords, tags, targetAudience, authorInsight, wordCount, apiKeys.geminiApiKey]);

    const handleRepurpose = useCallback(async (type: RepurposeType) => {
        if (!post) return;
        setLoading(LoadingState.Repurpose); setLoadingDetail(type); setError(null);
        try {
            const result = await generateRepurposedContent(post.title, post.markdownContent, type, apiKeys.geminiApiKey);
            setRepurposedContent(prev => ({ ...prev, [type]: result }));
        } catch (e: any) { setError(e.message || `${type} 콘텐츠 생성에 실패했습니다.`); }
        finally { setLoading(LoadingState.Idle); setLoadingDetail(null); }
    }, [post, apiKeys.geminiApiKey]);

    const handleTranslate = useCallback(async (lang: TranslateLanguage) => {
        if (!post) return;
        setLoading(LoadingState.Translate); setLoadingDetail(lang); setError(null);
        try {
            const result = await translateContent(post.title, post.markdownContent, lang, apiKeys.geminiApiKey);
            setTranslatedPost(prev => ({ ...prev, [lang]: { title: result.translatedTitle, content: result.translatedContent } }));
        } catch (e: any) { setError(e.message || `${lang} 번역에 실패했습니다.`); }
        finally { setLoading(LoadingState.Idle); setLoadingDetail(null); }
    }, [post, apiKeys.geminiApiKey]);

    const handleSavePost = useCallback(async () => {
        if (!post || post.pageId) return;
        setLoading(LoadingState.SavingPost); setError(null);
        setNotionError(false);
        try {
            const context = { category, userInputIdea, tags };
            const newPageId = await savePostToNotion(post, context, apiKeys.notionApiKey, apiKeys.notionDatabaseId);
            setPost(prev => prev ? { ...prev, pageId: newPageId } : null);
        } catch (e: any) {
            setNotionError(true);
            setError(e.message || 'Notion에 글을 저장하는 데 실패했습니다.');
        } finally { setLoading(LoadingState.Idle); }
    }, [post, category, userInputIdea, tags, apiKeys.notionApiKey, apiKeys.notionDatabaseId]);

    return {
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
    };
};
