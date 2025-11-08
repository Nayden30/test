import React, { useState } from 'react';
import type { User, Article } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { DocumentChartBarIcon } from './icons/DocumentChartBarIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import EditorialStats from './admin/EditorialStats';
import CommunityStats from './admin/CommunityStats';
import ManagementTab from './admin/ManagementTab';

interface AdminDashboardProps {
  users: User[];
  articles: Article[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteArticle: (articleId: string) => void;
  onSelectArticle: (articleId: string) => void;
}

type AdminTab = 'editorial' | 'community' | 'impact' | 'reviewers' | 'management';

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('editorial');
    const { t } = useTranslation();

    const tabs: { id: AdminTab, label: string, icon: React.FC<any> }[] = [
        { id: 'editorial', label: t('admin.tabs.editorial'), icon: DocumentChartBarIcon },
        { id: 'community', label: t('admin.tabs.community'), icon: UsersGroupIcon },
        { id: 'impact', label: t('admin.tabs.impact'), icon: TrendingUpIcon },
        { id: 'reviewers', label: t('admin.tabs.reviewers'), icon: ClipboardDocumentListIcon },
        { id: 'management', label: t('admin.tabs.management'), icon: Cog6ToothIcon },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'editorial':
                return <EditorialStats articles={props.articles} users={props.users} />;
            case 'community':
                return <CommunityStats users={props.users} articles={props.articles} />;
            case 'management':
                return <ManagementTab {...props} />;
            case 'impact':
            case 'reviewers':
                 return (
                    <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <p className="text-gray-500">{t('admin.tabs.comingSoon')}</p>
                    </div>
                 );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('admin.title')}</h1>
                 <div>
                    {/* Date range filter can be added here */}
                </div>
            </div>

            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400' 
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}`
                        }
                    >
                        <tab.icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;