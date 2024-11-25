import React, { useState } from 'react';
import { Subject, Category, TargetType } from '../types';
import { useAuth } from '../context/AuthContext';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

const subjects: Subject[] = [
  'Communication',
  'SAE',
  'Anglais',
  'Informatique',
  'Management',
  'Marketing',
];

const categories: Category[] = ['C2', 'C1', 'B2', 'B1', 'A2', 'A1'];

interface AssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignment: any) => Promise<void>;
}

export function AssignmentForm({ isOpen, onClose, onSubmit }: AssignmentFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState<Subject>('Communication');
  const [dueDate, setDueDate] = useState('');
  const [targetType, setTargetType] = useState<TargetType>('global');
  const [targetGroups, setTargetGroups] = useState<Category[]>([]);
  const [targetUsers, setTargetUsers] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      subject,
      due_date: dueDate,
      target_type: targetType,
      target_groups: targetType === 'group' ? targetGroups : [],
      target_users: targetType === 'personal' ? targetUsers : [],
      created_by: user?.id,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-xl bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-lg font-medium">
              Nouveau devoir
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Matière
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="input mt-1"
              >
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date limite
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de cible
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as TargetType)}
                className="input mt-1"
              >
                <option value="global">Global</option>
                <option value="group">Groupe</option>
                <option value="personal">Personnel</option>
              </select>
            </div>

            {targetType === 'group' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Groupes cibles
                </label>
                <select
                  multiple
                  value={targetGroups}
                  onChange={(e) => {
                    const values = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value as Category
                    );
                    setTargetGroups(values);
                  }}
                  className="input mt-1"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-4">
              <button type="submit" className="btn w-full">
                Créer le devoir
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}