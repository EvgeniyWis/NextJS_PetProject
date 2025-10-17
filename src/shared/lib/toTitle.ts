export function toTitle(slug: string): string {
  const words = slug.split('-').filter(Boolean);
  if (words.length === 0) return 'Place';
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
