import React, { useState, useMemo } from 'react';
import type { User, Institution } from '../types';
import WorldMapSvg from './WorldMapSvg';
import { XMarkIcon } from './icons/XMarkIcon';
import { useTranslation } from '../hooks/useTranslation';

interface LinguistMapProps {
  users: User[];
  institutions: Institution[];
  onViewProfile: (userId: string) => void;
}

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

// Mercator projection function
const getPixelCoordinates = (lat: number, lng: number): { x: number; y: number } => {
  const x = (lng + 180) * (MAP_WIDTH / 360);
  
  const latRad = lat * Math.PI / 180;
  const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  const y = (MAP_HEIGHT / 2) - (MAP_WIDTH * mercN / (2 * Math.PI));

  return { x, y };
};

const LinguistMap: React.FC<LinguistMapProps> = ({ users, institutions, onViewProfile }) => {
    const [activeUser, setActiveUser] = useState<User | null>(null);
    const { t } = useTranslation();

    const usersWithLocation = useMemo(() => {
        return users
            .filter(user => user.location)
            .map(user => ({
                ...user,
                coords: getPixelCoordinates(user.location!.lat, user.location!.lng),
            }));
    }, [users]);
    
    const activeUserInstitution = useMemo(() => {
        if (!activeUser) return null;
        return institutions.find(i => i.id === activeUser.institutionId);
    }, [activeUser, institutions]);

    const handlePinClick = (user: User) => {
        setActiveUser(user);
    };

    const handleCloseCard = () => {
        setActiveUser(null);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 relative overflow-hidden">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">{t('linguistMap.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">{t('linguistMap.subtitle')}</p>
            
            <div className="relative w-full overflow-hidden" style={{ paddingTop: '50%' /* 2:1 Aspect Ratio */ }}>
                <div className="absolute inset-0 cursor-pointer" onClick={handleCloseCard}>
                    <WorldMapSvg className="w-full h-full" />
                    
                    {usersWithLocation.map(user => (
                        <button
                            key={user.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none z-10"
                            style={{ left: `${(user.coords.x / MAP_WIDTH) * 100}%`, top: `${(user.coords.y / MAP_HEIGHT) * 100}%` }}
                            onClick={(e) => { e.stopPropagation(); handlePinClick(user); }}
                            aria-label={`View profile of ${user.name}`}
                        >
                           <span className="relative flex h-3 w-3">
                              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeUser?.id === user.id ? 'bg-blue-300' : 'bg-blue-400'} opacity-75`}></span>
                              <span className={`relative inline-flex rounded-full h-3 w-3 ${activeUser?.id === user.id ? 'bg-blue-400 ring-2 ring-white' : 'bg-blue-500'}`}></span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 ease-in-out ${activeUser ? 'translate-y-0' : 'translate-y-full'}`}>
                 {activeUser && (
                    <div 
                        className="relative max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 border dark:border-gray-700 z-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={handleCloseCard} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-30">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <div className="flex items-center space-x-4">
                            <img src={activeUser.avatarUrl} alt={activeUser.name} className="h-16 w-16 rounded-full flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{activeUser.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{activeUserInstitution?.name || t('login.noAffiliation')}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">{activeUser.location?.city}, {activeUser.location?.country}</p>
                                <button 
                                    onClick={() => { onViewProfile(activeUser.id); handleCloseCard(); }}
                                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-1"
                                >
                                    {t('linguistMap.viewProfile')}
                                </button>
                            </div>
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default LinguistMap;