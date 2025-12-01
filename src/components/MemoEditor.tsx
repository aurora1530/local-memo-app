// src/components/MemoEditor.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import type { Memo } from '../types/memo.d';

interface MemoEditorProps {
  selectedMemo: Memo | null;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  editingContent: string;
  setEditingContent: (content: string) => void;
  handleUpdateMemoProperty: (field: keyof Memo, value: any) => void;
  handleDeleteMemo: () => void;
  isMobile: boolean;
  setShowList: (show: boolean) => void;
}

const MemoEditor: React.FC<MemoEditorProps> = ({
  selectedMemo,
  editingTitle,
  setEditingTitle,
  editingContent,
  setEditingContent,
  handleUpdateMemoProperty,
  handleDeleteMemo,
  isMobile,
  setShowList,
}) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {selectedMemo ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            {isMobile && (
              <button
                onClick={() => setShowList(true)}
                className="py-1 px-3 bg-gray-200 dark:bg-gray-700 rounded-md mr-2"
              >
                リストへ
              </button>
            )}
            <input
              type="text"
              className="flex-grow p-2 text-xl font-bold border rounded-md bg-transparent dark:border-gray-600 mr-2"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateMemoProperty('isMarkdown', false)}
                className={`py-2 px-4 rounded-md ${
                  !selectedMemo.isMarkdown ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                Plaintext
              </button>
              <button
                onClick={() => handleUpdateMemoProperty('isMarkdown', true)}
                className={`py-2 px-4 rounded-md ${
                  selectedMemo.isMarkdown ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                Markdown
              </button>
            </div>
          </div>

          {selectedMemo.isMarkdown ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
              <textarea
                className="w-full h-full p-2 border rounded-md resize-none bg-transparent dark:border-gray-600"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                placeholder="Markdown形式で入力してください..."
              />
              <div className="w-full h-full p-2 border rounded-md bg-white dark:bg-gray-800 overflow-y-auto prose dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {editingContent}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <textarea
              className="w-full h-96 p-2 border rounded-md resize-none bg-transparent dark:border-gray-600"
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              placeholder="プレーンテキストで入力してください..."
            />
          )}
          
          <button
            onClick={handleDeleteMemo}
            className="mt-4 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            メモを削除
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-20">メモを選択してください、または新しいメモを作成してください。</p>
      )}
    </div>
  );
};

export default MemoEditor;