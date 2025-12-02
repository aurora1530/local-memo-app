import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Memo } from '../types/memo.d';
import { getMemos, setMemos } from '../utils/localStorage';

const createBlankMemo = (): Memo => {
  const timestamp = new Date().toISOString();
  return {
    id: uuidv4(),
    title: '無題のメモ',
    content: '',
    createdAt: timestamp,
    updatedAt: timestamp,
    isMarkdown: true,
  };
};

export const useMemos = () => {
  const [memos, setMemosState] = useState<Memo[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMemosState(getMemos());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const handle = window.setTimeout(() => {
      setMemos(memos);
    }, 400);

    return () => clearTimeout(handle);
  }, [memos, hydrated]);

  const addMemo = useCallback((): Memo => {
    const newMemo = createBlankMemo();
    setMemosState((current) => [newMemo, ...current]);
    return newMemo;
  }, []);

  const updateMemo = useCallback(
    (id: string, changes: Partial<Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>>): void => {
      const updatedAt = new Date().toISOString();
      setMemosState((current) =>
        current.map((memo) => (memo.id === id ? { ...memo, ...changes, updatedAt } : memo))
      );
    },
    []
  );

  const deleteMemo = useCallback((id: string): void => {
    setMemosState((current) => current.filter((memo) => memo.id !== id));
  }, []);

  return { memos, addMemo, updateMemo, deleteMemo };
};
