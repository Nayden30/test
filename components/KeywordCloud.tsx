import React, { useMemo } from 'react';
import type { Article } from '../types';

interface KeywordCloudProps {
  articles: Article[];
  onKeywordClick: (keyword: string) => void;
}

const FONT_SIZES = [
  'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
];

const COLORS = [
  'text-blue-600 dark:text-blue-400',
  'text-purple-600 dark:text-purple-400',
  'text-teal-600 dark:text-teal-400',
  'text-amber-600 dark:text-amber-400',
  'text-indigo-600 dark:text-indigo-400',
  'text-pink-600 dark:text-pink-400',
];

const KeywordCloud: React.FC<KeywordCloudProps> = ({ articles, onKeywordClick }) => {
  const keywordFrequencies = useMemo(() => {
    const counts = new Map<string, number>();
    articles.forEach(article => {
      article.keywords.forEach(keyword => {
        const lowerKeyword = keyword.toLowerCase();
        counts.set(lowerKeyword, (counts.get(lowerKeyword) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
        .map(([keyword, count]) => ({ keyword, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 30); // Limit to top 30 keywords
  }, [articles]);

  const { minCount, maxCount } = useMemo(() => {
    if (keywordFrequencies.length === 0) return { minCount: 1, maxCount: 1 };
    const counts = keywordFrequencies.map(k => k.count);
    return { minCount: Math.min(...counts), maxCount: Math.max(...counts) };
  }, [keywordFrequencies]);

  const getKeywordStyle = (count: number, index: number) => {
    const range = maxCount - minCount;
    const level = range === 0 ? FONT_SIZES.length - 1 : Math.floor(((count - minCount) / range) * (FONT_SIZES.length - 1));
    const fontSize = FONT_SIZES[level];
    const color = COLORS[index % COLORS.length];
    return `${fontSize} ${color} font-bold hover:underline cursor-pointer transition-transform transform hover:scale-110`;
  };

  if (keywordFrequencies.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 p-8">
      {keywordFrequencies.map(({ keyword, count }, index) => (
        <button
          key={keyword}
          className={getKeywordStyle(count, index)}
          onClick={() => onKeywordClick(keyword)}
          title={`${count} articles`}
        >
          {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default KeywordCloud;
