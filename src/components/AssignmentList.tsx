import React from 'react';
import { Assignment } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, Clock } from 'lucide-react';

interface AssignmentListProps {
  assignments: Assignment[];
  onToggleComplete: (id: string) => Promise<void>;
}

export function AssignmentList({ assignments, onToggleComplete }: AssignmentListProps) {
  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="card">
          <div className="p-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {assignment.title}
                </h3>
                <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                  {assignment.subject}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{assignment.description}</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {format(new Date(assignment.dueDate), "d MMMM yyyy 'à' HH:mm", {
                  locale: fr,
                })}
              </div>
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
        </div>
      ))}
    </div>
  );
}