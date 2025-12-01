// src/types/memo.d.ts
export interface Memo {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isMarkdown: boolean;
}
