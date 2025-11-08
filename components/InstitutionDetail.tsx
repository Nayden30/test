import React from 'react';
import type { Institution, User, Article } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import ArticleCard from './ArticleCard';
import { LinkIcon } from './icons/LinkIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { DocumentDuplicateIcon } from './icons/DocumentDuplicateIcon';
import { UsersIcon } from './icons/UsersIcon';

interface InstitutionDetailProps {
    institution: Institution;
    allUsers: User[];
    allArticles: Article[];
    onViewProfile: (userId: string) => void;
    onSelectArticle: (articleId: string) => void;
}

const InstitutionDetail: React.FC<InstitutionDetailProps> = ({ institution, allUsers, allArticles, onViewProfile, onSelectArticle }) => {
    const { t } = useTranslation();
    const affiliatedUsers = allUsers.filter(u => u.institutionId === institution.id);
    const affiliatedArticles = allArticles.filter(a => affiliatedUsers.some(u => u.id === a.author.id))
        .sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
        .slice(0, 6); // show latest 6

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                    {institution.logoUrl && <img src={institution.logoUrl} alt={`${institution.name} logo`} className="h-24 w-24 object-contain flex-shrink-0 rounded-md bg-gray-100 dark:bg-gray-700 p-2" />}
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{institution.name}</h1>
                        <div className="flex items-center justify-center md:justify-start space-x-4 mt-2 text-gray-500 dark:text-gray-400">
                            <span className="flex items-center"><MapPinIcon className="h-5 w-5 mr-1" />{institution.city}, {institution.country}</span>
                            {institution.websiteUrl && <a href={institution.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-blue-500"><LinkIcon className="h-5 w-5 mr-1" />Website</a>}
                        </div>
                    </div>
                </div>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">{institution.description}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center"><DocumentDuplicateIcon className="h-6 w-6 mr-3 text-blue-500"/> {t('institutions.recentPublications')}</h2>
                         {affiliatedArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {affiliatedArticles.map(article => (
                                    <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} onViewProfile={onViewProfile} />
                                ))}
                            </div>
                         ) : (
                            <p className="text-gray-500 dark:text-gray-400">{t('institutions.noPublications')}</p>
                         )}
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center"><UsersIcon className="h-6 w-6 mr-3 text-purple-500" /> {t('institutions.affiliatedResearchers')} ({affiliatedUsers.length})</h2>
                        <ul className="space-y-3 max-h-96 overflow-y-auto">
                            {affiliatedUsers.map(member => (
                                <li key={member.id} className="flex items-center space-x-3">
                                    <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />
                                    <div>
                                        <button onClick={() => onViewProfile(member.id)} className="font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">{member.name}</button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.specialties.slice(0, 2).join(', ')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstitutionDetail;
