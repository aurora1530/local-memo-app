import clsx from 'clsx';
import { Columns2, Eye, PanelLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import type { Memo } from '../types/memo.d';

type MarkdownView = 'split' | 'edit' | 'preview';

interface MemoEditorProps {
  memo: Memo | null;
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (content: string) => void;
  onToggleMarkdown: (enabled: boolean) => void;
  onDelete: () => void;
  isLargeScreen: boolean;
  onShowListOnMobile: () => void;
}

const MemoEditor = ({
  memo,
  onUpdateTitle,
  onUpdateContent,
  onToggleMarkdown,
  onDelete,
  isLargeScreen,
  onShowListOnMobile,
}: MemoEditorProps) => {
  const [markdownView, setMarkdownView] = useState<MarkdownView>('split');

  useEffect(() => {
    setMarkdownView('split');
  }, [memo?.id]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('ja-JP', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    []
  );

  if (!memo) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center bg-white text-center text-slate-500">
        <p className="text-lg font-semibold">メモを選択するか、新規作成してください。</p>
        <p className="text-sm">左のリストからメモを選ぶと内容が表示されます。</p>
      </section>
    );
  }

  const showEditor = markdownView !== 'preview';
  const showPreview = markdownView !== 'edit';

  return (
    <section className="flex h-full flex-col bg-white">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-6 py-4">
        {!isLargeScreen && (
          <button
            type="button"
            onClick={onShowListOnMobile}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-600"
          >
            <PanelLeft className="h-4 w-4" />
            一覧へ
          </button>
        )}
        <input
          type="text"
          value={memo.title}
          onChange={(event) => onUpdateTitle(event.target.value)}
          placeholder="タイトル"
          className="min-w-0 flex-1 rounded-lg border border-transparent bg-slate-50 px-4 py-2 text-lg font-semibold text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onToggleMarkdown(false)}
            className={clsx(
              'rounded-lg px-3 py-2 text-sm font-medium',
              memo.isMarkdown ? 'bg-slate-100 text-slate-500' : 'bg-indigo-600 text-white'
            )}
          >
            Plaintext
          </button>
          <button
            type="button"
            onClick={() => onToggleMarkdown(true)}
            className={clsx(
              'rounded-lg px-3 py-2 text-sm font-medium',
              memo.isMarkdown ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
            )}
          >
            Markdown
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p>作成: {dateFormatter.format(new Date(memo.createdAt))}</p>
          <p>更新: {dateFormatter.format(new Date(memo.updatedAt))}</p>
        </div>

        {memo.isMarkdown && (
          <div className="mt-3 flex items-center justify-end gap-2 text-sm text-slate-600">
            <button
              type="button"
              onClick={() => setMarkdownView('edit')}
              className={clsx(
                'rounded-md px-3 py-1',
                markdownView === 'edit' ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-100'
              )}
            >
              編集
            </button>
            <button
              type="button"
              onClick={() => setMarkdownView('preview')}
              className={clsx(
                'inline-flex items-center gap-1 rounded-md px-3 py-1',
                markdownView === 'preview' ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-100'
              )}
            >
              <Eye className="h-4 w-4" /> プレビュー
            </button>
            <button
              type="button"
              onClick={() => setMarkdownView('split')}
              className={clsx(
                'inline-flex items-center gap-1 rounded-md px-3 py-1',
                markdownView === 'split' ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-100'
              )}
            >
              <Columns2 className="h-4 w-4" /> 2分割
            </button>
          </div>
        )}

        <div className="mt-4 min-h-[320px] space-y-4">
          {memo.isMarkdown ? (
            <div
              className={clsx('flex flex-col gap-4', {
                'md:grid md:grid-cols-2': showEditor && showPreview,
              })}
            >
              {showEditor && (
                <textarea
                  value={memo.content}
                  onChange={(event) => onUpdateContent(event.target.value)}
                  className="h-full min-h-[320px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none"
                  placeholder="Markdownでメモを記述してください"
                />
              )}
              {showPreview && (
                <div className="min-h-[320px] rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <article className="markdown-body">
                    {memo.content.trim() ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                        {memo.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-sm text-slate-400">プレビューする内容がありません。</p>
                    )}
                  </article>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={memo.content}
              onChange={(event) => onUpdateContent(event.target.value)}
              className="min-h-[480px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none"
              placeholder="テキストでシンプルにメモを書けます"
            />
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 px-6 py-4 text-right">
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          このメモを削除
        </button>
      </div>
    </section>
  );
};

export default MemoEditor;
