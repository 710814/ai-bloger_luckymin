import React from 'react';
import type { NotionPostInfo } from '../types';
import { TrashIcon, EyeIcon, NotionIcon } from './icons';
import { Spinner } from './Spinner';

interface SavedPostsProps {
  posts: NotionPostInfo[];
  onLoad: (pageId: string, title: string) => void;
  onDelete: (pageId: string) => void;
  isLoading: boolean;
  deletingPostId: string | null;
  loadingPostId: string | null;
  hasError: boolean;
}

export const SavedPosts: React.FC<SavedPostsProps> = ({ posts, onLoad, onDelete, isLoading, deletingPostId, loadingPostId, hasError }) => {
  
  if (hasError) {
    return null;
  }

  if (isLoading) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
            <Spinner />
            <span className="ml-3 text-lg text-slate-600">Notion에서 글을 불러오는 중...</span>
        </div>
    );
  }
  
  if (posts.length === 0) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
             <div className="flex items-center justify-center gap-3 mb-4">
                <NotionIcon className="w-8 h-8 text-slate-700" />
                <h2 className="text-2xl font-bold text-slate-900">저장된 글</h2>
            </div>
             <p className="text-base text-slate-500 mt-2">아직 저장된 글이 없습니다.<br/>글을 생성하고 저장하여 Notion에서 관리하세요.</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <NotionIcon className="w-8 h-8 text-slate-700" />
        <h2 className="text-2xl font-bold text-slate-900">저장된 글 (Notion)</h2>
      </div>
      <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {posts.map(post => (
          <li key={post.pageId} className="flex items-center justify-between p-4 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
            <span className="font-semibold text-slate-800 text-lg truncate mr-4">{post.title}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
                {(loadingPostId === post.pageId || deletingPostId === post.pageId) ? (
                    <Spinner />
                ) : (
                    <>
                        <button onClick={() => onLoad(post.pageId, post.title)} className="p-2 text-slate-500 hover:text-brand-primary disabled:opacity-50" title="불러오기" disabled={!!loadingPostId || !!deletingPostId}>
                            <EyeIcon className="w-6 h-6" />
                        </button>
                        <button onClick={() => onDelete(post.pageId)} className="p-2 text-slate-500 hover:text-red-500 disabled:opacity-50" title="삭제하기" disabled={!!loadingPostId || !!deletingPostId}>
                            <TrashIcon className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
