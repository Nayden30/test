import React from 'react';
import type { WorkingGroup } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { UsersGroupIcon } from './icons/UsersGroupIcon';

interface WorkingGroupListProps {
  workingGroups: WorkingGroup[];
  onViewGroup: (groupId: string) => void;
  onNavigate: (view: 'createGroup') => void;
}

const WorkingGroupCard: React.FC<{ group: WorkingGroup; onViewGroup: (id: string) => void }> = ({ group, onViewGroup }) => {
  const { t } = useTranslation();
  return (
    <div 
      onClick={() => onViewGroup(group.id)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer p-6 flex flex-col"
    >
      <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{group.name}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow line-clamp-3 mb-4">{group.description}</p>
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <UsersGroupIcon className="h-5 w-5 mr-2" />
          <span>{group.members.length} {t('workingGroups.member', { count: group.members.length })}</span>
        </div>
        <span className="font-semibold text-blue-600 dark:text-blue-400">{t('workingGroups.viewProject')}</span>
      </div>
    </div>
  );
};

const WorkingGroupList: React.FC<WorkingGroupListProps> = ({ workingGroups, onViewGroup, onNavigate }) => {
  const { t } = useTranslation();
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('workingGroups.title')}</h1>
        <button
          onClick={() => onNavigate('createGroup')}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('workingGroups.createButton')}
        </button>
      </div>

      {workingGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workingGroups.map(group => (
            <WorkingGroupCard key={group.id} group={group} onViewGroup={onViewGroup} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('workingGroups.empty.title')}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('workingGroups.empty.description')}</p>
        </div>
      )}
    </div>
  );
};

export default WorkingGroupList;