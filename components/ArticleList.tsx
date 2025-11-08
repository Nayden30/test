import React, { useState, useMemo, useEffect } from 'react';
import type { Article } from '../types';
import ArticleCard from './ArticleCard';
import ArticleCardSkeleton from './ArticleCardSkeleton';
import { useTranslation } from '../hooks/useTranslation';

interface ArticleListProps {
  articles: Article[];
  onSelectArticle: (id: string) => void;
  onViewProfile: (userId: string) => void;
  initialKeywordFilter?: string | null;
}

const ITEMS_PER_PAGE = 9;

const ArticleList: React.FC<ArticleListProps> = ({ articles, onSelectArticle, onViewProfile, initialKeywordFilter }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  
  // Filters state
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] =useState('');
  const [sortBy, setSortBy] = useState<string>('date_desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 750); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (initialKeywordFilter) {
      setSelectedKeywords([initialKeywordFilter.toLowerCase()]);
    } else {
      setSelectedKeywords([]);
    }
  }, [initialKeywordFilter]);


  const uniqueAuthors = useMemo(() => {
    const authorsMap = new Map<string, {id: string, name: string}>();
    articles.forEach(article => {
        if (!authorsMap.has(article.author.id)) {
            authorsMap.set(article.author.id, {id: article.author.id, name: article.author.name});
        }
    });
    return Array.from(authorsMap.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [articles]);

  const uniqueDisciplines = useMemo(() => {
    const disciplinesSet = new Set<string>();
    articles.forEach(article => {
        article.disciplines.forEach(discipline => disciplinesSet.add(discipline));
    });
    return Array.from(disciplinesSet).sort();
  }, [articles]);

  const resetAllFilters = () => {
    setSelectedAuthors([]);
    setSelectedDisciplines([]);
    setStartDate('');
    setEndDate('');
    setSelectedKeywords([]);
    setCurrentPage(1);
  }

  const filteredAndSortedArticles = useMemo(() => {
    let result = [...articles];

    // Advanced filtering
    if (selectedAuthors.length > 0) {
        result = result.filter(article => selectedAuthors.includes(article.author.id));
    }
    if (selectedDisciplines.length > 0) {
        result = result.filter(article => article.disciplines.some(d => selectedDisciplines.includes(d)));
    }
    if (selectedKeywords.length > 0) {
        result = result.filter(article => article.keywords.some(k => selectedKeywords.includes(k.toLowerCase())));
    }
    if (startDate) {
        const startDateTime = new Date(startDate).getTime();
        result = result.filter(article => new Date(article.submissionDate).getTime() >= startDateTime);
    }
    if (endDate) {
        // Include the entire end day
        const endDateTime = new Date(endDate).setHours(23, 59, 59, 999);
        result = result.filter(article => new Date(article.submissionDate).getTime() <= endDateTime);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
        case 'citations_desc':
          return b.citations - a.citations;
        case 'views_desc':
          return b.views - a.views;
        case 'date_desc':
        default:
          return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
      }
    });

    return result;
  }, [articles, sortBy, selectedAuthors, selectedDisciplines, selectedKeywords, startDate, endDate]);
  
  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedAuthors, selectedDisciplines, selectedKeywords, startDate, endDate, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredAndSortedArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, selectedItems: string[], item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const sortOptions = [
      { value: 'date_desc', label: t('articleList.sort.newest') },
      { value: 'date_asc', label: t('articleList.sort.oldest') },
      { value: 'citations_desc', label: t('articleList.sort.mostCited') },
      { value: 'views_desc', label: t('articleList.sort.mostViewed') },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-24">
            <h2 className="text-lg font-bold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">{t('articleList.filters')}</h2>
            {selectedKeywords.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2">{t('articleList.activeKeyword')}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedKeywords.map(keyword => (
                    <span key={keyword} className="flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-semibold pl-2 pr-1 py-1 rounded-full">
                      {keyword}
                      <button onClick={() => setSelectedKeywords(prev => prev.filter(k => k !== keyword))} className="ml-1 text-blue-500 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4">
              {/* Discipline Filter */}
              <div>
                <h3 className="font-semibold text-sm mb-2">{t('articleList.discipline')}</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                  {uniqueDisciplines.map(d => (
                    <label key={d} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <input type="checkbox" checked={selectedDisciplines.includes(d)} onChange={() => handleCheckboxChange(setSelectedDisciplines, selectedDisciplines, d)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Author Filter */}
              <div>
                <h3 className="font-semibold text-sm mb-2">{t('articleList.author')}</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
                  {uniqueAuthors.map(a => (
                    <label key={a.id} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <input type="checkbox" checked={selectedAuthors.includes(a.id)} onChange={() => handleCheckboxChange(setSelectedAuthors, selectedAuthors, a.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2">{a.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Date Filters */}
               <div>
                  <h3 className="font-semibold text-sm mb-2">{t('articleList.dateRange')}</h3>
                  <div className="space-y-2">
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="From"/>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="To"/>
                  </div>
              </div>
            </div>
            <button onClick={resetAllFilters} className="w-full mt-6 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">{t('articleList.resetFilters')}</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-3/4 lg:w-4/5">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('articleList.title')} ({filteredAndSortedArticles.length})</h1>
            <div>
              <label htmlFor="sort-by" className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">{t('articleList.sortBy')}</label>
              <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                  {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
        </div>
        
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
            </div>
        ) : paginatedArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {paginatedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} onViewProfile={onViewProfile} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">{t('articleList.previous')}</button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{t('articleList.page', { currentPage, totalPages })}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">{t('articleList.next')}</button>
                </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('articleList.noArticlesFound')}</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">{t('articleList.adjustFilters')}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArticleList;