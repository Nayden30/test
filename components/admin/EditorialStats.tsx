import React, { useMemo } from 'react';
import type { Article, User } from '../../types';
import { ArticleStatus } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import StatCard from './StatCard';
import SimpleBarChart from './SimpleBarChart';
import { BookOpenIcon } from '../icons/BookOpenIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface EditorialStatsProps {
    articles: Article[];
    users: User[];
}

const EditorialStats: React.FC<EditorialStatsProps> = ({ articles }) => {
    const { t } = useTranslation();

    const stats = useMemo(() => {
        const totalSubmissions = articles.length;
        
        const submissionsByMonth = articles.reduce((acc, article) => {
            const month = new Date(article.submissionDate).toLocaleString('default', { month: 'short', year: '2-digit' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const submissionsByDiscipline = articles.flatMap(a => a.disciplines).reduce((acc, discipline) => {
            acc[discipline] = (acc[discipline] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const submissionsByLanguage = articles.reduce((acc, article) => {
            const lang = article.language.toUpperCase();
            acc[lang] = (acc[lang] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const statusCounts = articles.reduce((acc, article) => {
            acc[article.status] = (acc[article.status] || 0) + 1;
            return acc;
        }, {} as Record<ArticleStatus, number>);

        const articlesWithReviews = articles.filter(a => a.reviews.length > 0);
        const timeToDecisionSum = articlesWithReviews.reduce((sum, article) => {
            const firstReviewDate = Math.min(...article.reviews.map(r => new Date(r.date).getTime()));
            return sum + (firstReviewDate - new Date(article.submissionDate).getTime());
        }, 0);
        const avgTimeToDecision = articlesWithReviews.length > 0 ? (timeToDecisionSum / articlesWithReviews.length) / (1000 * 60 * 60 * 24) : 0;
        
        const publishedArticles = articles.filter(a => a.status === ArticleStatus.PUBLISHED && a.publicationDate);
        const timeToPublicationSum = publishedArticles.reduce((sum, article) => {
             const firstReviewDate = article.reviews.length > 0 ? Math.min(...article.reviews.map(r => new Date(r.date).getTime())) : new Date(article.submissionDate).getTime();
             return sum + (new Date(article.publicationDate!).getTime() - firstReviewDate);
        }, 0);
        const avgTimeToPublication = publishedArticles.length > 0 ? (timeToPublicationSum / publishedArticles.length) / (1000 * 60 * 60 * 24) : 0;
        
        const acceptedCount = (statusCounts[ArticleStatus.ACCEPTED] || 0) + (statusCounts[ArticleStatus.PUBLISHED] || 0);
        const rejectedCount = statusCounts[ArticleStatus.REJECTED] || 0;
        const acceptanceRate = (acceptedCount + rejectedCount) > 0 ? (acceptedCount / (acceptedCount + rejectedCount)) * 100 : 0;

        return {
            totalSubmissions,
            submissionsByMonth: Object.entries(submissionsByMonth).map(([label, value]) => ({label, value})).reverse(),
            submissionsByDiscipline: Object.entries(submissionsByDiscipline).map(([label, value]) => ({label, value})),
            submissionsByLanguage: Object.entries(submissionsByLanguage).map(([label, value]) => ({label, value})),
            statusCounts,
            avgTimeToDecision,
            avgTimeToPublication,
            acceptanceRate,
            decisionHistory: articles.flatMap(a => a.reviews.map(r => ({...r, articleTitle: a.title, articleId: a.id }))).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,10),
        };
    }, [articles]);

    return (
        <div className="space-y-6">
            {/* Submission Stats */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('admin.editorial.submissionStats')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard title={t('admin.editorial.totalSubmissions')} value={stats.totalSubmissions} icon={BookOpenIcon} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1"><SimpleBarChart data={stats.submissionsByDiscipline} title={t('admin.editorial.byDiscipline')} /></div>
                    <div className="lg:col-span-1"><SimpleBarChart data={stats.submissionsByLanguage} title={t('admin.editorial.byLanguage')} /></div>
                    <div className="lg:col-span-1"><SimpleBarChart data={stats.submissionsByMonth} title={t('admin.editorial.submissionsOverTime')} /></div>
                </div>
            </div>

            {/* Processing Stats */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('admin.editorial.processingStats')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {Object.values(ArticleStatus).map(status => (
                        <div key={status} className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">{status}</p>
                            <p className="text-2xl font-bold">{stats.statusCounts[status] || 0}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <StatCard title={t('admin.editorial.avgTimeToDecision')} value={`${stats.avgTimeToDecision.toFixed(1)} ${t('admin.editorial.days')}`} icon={ClockIcon} />
                    <StatCard title={t('admin.editorial.avgTimeToPublication')} value={`${stats.avgTimeToPublication.toFixed(1)} ${t('admin.editorial.days')}`} icon={CheckCircleIcon} />
                    <StatCard title={t('admin.editorial.acceptanceRate')} value={`${stats.acceptanceRate.toFixed(1)}%`} icon={CheckCircleIcon} />
                </div>
            </div>

             {/* Decision History */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('admin.editorial.decisionHistory')}</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="text-left text-sm text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="p-2">{t('admin.editorial.article')}</th>
                                <th className="p-2">{t('admin.editorial.reviewer')}</th>
                                <th className="p-2">{t('admin.editorial.recommendation')}</th>
                                <th className="p-2">{t('admin.editorial.date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.decisionHistory.map(review => (
                                <tr key={review.id} className="border-t dark:border-gray-700">
                                    <td className="p-2 font-medium text-gray-800 dark:text-gray-200 max-w-xs truncate">{review.articleTitle}</td>
                                    <td className="p-2">{review.reviewer.name}</td>
                                    <td className="p-2"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">{review.recommendation}</span></td>
                                    <td className="p-2 text-sm text-gray-600 dark:text-gray-300">{new Date(review.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EditorialStats;
