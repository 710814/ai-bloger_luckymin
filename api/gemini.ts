import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import type { RepurposeType, TranslateLanguage, WordCount } from '../types';

const parseJsonOrError = <T,>(text: string, errorMessage: string): T => {
  try {
    const cleanedText = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("JSON parsing error:", error, "Raw text:", text);
    throw new Error(errorMessage);
  }
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, apiKey, ...params } = request.body;
  const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

  if (!effectiveApiKey) {
    console.error("API Key is missing.");
    return response.status(500).json({ error: "Server configuration error: Gemini API Key is missing. Please provide it in settings or server env." });
  }

  const ai = new GoogleGenAI({ apiKey: effectiveApiKey });

  try {
    switch (action) {
      case 'generate_topics': {
        const { category, userInput } = params;
        let prompt: string;
        if (userInput) {
          prompt = `사용자가 입력한 다음 키워드/문장을 기반으로, SEO에 최적화된 흥미로운 블로그 글 주제 5개를 추천해줘: "${userInput}"`;
          if (category) prompt += ` 추천 시 "${category}" 카테고리의 특성을 반드시 고려해줘.`;
        } else if (category) {
          prompt = `"${category}" 카테고리에 대해, 최신 트렌드와 독자의 흥미를 고려하여 SEO에 최적화된 블로그 글 주제 5개를 추천해줘.`;
        } else {
          prompt = `최신 구글 트렌드, 기술, 경제, 문화 트렌드를 종합적으로 분석하여, 현재 사람들이 가장 관심을 가질 만한 흥미로운 블로그 글 주제 5개를 추천해줘.`;
        }
        prompt += `\n\n응답은 반드시 {"topics": ["주제1", "주제2", "주제3", "주제4", "주제5"]} 형식의 JSON 객체로만 제공해줘. 다른 설명은 절대 추가하지 마.`;

        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [{ text: prompt }] }
        });
        const responseText = result.text || '';
        const topics = parseJsonOrError<{ topics: string[] }>(responseText, 'Failed to parse topic ideas.').topics;
        return response.status(200).json({ topics });
      }

      case 'generate_keywords': {
        const { topic } = params;
        const prompt = `블로그 주제 "${topic}"에 대해 검색 엔진 최적화(SEO)에 가장 효과적인 핵심 키워드를 10개 추천해줘. 짧은 키워드와 긴 키워드(롱테일)를 조화롭게 섞어서 제안해줘. 응답은 반드시 {"keywords": ["키워드1", "키워드2", ...]} 형식의 JSON 객체로만 제공해줘. 다른 설명은 절대 추가하지 마.`;
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [{ text: prompt }] },
        });
        const keywords = parseJsonOrError<{ keywords: string[] }>(result.text || '', 'Failed to parse keywords.').keywords;
        return response.status(200).json({ keywords });
      }

      case 'generate_tags': {
        const { topic } = params;
        const prompt = `블로그 주제 "${topic}"에 대해 SEO에 도움이 되고 검색 노출에 유리한, 관련성 높은 태그를 10개 추천해줘. 응답은 반드시 {"tags": ["태그1", "태그2", ...]} 형식의 JSON 객체로만 제공해줘. 다른 설명은 절대 추가하지 마.`;
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [{ text: prompt }] }
        });
        const tags = parseJsonOrError<{ tags: string[] }>(result.text || '', 'Failed to parse tags.').tags;
        return response.status(200).json({ tags });
      }

      case 'convert_to_html': {
        const { markdown } = params;
        const prompt = `Please convert the following GitHub Flavored Markdown into HTML. Only return the HTML content, with no other explanations or code fences. Do not wrap the output in markdown backticks.\n\nMarkdown:\n${markdown}`;
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [{ text: prompt }] },
        });
        return response.status(200).json({ html: (result.text || '').trim() });
      }

      case 'generate_blog_post': {
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');
        response.setHeader('Transfer-Encoding', 'chunked');

        const { topic, keywords, tags, targetAudience, authorInsight, wordCount, category } = params;
        const getWordCountInstruction = (wc: WordCount) => {
          switch (wc) {
            case 'short': return "약 800자 내외의 짧고 간결한 글로 작성해줘.";
            case 'medium': return "약 1200자 내외의 충분한 정보를 담은 글로 작성해줘.";
            case 'long': return "1500자 이상의 깊이 있고 상세한 글로 작성해줘.";
            default: return "";
          }
        }
        const mainContentPrompt = `
You are an expert SEO blog writer.
Write a high-quality blog post in Korean, using GitHub Flavored Markdown, based on the following information.

**Topic:** "${topic}"
${keywords && keywords.length > 0 ? `**Keywords:** ${keywords.join(', ')}` : ''}
${tags && tags.length > 0 ? `**Tags:** ${tags.map((t: string) => `#${t}`).join(' ')}` : ''}
${targetAudience ? `**Target Audience:** ${targetAudience}` : ''}
${authorInsight ? `**Author's Insight:** Please incorporate this unique perspective: "${authorInsight}"` : ''}
${wordCount ? `**Word Count:** ${getWordCountInstruction(wordCount)}` : ''}
${category ? `**Category:** "${category}"` : ''}

**Crucial Requirement: Image Placeholders**
- Your response **MUST** include 1-2 image placeholders embedded naturally within the body of the post.
- Use this exact format: \`[IMAGE_PROMPT: A detailed, artistic image generation prompt in English, ALT_TEXT: SEO-optimized alt text in Korean about the image]\`
- Example: A section about AI's future might include \`[IMAGE_PROMPT: A futuristic cityscape with holographic data streams and robots interacting with humans, photorealistic style, ALT_TEXT: AI와 인간이 공존하는 미래 도시의 모습]\`

The blog post structure should include:
1.  An engaging introduction.
2.  A well-structured body with H2 (##) and H3 (###) headings.
3.  A conclusion that summarizes the key points.
4.  An FAQ section with 2-3 relevant questions and answers, where each question is an H3 (###) heading.
5.  Incorporate 2-3 real, relevant hyperlinks to authoritative external websites in this format: \`[Link Text](https://example.com)\`

Important: Your entire response must strictly follow this format, with no extra text, explanations, or markdown code blocks:
[TITLE_START]The generated blog post title goes here.[TITLE_END][CONTENT_START]The full Markdown content of the blog post goes here.[CONTENT_END]
`;

        try {
          const stream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: mainContentPrompt }] },
            config: {
              temperature: 0.7,
            },
          });

          for await (const chunk of stream) {
            response.write(chunk.text);
          }

          response.end();
        } catch (error) {
          console.error('Error during stream generation:', error);
          if (!response.writableEnded) {
            response.status(500).json({ error: '스트림 생성에 실패했습니다.' });
          }
        }
        return;
      }

      case 'repurpose_content': {
        const { title, content, type } = params as { title: string; content: string; type: RepurposeType };
        let prompt = '';
        const baseContent = `**원본 블로그 글 제목:** ${title}\n**원본 콘텐츠 (Markdown):**\n${content}`;

        switch (type) {
          case 'youtubeScript':
            prompt = `${baseContent}\n\n위 블로그 글을 기반으로, 시청자의 흥미를 끌 수 있는 유튜브 영상 스크립트를 작성해줘. 오프닝, 본문, 아웃트로를 포함하고, 각 장면에 어울리는 시각적 요소(B-roll)이나 자막 아이디어도 함께 제안해줘. 응답은 반드시 {"script": "유튜브 스크립트 내용..."} 형식의 JSON 객체로만 제공해줘.`;
            break;
          case 'shortsIdeas':
            prompt = `${baseContent}\n\n위 블로그 글의 핵심 내용을 바탕으로, 사람들이 공유하고 싶어할 만한 유튜브 숏츠 영상 아이디어 3가지를 제안해줘. 각 아이디어는 (1) 매력적인 제목, (2) 15초 내외의 간략한 스크립트, (3) 추천 음악이나 효과에 대한 제안을 포함해야 해. 응답은 반드시 다음 형식의 JSON 객체로만 제공해줘: {"ideas": [{"title": "아이디어1 제목", "script": "스크립트 내용", "suggestion": "추천 사항"}, {"title": "아이디어2 제목", "script": "스크립트 내용", "suggestion": "추천 사항"}, {"title": "아이디어3 제목", "script": "스크립트 내용", "suggestion": "추천 사항"}]}`;
            break;
          case 'threadsPosts':
            prompt = `${baseContent}\n\n위 블로그 글을 홍보하기 위한 Threads 게시물 3개를 작성해줘. 각 게시물은 글의 핵심 내용을 요약하고, 이모티콘을 사용하며, 독자의 참여를 유도하는 질문이나 CTA를 포함해야 해. 응답은 반드시 다음 형식의 JSON 객체로만 제공해줘: {"posts": ["게시물1 내용", "게시물2 내용", "게시물3 내용"]}`;
            break;
        }

        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [{ text: prompt }] }
        });

        let repurposedResult;
        if (type === 'youtubeScript') repurposedResult = (parseJsonOrError<{ script: string }>(result.text || '', 'Failed to parse script')).script;
        if (type === 'shortsIdeas') repurposedResult = (parseJsonOrError<{ ideas: any[] }>(result.text || '', 'Failed to parse ideas')).ideas;
        if (type === 'threadsPosts') repurposedResult = (parseJsonOrError<{ posts: string[] }>(result.text || '', 'Failed to parse posts')).posts;

        return response.status(200).json({ result: repurposedResult });
      }

      case 'translate_content': {
        const { title, content, language } = params as { title: string; content: string; language: TranslateLanguage };
        const prompt = `
            다음 블로그 게시물의 제목과 마크다운 콘텐츠를 ${language}로 번역해줘.
            원문의 친근한 톤앤매너, 전문성, 그리고 마크다운 구조(헤더, 링크, 목록 등)를 완벽하게 유지해야 해. 문맥에 맞는 자연스러운 번역이 중요해.
            응답은 반드시 {"translatedTitle": "번역된 제목", "translatedContent": "번역된 마크다운 콘텐츠"} 형식의 JSON 객체로만 제공해줘.

            **제목:** ${title}
            **콘텐츠 (Markdown):**
            ${content}
          `;

        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [{ text: prompt }] }
        });

        const translation = parseJsonOrError<{ translatedTitle: string, translatedContent: string }>(result.text || '', `Failed to parse ${language} translation.`);
        return response.status(200).json({ translation });
      }

      default:
        return response.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error: any) {
    console.error(`Gemini Proxy Error for action '${action}':`, error);
    const errorMessage = error.message || 'An unknown error occurred in the Gemini proxy.';
    return response.status(500).json({ error: `Gemini API Error: ${errorMessage}` });
  }
}