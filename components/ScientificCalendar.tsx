import React, { useState, useMemo } from 'react';
import type { ScientificEvent } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';

interface ScientificCalendarProps {
  events: ScientificEvent[];
}

const EventCard: React.FC<{ event: ScientificEvent }> = ({ event }) => {
  const { t } = useTranslation();
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const isCFP = event.type === 'Call for Papers';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-6 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
          isCFP ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
        }`}>{event.type}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{event.title}</h3>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1">
        <p><span className="font-semibold">{isCFP ? t('calendar.deadline') : t('calendar.dates')}</span> {formatDate(event.startDate)}{!isCFP && ` - ${formatDate(event.endDate)}`}</p>
        <p><span className="font-semibold">{t('calendar.location')}</span> {event.location}</p>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow mb-4">{event.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {event.disciplines.map(d => <span key={d} className="text-xs bg-gray-100 dark:bg-gray-700 font-medium px-2 py-1 rounded-md">{d}</span>)}
      </div>
      <a href={event.url} target="_blank" rel="noopener noreferrer" className="mt-auto text-center w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        {t('calendar.visitWebsite')}
      </a>
    </div>
  );
};

const ScientificCalendar: React.FC<ScientificCalendarProps> = ({ events }) => {
  const { t } = useTranslation();
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  
  const uniqueDisciplines = useMemo(() => {
    const disciplinesSet = new Set<string>();
    events.forEach(event => event.disciplines.forEach(d => disciplinesSet.add(d)));
    return Array.from(disciplinesSet).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (selectedDisciplines.length > 0) {
      result = result.filter(event => event.disciplines.some(d => selectedDisciplines.includes(d)));
    }
    return result.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events, selectedDisciplines]);
  
  const handleDisciplineChange = (discipline: string) => {
    setSelectedDisciplines(prev => 
      prev.includes(discipline) ? prev.filter(d => d !== discipline) : [...prev, discipline]
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 text-center">
        <CalendarDaysIcon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{t('calendar.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t('calendar.subtitle')}</p>
      </div>

      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('calendar.filterByDiscipline')}</h3>
        <div className="flex flex-wrap gap-2">
          {uniqueDisciplines.map(d => (
            <label key={d} className="flex items-center space-x-2 p-2 rounded-md bg-white dark:bg-gray-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedDisciplines.includes(d)} 
                onChange={() => handleDisciplineChange(d)} 
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{d}</span>
            </label>
          ))}
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t('calendar.noEventsFound')}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('calendar.adjustFilters')}</p>
        </div>
      )}
    </div>
  );
};

export default ScientificCalendar;