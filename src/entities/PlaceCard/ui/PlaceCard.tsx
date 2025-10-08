'use client';
import Image from 'next/image';
import Link from 'next/link';
import { type PlaceCardProps } from '../types';

export function PlaceCard({
  title,
  description,
  imageUrl,
  imageAlt = '',
  href,
  className,
}: PlaceCardProps) {
  const baseClass =
    'group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900';
  const containerClassName = className
    ? `${baseClass} ${className}`
    : baseClass;

  const content = (
    <>
      <div className="relative aspect-[5/3] w-full">
        <Image
          src={imageUrl}
          alt={imageAlt || title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          unoptimized
          priority={false}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={containerClassName}>
        {content}
      </Link>
    );
  }

  return <div className={containerClassName}>{content}</div>;
}

export default PlaceCard;
