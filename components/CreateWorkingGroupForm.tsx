import React, { useState } from 'react';
import type { NewWorkingGroup } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface CreateWorkingGroupFormProps {
  onSubmit: (group: NewWorkingGroup) => void;
}

const CreateWorkingGroupForm: React.FC<CreateWorkingGroupFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bibliography, setBibliography] = useState('');
  const { t } = useTranslation();
  
  const formInputStyle = "w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert(t('createGroup.requiredFieldsError'));
      return;
    }
    onSubmit({ name, description, bibliography });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b dark:border-gray-700 pb-4">{t('createGroup.title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('createGroup.name.label')}</label>
          <input 
            type="text" 
            id="group-name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            className={formInputStyle} 
            placeholder={t('createGroup.name.placeholder')}
          />
        </div>

        <div>
          <label htmlFor="group-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('createGroup.description.label')}</label>
          <textarea 
            id="group-description" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            required 
            rows={4} 
            className={formInputStyle}
            placeholder={t('createGroup.description.placeholder')}
          ></textarea>
        </div>

        <div>
          <label htmlFor="group-bibliography" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('createGroup.bibliography.label')}</label>
          <textarea 
            id="group-bibliography" 
            value={bibliography} 
            onChange={e => setBibliography(e.target.value)} 
            rows={6} 
            className={formInputStyle}
            placeholder={t('createGroup.bibliography.placeholder')}
          ></textarea>
        </div>

        <div className="flex justify-end pt-4 border-t dark:border-gray-700">
          <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md hover:bg-blue-700 transition text-lg">{t('createGroup.submitButton')}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkingGroupForm;