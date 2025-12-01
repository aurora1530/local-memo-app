// src/components/MemoList.tsx
import React from 'react';
import type { Memo } from '../types/memo.d';

type SortBy = 'createdAt' | 'updatedAt' | 'title';
type SortOrder = 'asc' | 'desc';

interface MemoListProps {
  displayedMemos: Memo[];
  selectedMemoId: string | null;
  setSelectedMemoId: (id: string | null) => void;
  handleNewMemo: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  sortOrder: SortOrder;
  setSortOrder: (sortOrder: SortOrder) => void;
  isMobile: boolean;
  setShowList: (show: boolean) => void;
}

const MemoList: React.FC<MemoListProps> = ({
  displayedMemos,
  selectedMemoId,
  setSelectedMemoId,
  handleNewMemo,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  isMobile,
  setShowList,
}) => {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">メモアプリ</h1>
        {isMobile && (
          <button
            onClick={() => setShowList(false)}
            className="py-1 px-3 bg-gray-200 dark:bg-gray-700 rounded-md"
          >
            エディタへ
          </button>
        )}
      </div>
      <button
        onClick={handleNewMemo}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mb-4"
      >
        新しいメモを追加
      </button>
      <div className="mb-4">
        <input
          type="text"
          placeholder="メモを検索..."
          className="w-full p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center mb-4 space-x-2">
        <select
          className="flex-grow p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
        >
          <option value="updatedAt">更新日時</option>
          <option value="createdAt">作成日時</option>
          <option value="title">タイトル</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md"
        >
          {sortOrder === 'asc' ? '昇順' : '降順'}
        </button>
      </div>
      <div>
        {displayedMemos.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? '検索結果はありません。' : 'メモがありません。'}
          </p>
        ) : (
          displayedMemos.map((memo) => (
            <div
              key={memo.id}
              className={`p-3 mb-2 rounded-md cursor-pointer ${
                selectedMemoId === memo.id
                  ? 'bg-blue-200 dark:bg-blue-700'
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => { setSelectedMemoId(memo.id); if (isMobile) setShowList(false); }}
            >
              <h3 className="font-semibold truncate">{memo.title || "無題のメモ"}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {memo.content.substring(0, 50)}...
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MemoList;