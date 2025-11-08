import React, { useState } from 'react';
import type { User, Thesis, Conference, Project } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { XMarkIcon } from './icons/XMarkIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';

interface EditProfileFormProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onUpdateUser, onClose }) => {
  const [formData, setFormData] = useState<User>(user);
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? null : value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        lat: prev.location?.lat || 0,
        lng: prev.location?.lng || 0,
        [name]: value,
      } as User['location'],
    }));
  };

  const handleSpecialtiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const specialties = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, specialties }));
  };
  
  const handlePortfolioChange = (section: 'thesis' | 'conferences' | 'projects', value: any) => {
    setFormData(prev => ({
        ...prev,
        portfolio: {
            ...(prev.portfolio || { thesis: null, conferences: [], projects: [] }),
            [section]: value,
        }
    }));
  };

  const handleThesisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const currentThesis = formData.portfolio?.thesis || { title: '', university: '', year: 0 };
    const yearValue = name === 'year' ? parseInt(value, 10) || undefined : undefined;
    handlePortfolioChange('thesis', {
        ...currentThesis,
        [name]: yearValue !== undefined ? yearValue : value,
    });
  };

  const handleConferenceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedConferences = [...(formData.portfolio?.conferences || [])];
    const yearValue = name === 'year' ? parseInt(value, 10) || 0 : undefined;
    updatedConferences[index] = { ...updatedConferences[index], [name]: yearValue !== undefined ? yearValue : value };
    handlePortfolioChange('conferences', updatedConferences);
  };

  const addConference = () => {
    const newConference: Conference = { name: '', role: 'Attendee', year: new Date().getFullYear(), location: '' };
    handlePortfolioChange('conferences', [...(formData.portfolio?.conferences || []), newConference]);
  };
  
  const removeConference = (index: number) => {
    const updatedConferences = (formData.portfolio?.conferences || []).filter((_, i) => i !== index);
    handlePortfolioChange('conferences', updatedConferences);
  };
  
  const handleProjectChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedProjects = [...(formData.portfolio?.projects || [])];
    updatedProjects[index] = { ...updatedProjects[index], [name]: value };
    handlePortfolioChange('projects', updatedProjects);
  };

  const addProject = () => {
    const newProject: Project = { name: '', description: '', status: 'Planning' };
    handlePortfolioChange('projects', [...(formData.portfolio?.projects || []), newProject]);
  };

  const removeProject = (index: number) => {
    const updatedProjects = (formData.portfolio?.projects || []).filter((_, i) => i !== index);
    handlePortfolioChange('projects', updatedProjects);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    onClose();
  };

  const formInputStyle = "w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm";
  const formLabelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
        <div className="max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('profile.editProfileModal.title')}</h2>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
            
            <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b dark:border-gray-600 pb-2">{t('profile.editProfileModal.basicInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className={formLabelStyle}>{t('profile.editProfileModal.name')}</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className={formInputStyle} />
                    </div>
                     <div>
                        <label htmlFor="email" className={formLabelStyle}>{t('profile.editProfileModal.email')}</label>
                        <input type="email" id="email" name="email" value={formData.email} className={`${formInputStyle} bg-gray-100 dark:bg-gray-800`} disabled title={t('profile.editProfileModal.emailCannotBeChanged')} />
                    </div>
                </div>
                 <div>
                    <label htmlFor="bio" className={formLabelStyle}>{t('profile.editProfileModal.bio')}</label>
                    <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={3} className={formInputStyle}></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="avatarUrl" className={formLabelStyle}>{t('profile.editProfileModal.avatarUrl')}</label>
                        <input type="text" id="avatarUrl" name="avatarUrl" value={formData.avatarUrl} onChange={handleInputChange} className={formInputStyle} />
                    </div>
                     <div>
                        <label htmlFor="bannerUrl" className={formLabelStyle}>{t('profile.editProfileModal.bannerUrl')}</label>
                        <input type="text" id="bannerUrl" name="bannerUrl" value={formData.bannerUrl} onChange={handleInputChange} className={formInputStyle} />
                    </div>
                </div>
                <h3 className="text-lg font-semibold border-b dark:border-gray-600 pb-2 mt-8">{t('profile.editProfileModal.academicInfo')}</h3>
                <div>
                    <label htmlFor="specialties" className={formLabelStyle}>{t('profile.editProfileModal.specialties')}</label>
                    <input type="text" id="specialties" name="specialties" value={formData.specialties.join(', ')} onChange={handleSpecialtiesChange} className={formInputStyle} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="websiteUrl" className={formLabelStyle}>{t('profile.editProfileModal.websiteUrl')}</label>
                        <input type="url" id="websiteUrl" name="websiteUrl" value={formData.websiteUrl || ''} onChange={handleInputChange} className={formInputStyle} />
                    </div>
                    <div>
                        <label htmlFor="googleScholarUrl" className={formLabelStyle}>{t('profile.editProfileModal.googleScholarUrl')}</label>
                        <input type="url" id="googleScholarUrl" name="googleScholarUrl" value={formData.googleScholarUrl || ''} onChange={handleInputChange} className={formInputStyle} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className={formLabelStyle}>{t('profile.editProfileModal.city')}</label>
                        <input type="text" id="city" name="city" value={formData.location?.city || ''} onChange={handleLocationChange} className={formInputStyle} />
                    </div>
                    <div>
                        <label htmlFor="country" className={formLabelStyle}>{t('profile.editProfileModal.country')}</label>
                        <input type="text" id="country" name="country" value={formData.location?.country || ''} onChange={handleLocationChange} className={formInputStyle} />
                    </div>
                </div>
                <h3 className="text-lg font-semibold border-b dark:border-gray-600 pb-2 mt-8">{t('profile.editProfileModal.portfolio')}</h3>
                <div>
                    <h4 className="font-semibold mb-2">{t('profile.editProfileModal.thesis')}</h4>
                    <div className="p-4 border dark:border-gray-600 rounded-md space-y-3 bg-gray-50 dark:bg-gray-700/50">
                        <input type="text" name="title" placeholder={t('profile.editProfileModal.thesisTitle')} value={formData.portfolio?.thesis?.title || ''} onChange={handleThesisChange} className={formInputStyle} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="university" placeholder={t('profile.editProfileModal.university')} value={formData.portfolio?.thesis?.university || ''} onChange={handleThesisChange} className={formInputStyle} />
                            <input type="number" name="year" placeholder={t('profile.editProfileModal.year')} value={formData.portfolio?.thesis?.year || ''} onChange={handleThesisChange} className={formInputStyle} />
                        </div>
                        <input type="url" name="url" placeholder={t('profile.editProfileModal.urlOptional')} value={formData.portfolio?.thesis?.url || ''} onChange={handleThesisChange} className={formInputStyle} />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{t('profile.editProfileModal.conferences')}</h4>
                        <button type="button" onClick={addConference} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"><PlusIcon className="h-4 w-4 mr-1" /> {t('profile.editProfileModal.add')}</button>
                    </div>
                    <div className="space-y-3">
                    {formData.portfolio?.conferences?.map((conf, index) => (
                        <div key={index} className="p-3 border dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50 relative">
                            <button type="button" onClick={() => removeConference(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4"/></button>
                            <input type="text" name="name" placeholder={t('profile.editProfileModal.conferenceName')} value={conf.name} onChange={(e) => handleConferenceChange(index, e)} className={`${formInputStyle} mb-2`} />
                             <div className="grid grid-cols-3 gap-2">
                                <select name="role" value={conf.role} onChange={(e) => handleConferenceChange(index, e)} className={formInputStyle}>
                                    <option>Speaker</option><option>Attendee</option><option>Organizer</option><option>Keynote Speaker</option>
                                </select>
                                <input type="number" name="year" placeholder={t('profile.editProfileModal.year')} value={conf.year} onChange={(e) => handleConferenceChange(index, e)} className={formInputStyle} />
                                <input type="text" name="location" placeholder={t('profile.editProfileModal.location')} value={conf.location} onChange={(e) => handleConferenceChange(index, e)} className={formInputStyle} />
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{t('profile.editProfileModal.projects')}</h4>
                        <button type="button" onClick={addProject} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"><PlusIcon className="h-4 w-4 mr-1" /> {t('profile.editProfileModal.add')}</button>
                    </div>
                    <div className="space-y-3">
                    {formData.portfolio?.projects?.map((proj, index) => (
                        <div key={index} className="p-3 border dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700/50 relative">
                            <button type="button" onClick={() => removeProject(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4"/></button>
                            <div className="flex gap-2 mb-2">
                                <input type="text" name="name" placeholder={t('profile.editProfileModal.projectName')} value={proj.name} onChange={(e) => handleProjectChange(index, e)} className={`${formInputStyle} flex-grow`} />
                                <select name="status" value={proj.status} onChange={(e) => handleProjectChange(index, e)} className={formInputStyle}>
                                    <option>Ongoing</option><option>Completed</option><option>Planning</option>
                                </select>
                            </div>
                            <textarea name="description" placeholder={t('profile.editProfileModal.description')} value={proj.description} onChange={(e) => handleProjectChange(index, e)} className={`${formInputStyle} mb-2`} rows={2}></textarea>
                            <input type="url" name="url" placeholder={t('profile.editProfileModal.projectUrlOptional')} value={proj.url || ''} onChange={(e) => handleProjectChange(index, e)} className={formInputStyle} />
                        </div>
                    ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end items-center border-t dark:border-gray-700 pt-4 mt-8 space-x-3">
                <button type="button" onClick={onClose} className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold px-6 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition">{t('profile.editProfileModal.cancel')}</button>
                <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-md hover:bg-blue-700 transition">{t('profile.editProfileModal.saveChanges')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
