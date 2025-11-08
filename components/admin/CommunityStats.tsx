import React, { useMemo } from 'react';
import type { Article, User } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import StatCard from './StatCard';
import SimpleBarChart from './SimpleBarChart';
import { UsersIcon } from '../icons/UsersIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';

interface CommunityStatsProps {
    articles: Article[];
    users: User[];
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ articles, users }) => {
    const { t } = useTranslation();

    const stats = useMemo(() => {
        const usersByRole = users.flatMap(u => u.roles).reduce((acc, role) => {
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostActiveReviewers = articles.flatMap(a => a.reviews).reduce((acc, review) => {
            acc[review.reviewer.name] = (acc[review.reviewer.name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalUsers: users.length,
            usersByRole: Object.entries(usersByRole).map(([label, value]) => ({label, value})),
            // FIX: The reduce function was missing an initial value, causing an error when trying to add an object (the first article) to a number. Added 0 as the initial value for the sum.
            totalComments: articles.reduce((sum, a) => sum + a.comments.length, 0),
            mostDiscussedArticles: [...articles].sort((a,b) => b.comments.length - a.comments.length).slice(0,5),
            mostActiveReviewers: Object.entries(mostActiveReviewers).map(([label, value]) => ({label, value})).sort((a,b) => b.value - a.value).slice(0,5),
        };
    }, [articles, users]);
    
    return (
        <div className="space-y-6">
            {/* General Data */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('admin.community.generalData')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard title={t('admin.community.totalUsers')} value={stats.totalUsers} icon={UsersIcon} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SimpleBarChart data={stats.usersByRole} title={t('admin.community.usersByRole')} />
                    {/* Placeholder for users by institution chart */}
                </div>
            </div>

            {/* Community Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{t('admin.community.activity')}</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard title={t('admin.community.totalComments')} value={stats.totalComments} icon={ChatBubbleLeftRightIcon} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{t('admin.community.mostDiscussed')}</h3>
                        <ul className="space-y-2">
                            {stats.mostDiscussedArticles.map(article => (
                                <li key={article.id} className="text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between">
                                    <span className="truncate max-w-xs">{article.title}</span>
                                    <span className="font-bold">{article.comments.length} {t('admin.community.comments')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2">{t('admin.community.mostActiveReviewers')}</h3>
                         <ul className="space-y-2">
                            {stats.mostActiveReviewers.map(reviewer => (
                                <li key={reviewer.label} className="text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between">
                                    <span>{reviewer.label}</span>
                                    <span className="font-bold">{reviewer.value} {t('admin.community.reviews')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityStats;