import React from 'react';
import { Assignment } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, Clock } from 'lucide-react';

interface TimelineProps {
  assignments: Assignment[];
  onToggleComplete: (id: string) => Promise<void>;
}

export function Timeline({ assignments, onToggleComplete }: TimelineProps) {
  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedAssignments.map((assignment, idx) => (
          <li key={assignment.id}>
            <div className="relative pb-8">
              {idx !== sortedAssignments.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      assignment.completed
                        ? 'bg-green-500'
                        : 'bg-indigo-500'
                    }`}
                  >
                    <Clock className="h-5 w-5 text-white" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="relative bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {assignment.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                          {assignment.subject}
                        </span>
                      </div>
                      <button
                        onClick={() => onToggleComplete(assignment.id)}
                        className={`ml-4 p-2 rounded-full ${
                          assignment.completed
                            ? 'text-green-600 bg-green-100'
                            : 'text-gray-400 bg-gray-100'
                        }`}
                      >
                        <CheckCircle className="h-6 w-6" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {assignment.description}
                    </p>
                    <time className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {format(new Date(assignment.dueDate), "d MMMM yyyy 'à' HH:mm", {
                        locale: fr,
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}