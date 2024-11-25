import React from 'react';
import { CalendarDays, List, LayoutList } from 'lucide-react';

type View = 'calendar' | 'timeline' | 'list';

interface ViewSelectorProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onViewChange('calendar')}
        className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
          currentView === 'calendar'
            ? 'bg-indigo-600 text-white border-transparent'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <CalendarDays className="h-4 w-4 mr-2" />
        Calendrier
      </button>
      <button
        onClick={() => onViewChange('timeline')}
        className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
          currentView === 'timeline'
            ? 'bg-indigo-600 text-white border-transparent'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <LayoutList className="h-4 w-4 mr-2" />
        Timeline
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
          currentView === 'list'
            ? 'bg-indigo-600 text-white border-transparent'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <List className="h-4 w-4 mr-2" />
        Liste
      </button>
    </div>
  );
}