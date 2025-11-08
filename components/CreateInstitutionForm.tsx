import React, { useState } from 'react';
import type { NewInstitution } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { XMarkIcon } from './icons/XMarkIcon';

interface CreateInstitutionFormProps {
  onSubmit: (institution: NewInstitution) => void;
  onClose: () => void;
}

const CreateInstitutionForm: React.FC<CreateInstitutionFormProps> = ({ onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !country.trim() || !description.trim()) {
        alert(t('createInstitution.requiredFields'));
        return;
    }
    onSubmit({ name, city, country, websiteUrl, description });
  };

  const formInputStyle = "w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">{t('createInstitution.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="inst-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('createInstitution.name.label')}</label>
                <input type="text" id="inst-name" value={name} onChange={e => setName(e.target.value)} required className={formInputStyle} placeholder={t('createInstitution.name.placeholder')} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="inst-city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('createInstitution.city.label')}</label>
                    <input type="text" id="inst-city" value={city} onChange={e => setCity(e.target.value)} required className={formInputStyle} placeholder={t('createInstitution.city.placeholder')} />
                </div>
                <div>
                    <label htmlFor="inst-country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('createInstitution.country.label')}</label>
                    <input type="text" id="inst-country" value={country} onChange={e => setCountry(e.target.value)} required className={formInputStyle} placeholder={t('createInstitution.country.placeholder')} />
                </div>
            </div>
            <div>
                <label htmlFor="inst-website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('createInstitution.website.label')}</label>
                <input type="url" id="inst-website" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} className={formInputStyle} placeholder={t('createInstitution.website.placeholder')} />
            </div>
             <div>
                <label htmlFor="inst-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('createInstitution.description.label')}</label>
                <textarea id="inst-description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className={formInputStyle} placeholder={t('createInstitution.description.placeholder')}></textarea>
            </div>
             <div className="flex justify-end pt-4">
                <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-700 transition">{t('createInstitution.addButton')}</button>
            </div>
        </form>
    </div>
  );
};

export default CreateInstitutionForm;
