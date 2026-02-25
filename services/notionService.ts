import type { BlogPost } from '../types';

const PROXY_ENDPOINT = '/api/notion';

export const savePostToNotion = async (post: BlogPost, context: { category: string; userInputIdea: string; tags: string[] }, apiKey?: string, databaseId?: string): Promise<string> => {
    try {
        const response = await fetch(PROXY_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'save_post',
                post,
                context,
                apiKey,
                databaseId
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || 'Notion 저장에 실패했습니다.');
        }

        const data = await response.json();
        return data.pageId;
    } catch (error) {
        console.error("Error saving to Notion:", error);
        throw error;
    }
};
