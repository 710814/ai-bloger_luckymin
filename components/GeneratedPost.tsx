import React, { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ClipboardIcon, CheckIcon, BookmarkIcon, DownloadIcon } from './icons';
import type { BlogPost } from '../types';
import { Spinner } from './Spinner';
import { convertMarkdownToHtml } from '../services/geminiService';
import { useToast } from '../contexts/ToastContext';
import { useModal } from '../contexts/ModalContext';

interface GeneratedPostProps {
  post: BlogPost;
  onSave: () => void;
  isSaved: boolean;
  isSaving: boolean;
  hasError: boolean;
}

type Tab = 'Preview' | 'Markdown' | 'HTML';

export const GeneratedPost: React.FC<GeneratedPostProps> = ({ post, onSave, isSaved, isSaving, hasError }) => {
  const { success, error: showErrorToast } = useToast();
  const { showSuccess, showError } = useModal();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Preview');
  const [htmlContent, setHtmlContent] = useState(post.htmlContent || '');
  const [isHtmlLoading, setIsHtmlLoading] = useState(false);

  const loadHtmlContent = useCallback(async () => {
    if (!htmlContent && !isHtmlLoading && post.markdownContent) {
      setIsHtmlLoading(true);
      try {
        const html = await convertMarkdownToHtml(post.markdownContent);
        setHtmlContent(html);
      } catch (error) {
        console.error("HTML conversion failed:", error);
        setHtmlContent("<p>HTML 미리보기를 생성하는데 실패했습니다.</p>");
      } finally {
        setIsHtmlLoading(false);
      }
    }
  }, [htmlContent, isHtmlLoading, post.markdownContent]);

  useEffect(() => {
    // Reset state for new post and set default view to Preview
    setHtmlContent('');
    setIsHtmlLoading(false);
    setActiveTab('Preview');
  }, [post.id]);

  useEffect(() => {
    // Load HTML content ONLY if it's needed for the HTML tab and not available
    if (activeTab === 'HTML' && !htmlContent) {
      loadHtmlContent();
    }
  }, [activeTab, htmlContent, loadHtmlContent]);


  const handleCopy = useCallback(() => {
    let contentToCopy = '';
    switch (activeTab) {
      case 'Markdown':
        contentToCopy = post.markdownContent;
        break;
      case 'HTML':
        contentToCopy = htmlContent;
        break;
      case 'Preview': // Copy Markdown from preview
        contentToCopy = post.markdownContent;
        break;
    }

    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy).then(() => {
        setCopied(true);
        success('클립보드에 복사되었습니다');
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        showErrorToast('복사에 실패했습니다');
      });
    }
  }, [activeTab, post.markdownContent, htmlContent, success, showErrorToast]);

  const handleDownload = useCallback(async () => {
    let content = '';
    let mimeType = '';
    let extension = '';

    if (activeTab === 'HTML') {
      if (!htmlContent) {
        // If HTML is not loaded yet, try to load it or warn
        // For simplicity, we might need to await loadHtmlContent here or just use what we have.
        // Since it's async, we can't easily await inside this sync handler without changing logic.
        // But user usually clicks tab first.
        // If they are on Preview and click download HTML (not possible via UI logic below), handle it.
        // Actually, let's allow downloading HTML even from Preview if we fetch it.
        // But for now, let's stick to current tab content.
        content = htmlContent;
      } else {
        content = htmlContent;
      }
      mimeType = 'text/html';
      extension = 'html';
    } else {
      content = post.markdownContent;
      mimeType = 'text/markdown';
      extension = 'md';
    }

    if (!content && activeTab === 'HTML') {
      // Fallback or alert if HTML not ready
      alert("HTML 콘텐츠가 아직 준비되지 않았습니다. HTML 탭을 먼저 확인해주세요.");
      return;
    }

    if (!content) return;

    // Add BOM for better UTF-8 support in some editors (e.g. Excel, Notepad on Windows)
    const blob = new Blob(['\uFEFF' + content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.title.replace(/[^a-z0-9가-힣]/gi, '_')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [activeTab, htmlContent, post.markdownContent, post.title]);

  const renderContent = () => {
    if (isHtmlLoading && activeTab === 'HTML') {
      return (
        <div className="flex items-center justify-center p-8 text-slate-600">
          <Spinner />
          <span className="ml-3 text-lg">HTML로 변환하는 중입니다...</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'Markdown':
        return <pre className="whitespace-pre-wrap bg-slate-100 p-6 rounded-lg font-mono text-base overflow-x-auto">{post.markdownContent}</pre>;
      case 'HTML':
        return <pre className="whitespace-pre-wrap bg-slate-100 p-6 rounded-lg font-mono text-base overflow-x-auto">{htmlContent}</pre>;
      case 'Preview':
        return (
          <div className="prose max-w-none prose-headings:font-bold prose-a:text-brand-primary prose-img:rounded-xl">
            <ReactMarkdown>{post.markdownContent}</ReactMarkdown>
          </div>
        );
    }
  };

  const TabButton: React.FC<{ tabName: Tab, label: string }> = ({ tabName, label }) => (
    <button onClick={() => setActiveTab(tabName)} className={`px-5 py-2 text-base font-bold rounded-lg transition-colors ${activeTab === tabName ? 'bg-brand-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{post.title}</h2>
      </div>
      <div className="px-8 py-3 border-y border-slate-200 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <TabButton tabName="Preview" label="미리보기" />
          <TabButton tabName="Markdown" label="마크다운" />
          <TabButton tabName="HTML" label="HTML" />
        </div>
        <div className="flex items-center gap-3">
          {/* 글 저장하기 버튼 숨김 처리 */}
          {/* <div className="relative group">
            <button
              onClick={onSave}
              disabled={isSaved || isSaving || hasError}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 text-base font-bold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-offset-0 focus:ring-brand-primary/50 transition-colors duration-200 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              {isSaving ? (<> <Spinner /> 저장 중... </>
              ) : isSaved ? (<> <CheckIcon className="w-6 h-6 text-green-500" /> 저장됨 </>
              ) : (<> <BookmarkIcon className="w-6 h-6" /> 글 저장하기 </>
              )}
            </button>
            {hasError && !isSaved && (
              <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 bg-slate-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                Notion 연동 오류로 저장할 수 없습니다.
              </div>
            )}
          </div> */}
          {/* <button
            onClick={handleDownload}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 text-base font-bold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-offset-0 focus:ring-brand-primary/50 transition-colors duration-200"
            title={`${activeTab === 'HTML' ? 'HTML' : '마크다운'} 다운로드`}
          >
            <DownloadIcon className="w-6 h-6" />
            다운로드
          </button> */}
          <button
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 text-base font-bold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-offset-0 focus:ring-brand-primary/50 transition-colors duration-200"
          >
            {copied ? (<> <CheckIcon className="w-6 h-6 text-green-500" /> 복사됨! </>
            ) : (<> <ClipboardIcon className="w-6 h-6" /> {activeTab === 'Preview' ? '마크다운' : activeTab} 복사 </>
            )}
          </button>
        </div>
      </div>
      <div className="p-8 sm:p-10">
        {renderContent()}
      </div>
    </div>
  );
};