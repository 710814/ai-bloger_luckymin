# AI SEO Blog Writer (AI SEO 블로그 글 생성기)

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

Google Gemini AI를 활용하여 SEO에 최적화된 블로그 글을 자동으로 생성하고, Notion에 바로 발행하거나 다양한 포맷으로 다운로드할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능 (Features)

*   **🤖 AI 기반 주제 추천**: 사용자의 관심사나 카테고리에 맞춰 트렌디한 블로그 주제를 제안합니다.
*   **📝 고품질 글 작성**: SEO 키워드와 태그를 포함한 전문적인 블로그 포스트를 생성합니다.
*   **🎨 이미지 프롬프트 생성**: 글의 내용에 어울리는 AI 이미지 생성 프롬프트를 함께 제공합니다.
*   **🔄 콘텐츠 재가공 (Repurposing)**: 작성된 글을 유튜브 스크립트, 숏츠 아이디어, Threads 게시물로 변환합니다.
*   **🌍 다국어 번역**: 작성된 글을 영어, 중국어, 스페인어로 번역합니다.
*   **💾 다양한 저장 옵션**:
    *   **Notion 연동**: 클릭 한 번으로 Notion 데이터베이스에 글을 저장합니다.
    *   **파일 다운로드**: Markdown(.md) 또는 HTML(.html) 형식으로 다운로드할 수 있습니다.
*   **⚙️ 간편한 설정**: API 키를 앱 내 설정 메뉴에서 안전하게 관리할 수 있습니다.

## 🚀 시작하기 (Getting Started)

### 필수 조건 (Prerequisites)
*   Node.js (v18 이상 권장)
*   Google Gemini API Key ([AI Studio](https://aistudio.google.com/)에서 발급)
*   (선택) Notion API Key & Database ID ([Notion Developers](https://developers.notion.com/)에서 발급)

### 설치 및 실행 (Installation & Run)

1. **저장소 클론 및 의존성 설치**
   ```bash
   git clone <repository-url>
   cd ai-seo-blog-writer
   npm install
   ```

2. **애플리케이션 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:3000`으로 접속합니다.

3. **API 키 설정**
   *   앱 우측 상단의 **설정(⚙️) 아이콘**을 클릭합니다.
   *   **Gemini API Key**를 입력합니다.
   *   (선택) Notion 연동을 원하시면 **Notion API Key**와 **Database ID**를 입력합니다.
   *   '저장하기'를 누르면 설정이 로컬 브라우저에 안전하게 저장됩니다.

## 🛠️ 기술 스택 (Tech Stack)
*   **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
*   **AI**: Google Gemini API (`@google/genai`)
*   **Integration**: Notion API
*   **Security**: `react-markdown` (XSS 방지), API Proxy (Serverless Functions)

## 🔒 보안 및 개인정보 (Security & Privacy)
*   API 키는 서버에 저장되지 않으며, 사용자의 브라우저(Local Storage)에만 저장됩니다.
*   API 호출은 Vercel Serverless Function을 통해 프록시되어 클라이언트 키 노출을 방지합니다.
*   생성된 콘텐츠는 `react-markdown`을 통해 렌더링되어 XSS 공격으로부터 안전합니다.

## 📦 배포 (Deployment)
이 프로젝트는 Vercel에 최적화되어 있습니다.

1. Vercel에 프로젝트를 임포트합니다.
2. (선택) 환경 변수(`GEMINI_API_KEY` 등)를 설정할 수 있지만, 앱 내 설정 기능을 사용하는 것을 권장합니다.
3. 배포가 완료되면 바로 사용할 수 있습니다.

