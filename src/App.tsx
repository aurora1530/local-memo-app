import { useEffect, useMemo, useState } from 'react';
import MemoEditor from './components/MemoEditor';
import MemoList, { type SortBy, type SortOrder } from './components/MemoList';
import { useMemos } from './hooks/useMemos';
import { useMediaQuery } from './hooks/useMediaQuery';

type Panel = 'list' | 'editor';

function App() {
  const { memos, addMemo, updateMemo, deleteMemo } = useMemos();
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [activePanel, setActivePanel] = useState<Panel>('list');

  useEffect(() => {
    if (isLargeScreen) {
      setActivePanel('list');
    }
  }, [isLargeScreen]);

  useEffect(() => {
    if (memos.length === 0) {
      setSelectedMemoId(null);
      return;
    }

    if (!selectedMemoId) {
      setSelectedMemoId(memos[0].id);
      return;
    }

    if (!memos.some((memo) => memo.id === selectedMemoId)) {
      setSelectedMemoId(memos[0].id);
    }
  }, [memos, selectedMemoId]);

  const filteredMemos = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const cloned = [...memos];
    const filtered = term
      ? cloned.filter((memo) =>
          memo.title.toLowerCase().includes(term) || memo.content.toLowerCase().includes(term)
        )
      : cloned;

    const sorted = filtered.sort((a, b) => {
      const direction = sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'title') {
        return direction * a.title.localeCompare(b.title, 'ja');
      }

      const aTime = new Date(a[sortBy]).getTime();
      const bTime = new Date(b[sortBy]).getTime();
      return direction * (aTime - bTime);
    });

    return sorted;
  }, [memos, searchTerm, sortBy, sortOrder]);

  const selectedMemo = selectedMemoId
    ? memos.find((memo) => memo.id === selectedMemoId) ?? null
    : null;

  const showList = isLargeScreen || activePanel === 'list';
  const showEditor = isLargeScreen || activePanel === 'editor';

  const handleCreateMemo = () => {
    const memo = addMemo();
    setSelectedMemoId(memo.id);
    setActivePanel('editor');
  };

  const handleSelectMemo = (id: string) => {
    setSelectedMemoId(id);
    setActivePanel('editor');
  };

  const handleDeleteMemo = () => {
    if (!selectedMemo) return;
    if (!window.confirm('本当にこのメモを削除しますか？')) return;
    deleteMemo(selectedMemo.id);
    setActivePanel('list');
  };

  const updateSelectedMemo = (changes: Parameters<typeof updateMemo>[1]) => {
    if (!selectedMemo) return;
    updateMemo(selectedMemo.id, changes);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        {showList && (
          <div className="w-full lg:w-[360px] xl:w-[420px]">
            <MemoList
              memos={filteredMemos}
              selectedMemoId={selectedMemoId}
              onSelectMemo={handleSelectMemo}
              onCreateMemo={handleCreateMemo}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              isLargeScreen={isLargeScreen}
              onShowEditorOnMobile={() => setActivePanel('editor')}
            />
          </div>
        )}

        {showEditor && (
          <div className="flex flex-1 flex-col">
            <MemoEditor
              memo={selectedMemo}
              onUpdateTitle={(title) => updateSelectedMemo({ title })}
              onUpdateContent={(content) => updateSelectedMemo({ content })}
              onToggleMarkdown={(enabled) => updateSelectedMemo({ isMarkdown: enabled })}
              onDelete={handleDeleteMemo}
              isLargeScreen={isLargeScreen}
              onShowListOnMobile={() => setActivePanel('list')}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
