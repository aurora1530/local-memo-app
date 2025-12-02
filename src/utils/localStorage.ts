import type { Memo } from '../types/memo.d';

const MEMO_STORAGE_KEY = 'local-memo-app-memos';

const hasLocalStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const sanitizeMemo = (memo: Partial<Memo>): Memo | null => {
  if (!memo.id) return null;
  const created = typeof memo.createdAt === 'string' ? memo.createdAt : new Date().toISOString();
  const updated = typeof memo.updatedAt === 'string' ? memo.updatedAt : created;
  return {
    id: memo.id,
    title: typeof memo.title === 'string' ? memo.title : '',
    content: typeof memo.content === 'string' ? memo.content : '',
    createdAt: created,
    updatedAt: updated,
    isMarkdown: typeof memo.isMarkdown === 'boolean' ? memo.isMarkdown : true,
  };
};

export const getMemos = (): Memo[] => {
  if (!hasLocalStorage()) {
    return [];
  }
  try {
    const memosString = window.localStorage.getItem(MEMO_STORAGE_KEY);
    if (!memosString) return [];
    const parsed = JSON.parse(memosString);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((memo) => sanitizeMemo(memo as Partial<Memo>))
      .filter((memo): memo is Memo => Boolean(memo));
  } catch (error) {
    console.error('Failed to get memos from localStorage', error);
    return [];
  }
};

export const setMemos = (memos: Memo[]): void => {
  if (!hasLocalStorage()) {
    return;
  }
  try {
    window.localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos));
  } catch (error) {
    console.error('Failed to save memos to localStorage', error);
  }
};
