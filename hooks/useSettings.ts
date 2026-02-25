import { useState, useEffect } from 'react';

export interface ApiKeys {
    geminiApiKey: string;
    notionApiKey: string;
    notionDatabaseId: string;
}

const STORAGE_KEY = 'ai_blog_generator_api_keys';

export const useSettings = () => {
    const [apiKeys, setApiKeys] = useState<ApiKeys>({
        geminiApiKey: '',
        notionApiKey: '',
        notionDatabaseId: '',
    });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const storedKeys = localStorage.getItem(STORAGE_KEY);
        if (storedKeys) {
            try {
                setApiKeys(JSON.parse(storedKeys));
            } catch (e) {
                console.error("Failed to parse stored API keys", e);
            }
        }
    }, []);

    const saveApiKeys = (newKeys: ApiKeys) => {
        setApiKeys(newKeys);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newKeys));
        setIsSettingsOpen(false);
    };

    const openSettings = () => setIsSettingsOpen(true);
    const closeSettings = () => setIsSettingsOpen(false);

    return {
        apiKeys,
        saveApiKeys,
        isSettingsOpen,
        openSettings,
        closeSettings,
    };
};
