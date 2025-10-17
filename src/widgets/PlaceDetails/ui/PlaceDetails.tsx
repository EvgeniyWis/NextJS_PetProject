'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toTitle } from '@/src/shared/lib/toTitle';
import {
  defaultComments,
  defaultDescription,
  defaultImageUrl,
  type Comment,
} from '../model/mocks';

type PlaceDetailsProps = {
  slug: string;
};

export function PlaceDetails({ slug }: PlaceDetailsProps) {
  const title = useMemo(() => toTitle(slug), [slug]);
  const description = defaultDescription;
  const imageUrl = defaultImageUrl;
  const [comments] = useState<Comment[]>(defaultComments);

  const [likesCount, setLikesCount] = useState<number>(12);
  const [dislikesCount, setDislikesCount] = useState<number>(1);
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null);

  const handleLike = () => {
    if (reaction === 'like') {
      setReaction(null);
      setLikesCount((c) => Math.max(0, c - 1));
      return;
    }
    setReaction('like');
    setLikesCount((c) => c + 1);
    if (reaction === 'dislike') setDislikesCount((c) => Math.max(0, c - 1));
  };

  const handleDislike = () => {
    if (reaction === 'dislike') {
      setReaction(null);
      setDislikesCount((c) => Math.max(0, c - 1));
      return;
    }
    setReaction('dislike');
    setDislikesCount((c) => c + 1);
    if (reaction === 'like') setLikesCount((c) => Math.max(0, c - 1));
  };

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="100vw"
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{description}</p>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              reaction === 'like'
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <span>👍</span>
            <span>{likesCount}</span>
          </button>
          <button
            onClick={handleDislike}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              reaction === 'dislike'
                ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <span>👎</span>
            <span>{dislikesCount}</span>
          </button>
        </div>
      </div>

      <section className="mt-8 p-4 sm:p-6">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Комментарии
        </h2>
        <ul className="space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
            >
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {c.author}
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{c.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
