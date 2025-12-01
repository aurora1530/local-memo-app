// src/utils/localStorage.ts
import type { Memo } from '../types/memo.d';

const MEMO_STORAGE_KEY = 'local-memo-app-memos';

export const getMemos = (): Memo[] => {
  try {
    const memosString = localStorage.getItem(MEMO_STORAGE_KEY);
    return memosString ? JSON.parse(memosString) : [];
  } catch (error) {
    console.error("Failed to get memos from localStorage", error);
    return [];
  }
};

export const setMemos = (memos: Memo[]): void => {
  try {
    localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos));
  } catch (error) {
    console.error("Failed to save memos to localStorage", error);
  }
};
