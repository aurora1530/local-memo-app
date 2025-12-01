// src/hooks/useMemos.ts
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

  useEffect(() => {
    setMemosState(getMemos());
  }, []);

  const persist = useCallback((next: Memo[]) => {
    setMemosState(next);
    setMemos(next);
  }, []);

  const addMemo = useCallback((): Memo => {
    const newMemo = createBlankMemo();
    persist([newMemo, ...memos]);
    return newMemo;
  }, [memos, persist]);

  const updateMemo = useCallback((id: string, changes: Partial<Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>>): void => {
    const updatedAt = new Date().toISOString();
    const next = memos.map((memo) =>
      memo.id === id ? { ...memo, ...changes, updatedAt } : memo
    );
    persist(next);
  }, [memos, persist]);

  const deleteMemo = useCallback((id: string): void => {
    const next = memos.filter((memo) => memo.id !== id);
    persist(next);
  }, [memos, persist]);

  return { memos, addMemo, updateMemo, deleteMemo };
};
