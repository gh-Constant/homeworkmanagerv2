import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Assignment } from '../types';
import frLocale from '@fullcalendar/core/locales/fr';

interface CalendarProps {
  assignments: Assignment[];
}

export function Calendar({ assignments }: CalendarProps) {
  const events = assignments.map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    start: assignment.dueDate,
    backgroundColor: assignment.completed ? '#10B981' : '#4F46E5',
    borderColor: assignment.completed ? '#10B981' : '#4F46E5',
    extendedProps: {
      description: assignment.description,
      subject: assignment.subject,
    },
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        locale={frLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        height="auto"
        eventClick={(info) => {
          const event = info.event;
          alert(`
            ${event.title}
            ${event.extendedProps.subject}
            ${event.extendedProps.description}
            Date: ${new Date(event.start!).toLocaleString('fr-FR')}
          `);
        }}
      />
    </div>
  );
}