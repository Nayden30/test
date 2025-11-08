import React from 'react';
import type { Institution, User } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { BuildingOffice2Icon } from './icons/BuildingOffice2Icon';
import { MapPinIcon } from './icons/MapPinIcon';
import { UsersIcon } from './icons/UsersIcon';

interface InstitutionListProps {
  institutions: Institution[];
  users: User[];
  onViewInstitution: (id: string) => void;
}

const InstitutionCard: React.FC<{ institution: Institution, memberCount: number, onViewInstitution: (id: string) => void }> = ({ institution, memberCount, onViewInstitution }) => {
  const { t } = useTranslation();
  return (
    <div onClick={() => onViewInstitution(institution.id)} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer p-6 flex flex-col">
        {institution.logoUrl && <img src={institution.logoUrl} alt={`${institution.name} logo`} className="h-16 w-16 mb-4 object-contain mx-auto rounded-md bg-gray-100 dark:bg-gray-700 p-1" />}
        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2 text-center">{institution.name}</h3>
        <p className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-4"><MapPinIcon className="h-4 w-4 mr-1"/> {institution.city}, {institution.country}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow line-clamp-3 mb-4">{institution.description}</p>
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center"><UsersIcon className="h-5 w-5 mr-2" /> <span>{memberCount} {t('institutions.member', { count: memberCount })}</span></div>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{t('institutions.viewDetails')}</span>
        </div>
    </div>
  );
};

const InstitutionList: React.FC<InstitutionListProps> = ({ institutions, users, onViewInstitution }) => {
  const { t } = useTranslation();
  const getMemberCount = (institutionId: string) => {
    return users.filter(u => u.institutionId === institutionId).length;
  };

  return (
    <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 text-center">
            <BuildingOffice2Icon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{t('institutions.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('institutions.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {institutions.map(inst => (
                <InstitutionCard key={inst.id} institution={inst} memberCount={getMemberCount(inst.id)} onViewInstitution={onViewInstitution} />
            ))}
        </div>
    </div>
  );
};

export default InstitutionList;