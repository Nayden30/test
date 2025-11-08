import React, { useState } from 'react';
import type { WorkingGroup, Article, User, Institution } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import ArticleCard from './ArticleCard';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { DocumentDuplicateIcon } from './icons/DocumentDuplicateIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';


interface WorkingGroupDetailProps {
  group: WorkingGroup;
  allArticles: Article[];
  users: User[];
  institutions: Institution[];
  currentUser: User | null;
  onSelectArticle: (articleId: string) => void;
  onViewProfile: (userId: string) => void;
  onAddMember: (groupId: string, userId: string) => void;
}

const WorkingGroupDetail: React.FC<WorkingGroupDetailProps> = ({ group, allArticles, users, institutions, currentUser, onSelectArticle, onViewProfile, onAddMember }) => {
    const { t } = useTranslation();
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [selectedUserToAdd, setSelectedUserToAdd] = useState('');

    const associatedArticles = allArticles.filter(a => a.workingGroupId === group.id || group.associatedArticles.includes(a.id));
    const members = users.filter(u => group.members.includes(u.id));

    const isCoordinator = currentUser && group.coordinators.includes(currentUser.id);
    const potentialNewMembers = users.filter(user => !group.members.includes(user.id));

    const handleConfirmAddMember = () => {
        if (selectedUserToAdd) {
            onAddMember(group.id, selectedUserToAdd);
            setIsAddingMember(false);
            setSelectedUserToAdd('');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-4">
                    <UsersGroupIcon className="h-10 w-10 text-blue-600" />
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{group.name}</h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300">{group.description}</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">{t('groupDetail.createdOn')} {new Date(group.createdDate).toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                     {/* Associated Articles */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center"><DocumentDuplicateIcon className="h-6 w-6 mr-3 text-blue-500"/> {t('groupDetail.publications')}</h2>
                         {associatedArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {associatedArticles.map(article => (
                                    <ArticleCard key={article.id} article={article} onSelectArticle={onSelectArticle} onViewProfile={onViewProfile} />
                                ))}
                            </div>
                         ) : (
                            <p className="text-gray-500 dark:text-gray-400">{t('groupDetail.noPublications')}</p>
                         )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Members */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">{t('groupDetail.members', { count: members.length })}</h2>
                        <ul className="space-y-3">
                            {members.map(member => {
                                const institution = institutions.find(i => i.id === member.institutionId);
                                return (
                                <li key={member.id} className="flex items-center space-x-3">
                                    <img src={member.avatarUrl} alt={member.name} className="h-10 w-10 rounded-full" />
                                    <div>
                                        <button onClick={() => onViewProfile(member.id)} className="font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline">{member.name}</button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{institution?.name || t('login.noAffiliation')}</p>
                                    </div>
                                </li>
                            )})}
                        </ul>

                        {isCoordinator && (
                            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                                {!isAddingMember ? (
                                    <button 
                                        onClick={() => setIsAddingMember(true)}
                                        className="w-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                                    >
                                        <UserPlusIcon className="h-5 w-5 mr-2"/>
                                        {t('groupDetail.addMember')}
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('groupDetail.selectUserToAdd')}</h3>
                                        <select
                                            value={selectedUserToAdd}
                                            onChange={e => setSelectedUserToAdd(e.target.value)}
                                            className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="" disabled>{t('groupDetail.selectUserPlaceholder')}</option>
                                            {potentialNewMembers.map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={handleConfirmAddMember}
                                                disabled={!selectedUserToAdd}
                                                className="flex-1 bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
                                            >
                                                {t('groupDetail.confirm')}
                                            </button>
                                            <button 
                                                onClick={() => setIsAddingMember(false)}
                                                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                                            >
                                                {t('groupDetail.cancel')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bibliography */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center"><LightBulbIcon className="h-6 w-6 mr-3 text-yellow-500" /> {t('groupDetail.bibliography')}</h2>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                           <p>
                             {group.bibliography.split('* ').map((item, index) => 
                                index > 0 ? <li key={index}>{item}</li> : null
                             )}
                           </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkingGroupDetail;