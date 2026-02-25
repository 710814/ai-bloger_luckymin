import type { BlogPost, RepurposeType, TranslateLanguage, WordCount } from '../types';

// This service is now a unified client for our secure Gemini proxy.
// All calls, both in development and production, go through the /api/gemini endpoint.
const PROXY_ENDPOINT = '/api/gemini';

const handleProxyResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Proxy API Error:', errorData);
        throw new Error(errorData.error || `AI 연동 중 서버 오류가 발생했습니다. 환경 변수 설정을 확인하세요.`);
    }
    return response.json();
};

const parseJsonOrError = <T,>(text: string, errorMessage: string): T => {
    try {
        // AI가 응답을 감싸는 ```json 마크다운을 제거합니다.
        const cleanedText = text.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("JSON parsing error:", error, "Raw text:", text);
        throw new Error(errorMessage);
    }
};


export const generateTopicIdeas = async (category?: string, userInput?: string, apiKey?: string): Promise<string[]> => {
    const response = await fetch(PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_topics', category, userInput, apiKey }),
    });
    const data = await handleProxyResponse(response);
    return data.topics;
};

export const generateKeywords = async (topic: string, apiKey?: string): Promise<string[]> => {
    const response = await fetch(PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_keywords', topic, apiKey }),
    });
    const data = await handleProxyResponse(response);
    return data.keywords;
}

export const generateTags = async (topic: string, apiKey?: string): Promise<string[]> => {
    const response = await fetch(PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_tags', topic, apiKey }),
    });
    const data = await handleProxyResponse(response);
    return data.tags;
}

export const convertMarkdownToHtml = async (markdown: string, apiKey?: string): Promise<string> => {
    if (!markdown) return '';
    try {
        const response = await fetch(PROXY_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'convert_to_html', markdown, apiKey }),
        });
        const data = await handleProxyResponse(response);
        return data.html;
    } catch (e) {
        console.error("Failed to convert Markdown to HTML via proxy:", e);
        return 'HTML 변환에 실패했습니다.';
    }
}

export const generateBlogPost = async (topic: string, keywords: string[], tags: string[], targetAudience: string, authorInsight: string, wordCount: WordCount, category?: string, apiKey?: string): Promise<BlogPost> => {
    let fullResponse = '';

    const response = await fetch(PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_blog_post', topic, keywords, tags, targetAudience, authorInsight, wordCount, category, apiKey }),
    });

    if (!response.ok || !response.body) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || `블로그 글 생성 중 서버 오류가 발생했습니다 (${response.status})`);
        } catch (e: any) {
            throw new Error(e.message || `블로그 글 생성 중 서버 오류가 발생했습니다 (${response.status})`);
        }
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value, { stream: true });
    }

    const titleMatch = fullResponse.match(/\[TITLE_START\](.*?)\[TITLE_END\]/s);
    const contentMatch = fullResponse.match(/\[CONTENT_START\](.*?)\[CONTENT_END\]/s);

    if (!titleMatch || !contentMatch) {
        console.error("Failed to parse streamed response:", fullResponse);
        throw new Error('AI 응답 형식이 올바르지 않아 글을 완성할 수 없습니다.');
    }

    const title = titleMatch[1].trim();
    const markdownContent = contentMatch[1].trim();

    return {
        id: Date.now().toString(),
        title,
        htmlContent: '', // Will be generated on demand
        markdownContent,
    };
};

export const generateRepurposedContent = async (title: string, content: string, type: RepurposeType, apiKey?: string) => {
    const response = await fetch(PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'repurpose_content', title, content, type, apiKey }),
    });
    const data = await handleProxyResponse(response);
    return data.result;
};

export const translateContent = async (title: string, content: string, language: TranslateLanguage, apiKey?: string): Promise<{ translatedTitle: string, translatedContent: string }> => {
    const response = await fetch(PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'translate_content', title, content, language, apiKey }),
    });
    const data = await handleProxyResponse(response);
    return data.translation;
};