import clsx from 'clsx';
import { ArrowDownUp, Plus, Search, SquarePen } from 'lucide-react';
import { useMemo } from 'react';
import type { Memo } from '../types/memo.d';

export type SortBy = 'createdAt' | 'updatedAt' | 'title';
export type SortOrder = 'asc' | 'desc';

interface MemoListProps {
  memos: Memo[];
  selectedMemoId: string | null;
  onSelectMemo: (id: string) => void;
  onCreateMemo: () => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  sortBy: SortBy;
  onSortByChange: (sort: SortBy) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  isLargeScreen: boolean;
  onShowEditorOnMobile: () => void;
}

const getExcerpt = (content: string) => {
  if (!content) return '内容がありません';
  const normalized = content.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 80) return normalized;
  return `${normalized.slice(0, 80)}…`;
};

const MemoList = ({
  memos,
  selectedMemoId,
  onSelectMemo,
  onCreateMemo,
  searchTerm,
  onSearchTermChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  isLargeScreen,
  onShowEditorOnMobile,
}: MemoListProps) => {
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('ja-JP', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    []
  );
  const isSearching = searchTerm.trim().length > 0;

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Local Memo</p>
          <p className="text-lg font-bold text-slate-900">メモ一覧</p>
        </div>
        {!isLargeScreen && (
          <button
            type="button"
            onClick={onShowEditorOnMobile}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-600"
          >
            <SquarePen className="h-4 w-4" />
            エディタ
          </button>
        )}
      </div>

      <div className="border-b border-slate-200 px-4 py-4">
        <button
          type="button"
          onClick={onCreateMemo}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          新しいメモ
        </button>

        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="タイトル・本文で検索"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(event) => onSortByChange(event.target.value as SortBy)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            >
              <option value="updatedAt">更新日時</option>
              <option value="createdAt">作成日時</option>
              <option value="title">タイトル</option>
            </select>
            <button
              type="button"
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600"
            >
              <ArrowDownUp className="h-4 w-4" />
              {sortOrder === 'asc' ? '昇順' : '降順'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {memos.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-slate-500">
            <p className="text-base font-semibold">
              {isSearching ? '検索結果がありません' : 'メモがありません'}
            </p>
            <p className="text-sm">
              {isSearching ? 'キーワードを変えるかクリアしてください。' : '「新しいメモ」を押して最初のメモを作成しましょう。'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {memos.map((memo) => {
              const isActive = memo.id === selectedMemoId;
              return (
                <li key={memo.id}>
                  <button
                    type="button"
                    onClick={() => onSelectMemo(memo.id)}
                    className={clsx(
                      'flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors',
                      isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    )}
                  >
                    <span className="text-sm font-semibold text-slate-900">
                      {memo.title?.trim() || '無題のメモ'}
                    </span>
                    <span className="text-xs text-slate-500">
                      更新: {dateFormatter.format(new Date(memo.updatedAt))}
                    </span>
                    <p className="text-sm text-slate-600">
                      {getExcerpt(memo.content)}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default MemoList;
