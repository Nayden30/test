import React, { useState } from 'react';
import type { NewUser, Institution, NewInstitution } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { OrcidIcon } from './icons/OrcidIcon';
import CreateInstitutionForm from './CreateInstitutionForm';

interface RegisterFormProps {
  onRegister: (user: NewUser) => void;
  onNavigateToLogin: () => void;
  institutions: Institution[];
  onCreateInstitution: (newInstitution: NewInstitution) => Institution;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onNavigateToLogin, institutions, onCreateInstitution }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { t } = useTranslation();
  
  const handleOrcidRegister = () => {
     alert(t('register.orcidNotImplemented'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('register.errors.passwordsDoNotMatch'));
      return;
    }
    if (!agreedToTerms) {
      setError(t('register.errors.mustAgreeToTerms'));
      return;
    }
    setError('');
    onRegister({ name, email, institutionId, password });
  };
  
  const handleInstitutionCreated = (newInstitutionData: NewInstitution) => {
    const newInstitution = onCreateInstitution(newInstitutionData);
    setInstitutionId(newInstitution.id);
    setIsCreateModalOpen(false);
  };

  const formInputStyle = "appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";


  return (
    <>
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <CreateInstitutionForm 
            onSubmit={handleInstitutionCreated}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </div>
      )}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-auto">
                  <BookOpenIcon className="h-10 w-10 text-blue-600" />
              </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {t('register.title')}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {t('register.alreadyMember')}{' '}
              <button onClick={onNavigateToLogin} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                {t('register.signInLink')}
              </button>
            </p>
          </div>
          
          <div className="space-y-4">
              <button
                type="button"
                onClick={handleOrcidRegister}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <OrcidIcon className="h-5 w-5 mr-2" />
                {t('register.continueWithOrcid')}
              </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {t('register.orCreateWithEmail')}
              </span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="full-name" className="sr-only">{t('register.fullName.label')}</label>
                <input id="full-name" name="name" type="text" required className={formInputStyle} placeholder={t('register.fullName.placeholder')} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">{t('register.email.label')}</label>
                <input id="email-address" name="email" type="email" autoComplete="email" required className={formInputStyle} placeholder={t('register.email.placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="institution" className="sr-only">{t('register.institution.label')}</label>
                <select id="institution" name="institution" required className={formInputStyle} value={institutionId} onChange={(e) => setInstitutionId(e.target.value)}>
                  <option value="" disabled>{t('register.institution.placeholder')}</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setIsCreateModalOpen(true)} className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mt-2">
                  {t('register.addInstitution.link')}
                </button>
              </div>
              <div>
                <label htmlFor="password-signup" className="sr-only">{t('register.password.label')}</label>
                <input id="password-signup" name="password" type="password" autoComplete="new-password" required className={formInputStyle} placeholder={t('register.password.placeholder')} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">{t('register.confirmPassword.label')}</label>
                <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required className={formInputStyle} placeholder={t('register.confirmPassword.placeholder')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
              <div className="flex items-center">
                  <input
                      id="terms-and-privacy"
                      name="terms-and-privacy"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <label htmlFor="terms-and-privacy" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
                      {t('register.iAgreeTo')} <a href="#terms" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">{t('register.terms')}</a> {t('register.and')} <a href="#privacy" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">{t('register.privacy')}</a>.
                  </label>
              </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={!agreedToTerms}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {t('register.createAccountButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;