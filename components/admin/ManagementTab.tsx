import React, { useState } from 'react';
import type { User, Article } from '../../types';
import { UserRole } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface ManagementTabProps {
  users: User[];
  articles: Article[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteArticle: (articleId: string) => void;
  onSelectArticle: (articleId: string) => void;
}

const ManagementTab: React.FC<ManagementTabProps> = ({ users, articles, onUpdateUser, onDeleteUser, onDeleteArticle, onSelectArticle }) => {
    const [editingRolesForUserId, setEditingRolesForUserId] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
    const { t } = useTranslation();

    const handleEditRoles = (user: User) => {
        setEditingRolesForUserId(user.id);
        setSelectedRoles(user.roles);
    };

    const handleRoleChange = (role: UserRole) => {
        setSelectedRoles(prev => 
            prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
        );
    };

    const handleSaveRoles = (user: User) => {
        onUpdateUser({ ...user, roles: selectedRoles });
        setEditingRolesForUserId(null);
    };

    const confirmDeleteUser = (userId: string) => {
        if (window.confirm(t('admin.confirmations.deleteUser'))) {
            onDeleteUser(userId);
        }
    };
    
    const confirmDeleteArticle = (articleId: string) => {
        if (window.confirm(t('admin.confirmations.deleteArticle'))) {
            onDeleteArticle(articleId);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('admin.management.title')}</h2>
            {/* User Management */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">{t('admin.userManagement.title')}</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.user')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.roles')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.userManagement.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingRolesForUserId === user.id ? (
                                            <div className="flex flex-col space-y-1">
                                                {Object.values(UserRole).map(role => (
                                                    <label key={role} className="flex items-center text-sm">
                                                        <input type="checkbox" checked={selectedRoles.includes(role)} onChange={() => handleRoleChange(role)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                        <span className="ml-2 capitalize">{role}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map(role => <span key={role} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 capitalize">{role}</span>)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {editingRolesForUserId === user.id ? (
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => handleSaveRoles(user)} className="text-blue-600 hover:text-blue-900">{t('admin.userManagement.save')}</button>
                                                <button onClick={() => setEditingRolesForUserId(null)} className="text-gray-500 hover:text-gray-700">{t('admin.userManagement.cancel')}</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-4">
                                                <button onClick={() => handleEditRoles(user)} title={t('admin.userManagement.editRoles')} className="text-gray-400 hover:text-blue-500"><PencilIcon className="h-5 w-5"/></button>
                                                <button onClick={() => confirmDeleteUser(user.id)} title={t('admin.userManagement.deleteUser')} className="text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Content Management */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">{t('admin.contentManagement.title')}</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                             <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.contentManagement.article')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.contentManagement.author')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.contentManagement.status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('admin.contentManagement.actions')}</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {articles.map(article => (
                                <tr key={article.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 max-w-xs truncate">{article.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{article.author.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">{article.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-4">
                                            <button onClick={() => onSelectArticle(article.id)} className="text-blue-600 hover:text-blue-900">{t('admin.contentManagement.view')}</button>
                                            <button onClick={() => confirmDeleteArticle(article.id)} title={t('admin.contentManagement.deleteArticle')} className="text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManagementTab;
