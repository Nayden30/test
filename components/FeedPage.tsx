import React, { useMemo } from 'react';
import type { User, Article } from '../types';
import ArticleCard from './ArticleCard';
import { useTranslation } from '../hooks/useTranslation';

interface FeedPageProps {
  currentUser: User;
  allArticles: Article[];
  onSelectArticle: (id: string) => void;
  onViewProfile: (userId: string) => void;
}

const FeedPage: React.FC<FeedPageProps> = ({ currentUser, allArticles, onSelectArticle, onViewProfile }) => {
  const { t } = useTranslation();
  
  const feedArticles = useMemo(() => {
    if (!currentUser.followingUsers || currentUser.followingUsers.length === 0) {
      return [];
    }
    return allArticles
      .filter(article => currentUser.followingUsers.includes(article.author.id))
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  }, [currentUser, allArticles]);

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('feed.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{t('feed.description')}</p>
      </div>

      {feedArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} onViewProfile={onViewProfile} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('feed.empty.title')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('feed.empty.description')}</p>
        </div>
      )}
    </div>
  );
};

export default FeedPage;