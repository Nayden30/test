import React, { useState } from 'react';
import type { User, Institution } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { OrcidIcon } from './icons/OrcidIcon';

interface LoginFormProps {
  users: User[];
  institutions: Institution[];
  onLogin: (userId: string) => void;
  onNavigateToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ users, institutions, onLogin, onNavigateToRegister }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      onLogin(selectedUserId);
    }
  };
  
  const handleOrcidLogin = () => {
    alert(t('login.orcidNotImplemented'));
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
        <div>
            <div className="mx-auto flex items-center justify-center h-12 w-auto">
                <BookOpenIcon className="h-10 w-10 text-blue-600" />
            </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            {t('login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('login.or')}{' '}
            <button onClick={onNavigateToRegister} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              {t('login.createAccountLink')}
            </button>
          </p>
        </div>

        <div className="space-y-4">
            <button
              type="button"
              onClick={handleOrcidLogin}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <OrcidIcon className="h-5 w-5 mr-2" />
              {t('login.continueWithOrcid')}
            </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {t('login.orDeveloperLogin')}
            </span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="user-select" className="sr-only">{t('login.chooseUserLabel')}</label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              >
                <option value="" disabled>{t('login.selectUserPlaceholder')}</option>
                {users.map((user) => {
                  const institution = institutions.find(i => i.id === user.institutionId);
                  return (
                    <option key={user.id} value={user.id}>
                      {user.name} ({institution?.name || t('login.noAffiliation')})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('login.signInButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;