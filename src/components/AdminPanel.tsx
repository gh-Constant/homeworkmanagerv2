import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Assignment } from '../types';
import { Users, BookOpen, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssignments: 0,
    completedAssignments: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data as User[]);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    }
  };

  const fetchStats = async () => {
    try {
      const { data: users } = await supabase.from('users').select('*');
      const { data: assignments } = await supabase.from('assignments').select('*');
      const completed = assignments?.filter((a) => a.completed) || [];

      setStats({
        totalUsers: users?.length || 0,
        totalAssignments: assignments?.length || 0,
        completedAssignments: completed.length,
      });
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw error;
      setUsers(users.filter((user) => user.id !== userId));
      toast.success('Utilisateur supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Utilisateurs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalUsers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Devoirs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalAssignments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Devoirs complétés
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.completedAssignments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">
            Liste des utilisateurs
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      Groupe: {user.category}
                    </p>
                  </div>
                  {user.username !== 'root' && (
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="btn-secondary text-red-600 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}