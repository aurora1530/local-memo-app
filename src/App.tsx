import { useState, useCallback, useEffect, useMemo } from 'react';
import { useMemos } from './hooks/useMemos';
import type { Memo } from './types/memo.d';
import { useDebounce } from './hooks/useDebounce';

import MemoList from './components/MemoList';
import MemoEditor from './components/MemoEditor';

const DEBOUNCE_DELAY = 500; // 500ms

type SortBy = 'createdAt' | 'updatedAt' | 'title';
type SortOrder = 'asc' | 'desc';

function App() {
  const { memos, addMemo, updateMemo, deleteMemo } = useMemos();
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showList, setShowList] = useState(true); // モバイル表示用: true=リスト表示, false=エディタ表示

  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingContent, setEditingContent] = useState<string>('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // 初期値設定

  // ウィンドウサイズ変更を監視
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedMemoId) {
      const currentMemo = memos.find(memo => memo.id === selectedMemoId);
      if (currentMemo) {
        setEditingTitle(currentMemo.title);
        setEditingContent(currentMemo.content);
        if (isMobile) {
          setShowList(false);
        }
      }
    } else {
      setEditingTitle('');
      setEditingContent('');
    }
  }, [selectedMemoId, memos, isMobile]);

  const debouncedTitle = useDebounce(editingTitle, DEBOUNCE_DELAY);
  const debouncedContent = useDebounce(editingContent, DEBOUNCE_DELAY);

  useEffect(() => {
    if (selectedMemoId) {
      const currentMemo = memos.find(memo => memo.id === selectedMemoId);
      if (currentMemo && currentMemo.title !== debouncedTitle) {
        updateMemo({ ...currentMemo, title: debouncedTitle });
      }
    }
  }, [debouncedTitle, selectedMemoId, memos, updateMemo]);

  useEffect(() => {
    if (selectedMemoId) {
      const currentMemo = memos.find(memo => memo.id === selectedMemoId);
      if (currentMemo && currentMemo.content !== debouncedContent) {
        updateMemo({ ...currentMemo, content: debouncedContent });
      }
    }
  }, [debouncedContent, selectedMemoId, memos, updateMemo]);

  useEffect(() => {
    if (memos.length > 0 && selectedMemoId === null) {
      setSelectedMemoId(memos[0].id);
    } else if (memos.length === 0 && selectedMemoId !== null) {
      setSelectedMemoId(null);
    } else if (selectedMemoId && !memos.some(memo => memo.id === selectedMemoId)) {
      setSelectedMemoId(memos.length > 0 ? memos[0].id : null);
    }
  }, [memos, selectedMemoId]);

  const handleNewMemo = useCallback(() => {
    const newMemo = addMemo("新しいメモ", "", false);
    setSelectedMemoId(newMemo.id);
    if (isMobile) {
      setShowList(false);
    }
  }, [addMemo, isMobile]);

  const selectedMemo = selectedMemoId
    ? memos.find((memo) => memo.id === selectedMemoId) || null
    : null;

  const handleUpdateMemoProperty = useCallback((field: keyof Memo, value: any) => {
    if (selectedMemo) {
      updateMemo({ ...selectedMemo, [field]: value });
    }
  }, [selectedMemo, updateMemo]);

  const handleDeleteMemo = useCallback(() => {
    if (selectedMemo && window.confirm('本当にこのメモを削除しますか？')) {
      deleteMemo(selectedMemo.id);
      setSelectedMemoId(null);
      if (isMobile) {
        setShowList(true);
      }
    }
  }, [selectedMemo, deleteMemo, isMobile]);

  const displayedMemos = useMemo(() => {
    let currentMemos = [...memos];

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (lowerCaseSearchTerm) {
      currentMemos = currentMemos.filter(
        (memo) =>
          memo.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          memo.content.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    currentMemos.sort((a, b) => {
      let compareValue = 0;
      if (sortBy === 'title') {
        compareValue = a.title.localeCompare(b.title);
      } else {
        compareValue = new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return currentMemos;
  }, [memos, searchTerm, sortBy, sortOrder]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {(showList || !isMobile) && (
        <MemoList
          displayedMemos={displayedMemos}
          selectedMemoId={selectedMemoId}
          setSelectedMemoId={setSelectedMemoId}
          handleNewMemo={handleNewMemo}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isMobile={isMobile}
          setShowList={setShowList}
        />
      )}

      {(!showList || !isMobile) && (
        <MemoEditor
          selectedMemo={selectedMemo}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          editingContent={editingContent}
          setEditingContent={setEditingContent}
          handleUpdateMemoProperty={handleUpdateMemoProperty}
          handleDeleteMemo={handleDeleteMemo}
          isMobile={isMobile}
          setShowList={setShowList}
        />
      )}
    </div>
  );
}

export default App;
