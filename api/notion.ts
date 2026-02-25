import type { VercelRequest, VercelResponse } from '@vercel/node';

const markdownToNotionBlocks = (markdown: string) => {
  const blocks: any[] = [];
  const paragraphs = markdown.replace(/\r\n/g, '\n').split(/\n{2,}/);

  for (const p of paragraphs) {
    if (!p.trim()) continue;
    const lines = p.split('\n');
    let currentListItems: any[] = [];
    let listType: 'bulleted_list_item' | 'numbered_list_item' | null = null;

    const flushList = () => {
      if (currentListItems.length > 0) {
        blocks.push(...currentListItems);
        currentListItems = [];
      }
      listType = null;
    };

    for (const line of lines) {
      if (!line.trim()) continue;
      if (line.startsWith('### ')) { flushList(); blocks.push({ type: 'heading_3', heading_3: { rich_text: [{ type: 'text', text: { content: line.substring(4) } }] } }); continue; }
      if (line.startsWith('## ')) { flushList(); blocks.push({ type: 'heading_2', heading_2: { rich_text: [{ type: 'text', text: { content: line.substring(3) } }] } }); continue; }
      if (line.startsWith('# ')) { flushList(); blocks.push({ type: 'heading_1', heading_1: { rich_text: [{ type: 'text', text: { content: line.substring(2) } }] } }); continue; }
      const bulletMatch = line.match(/^(\s*)[-*]\s(.*)/);
      if (bulletMatch) { if (listType !== 'bulleted_list_item') flushList(); listType = 'bulleted_list_item'; currentListItems.push({ type: 'bulleted_list_item', bulleted_list_item: { rich_text: [{ type: 'text', text: { content: bulletMatch[2] } }] } }); continue; }
      const numberedMatch = line.match(/^(\s*)\d+\.\s(.*)/);
      if (numberedMatch) { if (listType !== 'numbered_list_item') flushList(); listType = 'numbered_list_item'; currentListItems.push({ type: 'numbered_list_item', numbered_list_item: { rich_text: [{ type: 'text', text: { content: numberedMatch[2] } }] } }); continue; }
      flushList();
      const imageMatch = line.match(/\[IMAGE_PROMPT: (.*?), ALT_TEXT: (.*?)\]/);
      if (imageMatch) {
        const promptText = imageMatch[1]; const altText = imageMatch[2];
        blocks.push({ type: 'callout', callout: { rich_text: [{ type: 'text', text: { content: `[AI 이미지 추천] ${altText}` } }], icon: { type: 'emoji', emoji: '🖼️' }, color: 'gray_background' } });
        blocks.push({ type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: `(생성 프롬프트: ${promptText})` } }] } });
        continue;
      }
      const richText = []; let lastIndex = 0; const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g; let match;
      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) richText.push({ type: 'text', text: { content: line.substring(lastIndex, match.index) } });
        richText.push({ type: 'text', text: { content: match[1], link: { url: match[2] } } });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) richText.push({ type: 'text', text: { content: line.substring(lastIndex) } });
      blocks.push({ type: 'paragraph', paragraph: { rich_text: richText } });
    }
    flushList();
  }
  return blocks.map(block => ({ object: 'block', ...block }));
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, post, context, apiKey, databaseId } = request.body;

  const NOTION_API_KEY = apiKey || process.env.NOTION_API_KEY;
  const NOTION_DATABASE_ID = databaseId || process.env.NOTION_DATABASE_ID;
  const NOTION_API_URL = 'https://api.notion.com/v1';
  const NOTION_VERSION = '2022-06-28';

  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.error("Notion API Key or Database ID is missing.");
    return response.status(500).json({ error: "Server configuration error: Notion API Key or Database ID is missing. Please provide them in settings or server env." });
  }

  const headers = { 'Authorization': `Bearer ${NOTION_API_KEY}`, 'Content-Type': 'application/json', 'Notion-Version': NOTION_VERSION };

  try {
    switch (action) {
      case 'save_post': {
        if (!post || !post.markdownContent) return response.status(400).json({ error: "Post content is required." });
        const properties: any = { Title: { title: [{ text: { content: post.title } }] } };
        if (context?.category) properties.Category = { select: { name: context.category } };
        if (context?.userInputIdea) properties.Idea = { rich_text: [{ text: { content: context.userInputIdea } }] };
        if (context?.tags && context.tags.length > 0) properties.Tags = { multi_select: context.tags.map((tag: string) => ({ name: tag })) };
        const notionBlocks = markdownToNotionBlocks(post.markdownContent);
        const newPageResponse = await fetch(`${NOTION_API_URL}/pages`, { method: 'POST', headers, body: JSON.stringify({ parent: { database_id: NOTION_DATABASE_ID }, properties, children: notionBlocks.slice(0, 100) }) });
        if (!newPageResponse.ok) { const errorBody = await newPageResponse.json(); throw new Error(errorBody.message || 'Failed to create page'); }
        const newPageData = await newPageResponse.json();
        if (notionBlocks.length > 100) {
          for (let i = 100; i < notionBlocks.length; i += 100) {
            await fetch(`${NOTION_API_URL}/blocks/${newPageData.id}/children`, { method: 'PATCH', headers, body: JSON.stringify({ children: notionBlocks.slice(i, i + 100) }) });
          }
        }
        return response.status(201).json({ pageId: newPageData.id });
      }

      default:
        return response.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error: any) {
    console.error(`Notion Proxy Error for action '${action}':`, error);
    return response.status(500).json({ error: `Notion API Error: ${error.message}` });
  }
}