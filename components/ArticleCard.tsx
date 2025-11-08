import React from 'react';
import type { Article } from '../types';
import { ArticleStatus } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { EyeIcon } from './icons/EyeIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';

interface ArticleCardProps {
  article: Article;
  onSelectArticle: (id: string) => void;
  onViewProfile: (userId: string) => void;
}

const statusConfig = {
    [ArticleStatus.PUBLISHED]: { icon: CheckCircleIcon, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/10' },
    [ArticleStatus.UNDER_REVIEW]: { icon: ClockIcon, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-500/10' },
    [ArticleStatus.SUBMITTED]: { icon: DocumentTextIcon, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/10' },
    [ArticleStatus.ACCEPTED]: { icon: CheckCircleIcon, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-500/10' },
    [ArticleStatus.REJECTED]: { icon: DocumentTextIcon, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/10' },
    [ArticleStatus.DRAFT]: { icon: DocumentTextIcon, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-500/10' },
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelectArticle, onViewProfile }) => {
  const { icon: Icon, color, bg } = statusConfig[article.status] || statusConfig[ArticleStatus.DRAFT];
  
  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from firing
    onViewProfile(article.author.id);
  };

  return (
    <div
      onClick={() => onSelectArticle(article.id)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-blue-500/20 transition-shadow duration-300 cursor-pointer flex flex-col overflow-hidden h-full border border-transparent hover:border-blue-500/50"
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bg} ${color}`}>
                <Icon className="h-4 w-4 mr-1.5" />
                {article.status}
            </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <button onClick={handleAuthorClick} className="flex items-center focus:outline-none rounded-full group">
            <img src={article.author.avatarUrl} alt={article.author.name} className="h-6 w-6 rounded-full mr-2 group-hover:ring-2 group-hover:ring-blue-500 transition" />
            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline">{article.author.name}</span>
          </button>
           <span className="mx-1">&middot;</span>
           <span>{new Date(article.submissionDate).toLocaleDateString()}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
          {article.abstract}
        </p>
      </div>

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
            <div className="flex items-center" title="Views">
                <EyeIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span>{article.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center" title="Citations">
                <AcademicCapIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span>{article.citations}</span>
            </div>
        </div>
        <div className="flex space-x-2">
            {article.keywords.slice(0, 2).map(keyword => (
                <span key={keyword} className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium px-2 py-1 rounded-md">{keyword}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;