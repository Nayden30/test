import React, { useMemo } from 'react';
import type { Article, User, Institution } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import ArticleCard from './ArticleCard';
import { StarIcon } from './icons/StarIcon';
import LinguistMap from './LinguistMap';
import KeywordCloud from './KeywordCloud';
import { TagIcon } from './icons/TagIcon';

interface LandingPageProps {
  articles: Article[];
  users: User[];
  institutions: Institution[];
  currentUser: User | null;
  onSelectArticle: (id: string) => void;
  onViewProfile: (userId: string) => void;
  onNavigate: (view: 'list' | 'submit' | 'register') => void;
  onSelectKeyword: (keyword: string) => void;
  isLoggedIn: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ articles, users, institutions, currentUser, onSelectArticle, onViewProfile, onNavigate, onSelectKeyword, isLoggedIn }) => {
    const { t } = useTranslation();
    
    const recentArticles = useMemo(() => articles
        .filter(a => a.status === 'Published')
        .sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
        .slice(0, 3), [articles]);
        
    const trendingArticles = useMemo(() => articles
        .filter(a => a.status === 'Published')
        .sort((a,b) => b.views - a.views)
        .slice(0, 3), [articles]);

    const recommendedArticles = useMemo(() => {
        const published = articles.filter(a => a.status === 'Published');
        if (currentUser) {
            // Recommend based on user's specialties
            const recommendations = published.filter(article => 
                article.author.id !== currentUser.id && 
                article.disciplines.some(d => currentUser.specialties.includes(d))
            );
            return recommendations.length > 0 ? recommendations.slice(0, 3) : trendingArticles;
        } else {
            // For guests, recommend most commented articles
            return published.sort((a, b) => b.comments.length - a.comments.length).slice(0, 3);
        }
    }, [articles, currentUser, trendingArticles]);

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          {t('landing.hero.titlePart1')} <span className="text-blue-600 dark:text-blue-400">{t('landing.hero.titlePart2')}</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300">
          {t('landing.hero.subtitle')}
        </p>
         <p className="mt-2 max-w-3xl mx-auto text-gray-500 dark:text-gray-400">
            {t('landing.hero.description')}
        </p>
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button 
            onClick={() => onNavigate(isLoggedIn ? 'submit' : 'register')}
            className="bg-blue-600 text-white font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition transform hover:scale-105"
          >
            {t('landing.hero.ctaSubmit')}
          </button>
          <button 
            onClick={() => onNavigate('list')}
            className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 font-bold px-6 py-3 rounded-full hover:bg-blue-50 dark:hover:bg-gray-600 border-2 border-blue-600 transition"
          >
            {t('landing.hero.ctaExplore')}
          </button>
        </div>
      </div>
      
       {/* How it works Section */}
        <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('landing.howItWorks.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="text-3xl font-bold text-blue-200 dark:text-blue-800 mb-2">1</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{t('landing.howItWorks.step1.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('landing.howItWorks.step1.description')}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                     <div className="text-3xl font-bold text-blue-200 dark:text-blue-800 mb-2">2</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{t('landing.howItWorks.step2.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('landing.howItWorks.step2.description')}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="text-3xl font-bold text-blue-200 dark:text-blue-800 mb-2">3</div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{t('landing.howItWorks.step3.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t('landing.howItWorks.step3.description')}</p>
                </div>
            </div>
        </div>
      
      {/* Linguist Map Section */}
      <div className="mb-12">
        <LinguistMap users={users} institutions={institutions} onViewProfile={onViewProfile} />
      </div>

      {/* Quote of the month */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">{t('landing.quote.title')}</h2>
        <figure className="max-w-3xl mx-auto text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
            <svg className="h-10 w-10 mx-auto mb-3 text-gray-400 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
            </svg>
            <blockquote className="text-xl italic font-medium text-gray-900 dark:text-white">
                <p>"{t('landing.quote.text')}"</p>
            </blockquote>
            <figcaption className="flex items-center justify-center mt-6 space-x-3">
                <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                    <cite className="pr-3 font-medium text-gray-900 dark:text-white">{t('landing.quote.author')}</cite>
                    <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">{t('landing.quote.authorTitle')}</cite>
                </div>
            </figcaption>
        </figure>
      </div>

      {/* Recommended Articles Section */}
       <div className="mb-12 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center flex items-center justify-center gap-3">
            <StarIcon className="w-8 h-8 text-yellow-500" /> 
            {currentUser ? t('landing.recommended.forYou') : t('landing.recommended.popularDiscussions')}
        </h2>
         {recommendedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} onViewProfile={onViewProfile} />
                ))}
            </div>
         ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">{t('landing.noArticles')}</p>
         )}
      </div>

      {/* Keyword Cloud Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center flex items-center justify-center gap-3">
          <TagIcon className="w-8 h-8 text-purple-500" /> {t('landing.keywords.title')}
        </h2>
        <KeywordCloud articles={articles} onKeywordClick={onSelectKeyword} />
      </div>

      {/* Trending Articles Section */}
       <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('landing.trending.title')}</h2>
         {trendingArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} onViewProfile={onViewProfile} />
                ))}
            </div>
         ) : (
            <p className="text-gray-500 dark:text-gray-400">{t('landing.noArticles')}</p>
         )}
      </div>

      {/* Recent Publications Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('landing.recent.title')}</h2>
         {recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} onViewProfile={onViewProfile} />
                ))}
            </div>
         ) : (
            <p className="text-gray-500 dark:text-gray-400">{t('landing.noArticles')}</p>
         )}
      </div>
    </div>
  );
};

export default LandingPage;