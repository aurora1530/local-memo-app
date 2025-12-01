// src/hooks/useMemos.ts
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Memo } from '../types/memo.d';
import { getMemos, setMemos } from '../utils/localStorage';

export const useMemos = () => {
  const [memos, setMemosState] = useState<Memo[]>([]);

  useEffect(() => {
    setMemosState(getMemos());
  }, []);

  const addMemo = useCallback((title: string, content: string, isMarkdown: boolean): Memo => {
    const now = new Date().toISOString();
    const newMemo: Memo = {
      id: uuidv4(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
      isMarkdown,
    };
    const updatedMemos = [...memos, newMemo];
    setMemosState(updatedMemos);
    setMemos(updatedMemos);
    return newMemo;
  }, [memos]);

  const updateMemo = useCallback((updatedMemo: Memo): void => {
    const now = new Date().toISOString();
    const memoToUpdate = { ...updatedMemo, updatedAt: now };
    const updatedMemos = memos.map((memo) =>
      memo.id === memoToUpdate.id ? memoToUpdate : memo
    );
    setMemosState(updatedMemos);
    setMemos(updatedMemos);
  }, [memos]);

  const deleteMemo = useCallback((id: string): void => {
    const updatedMemos = memos.filter((memo) => memo.id !== id);
    setMemosState(updatedMemos);
    setMemos(updatedMemos);
  }, [memos]);

  return { memos, addMemo, updateMemo, deleteMemo };
};
