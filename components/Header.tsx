import React, { useState, useMemo } from 'react';
import type { User, Notification, Message } from '../types';
import { UserRole } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../i18n/LanguageContext';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { ArrowLeftOnRectangleIcon } from './icons/ArrowLeftOnRectangleIcon';
import { ArrowRightOnRectangleIcon } from './icons/ArrowRightOnRectangleIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { BellIcon } from './icons/BellIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { UsersGroupIcon } from './icons/UsersGroupIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { BuildingOffice2Icon } from './icons/BuildingOffice2Icon';
import { ChatBubbleLeftEllipsisIcon } from './icons/ChatBubbleLeftEllipsisIcon';


interface HeaderProps {
  currentUser: User | null;
  onNavigate: (view: 'landing' | 'list' | 'submit' | 'login' | 'register' | 'feed' | 'admin' | 'groupsList' | 'calendar' | 'institutionList' | 'messages') => void;
  onLogout: () => void;
  onViewProfile: (userId: string) => void;
  theme: string;
  toggleTheme: () => void;
  notifications: Notification[];
  unreadMessagesCount: number;
  onSelectArticle: (articleId: string) => void;
}

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useLanguage();
  
    const inactiveStyle = "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200";
    const activeStyle = "font-bold text-blue-600 dark:text-blue-400";
  
    return (
      <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
        <button
          onClick={() => setLocale('fr')}
          className={`px-2 py-0.5 rounded-full text-sm transition ${locale === 'fr' ? activeStyle : inactiveStyle}`}
        >
          FR
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
        <button
          onClick={() => setLocale('en')}
          className={`px-2 py-0.5 rounded-full text-sm transition ${locale === 'en' ? activeStyle : inactiveStyle}`}
        >
          EN
        </button>
      </div>
    );
};

export const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, onLogout, onViewProfile, theme, toggleTheme, notifications, unreadMessagesCount, onSelectArticle }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { t } = useTranslation();
  
  const handleNotificationClick = (notif: Notification) => {
    if (notif.type === 'new_message') {
        onNavigate('messages');
    } else if (notif.articleId) {
        onSelectArticle(notif.articleId);
    } else if (notif.eventId) {
        onNavigate('calendar');
    }
    setNotificationsOpen(false);
  };

  const unreadNotificationsCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <BookOpenIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">{t('header.titlePart1')} <span className="text-blue-600">{t('header.titlePart2')}</span></span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-grow max-w-xl mx-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition"
            />
          </div>

          {/* Actions and User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
             <LanguageSwitcher />
             <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
             </button>
            {currentUser ? (
              <>
                <button onClick={() => onNavigate('messages')} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                    <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
                    {unreadMessagesCount > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                </button>
                <div className="relative">
                    <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                        <BellIcon className="h-6 w-6" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>
                     {notificationsOpen && (
                        <div 
                            onMouseLeave={() => setNotificationsOpen(false)}
                            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
                        >
                          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t('header.notifications')}</h3>
                          </div>
                          {notifications.length > 0 ? (
                            <div>
                              {notifications.map(notif => (
                                <div key={notif.id} onClick={() => handleNotificationClick(notif)} className="p-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700/50">
                                  <p>{t(notif.messageKey, notif.messagePayload)}</p>
                                  <p className="text-xs text-gray-400 mt-1">{new Date(notif.date).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="p-4 text-sm text-gray-500">{t('header.noNotifications')}</p>
                          )}
                        </div>
                     )}
                </div>
                
                {currentUser.roles.includes(UserRole.AUTHOR) && (
                    <button
                      onClick={() => onNavigate('submit')}
                      className="hidden sm:inline-block bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
                    >
                      {t('header.submitArticle')}
                    </button>
                )}

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-10 w-10 rounded-full border-2 border-transparent hover:border-blue-500" />
                    <span className="hidden lg:inline font-medium text-gray-700 dark:text-gray-200">{currentUser.name}</span>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div 
                        onMouseLeave={() => setDropdownOpen(false)}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                    >
                      <button onClick={() => { onViewProfile(currentUser.id); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('header.yourProfile')}</button>
                      <button onClick={() => { onNavigate('feed'); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('header.myFeed')}</button>
                      <button onClick={() => { onNavigate('messages'); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('header.messages')}</button>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <button onClick={() => { onNavigate('list'); setDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">{t('header.publications')}</button>
                      <button onClick={() => { onNavigate('groupsList'); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <UsersGroupIcon className="h-5 w-5 mr-2" />
                        {t('header.workingGroups')}
                      </button>
                      <button onClick={() => { onNavigate('institutionList'); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <BuildingOffice2Icon className="h-5 w-5 mr-2" />
                        {t('header.institutions')}
                      </button>
                      <button onClick={() => { onNavigate('calendar'); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CalendarDaysIcon className="h-5 w-5 mr-2" />
                        {t('header.calendar')}
                      </button>
                       {currentUser.roles.includes(UserRole.ADMIN) && (
                         <>
                          <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                          <button onClick={() => { onNavigate('admin'); setDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                             <ShieldCheckIcon className="h-5 w-5 mr-2" />
                            {t('header.adminDashboard')}
                          </button>
                         </>
                       )}
                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                      <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                        {t('header.logOut')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                 <button
                  onClick={() => onNavigate('login')}
                  className="hidden sm:inline-flex items-center text-gray-600 dark:text-gray-300 font-semibold px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                  {t('header.logIn')}
                </button>
                 <button
                  onClick={() => onNavigate('register')}
                  className="hidden sm:inline-flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                   <UserPlusIcon className="h-5 w-5 mr-2" />
                   {t('header.signUp')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};