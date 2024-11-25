import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Assignment, User } from '../types';
import toast from 'react-hot-toast';

export function useAssignments(user: User | null) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          creator:users!created_by(username)
        `)
        .or(`target_type.eq.global,and(target_type.eq.group,target_groups.cs.{${user?.category}}),and(target_type.eq.personal,target_users.cs.{${user?.id}})`)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setAssignments(data.map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        dueDate: assignment.due_date,
        completed: assignment.completed,
        created_by: assignment.created_by,
        targetType: assignment.target_type,
        targetGroups: assignment.target_groups,
        targetUsers: assignment.target_users,
        createdAt: assignment.created_at,
        users: {
          username: assignment.creator.username
        }
      })));
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Erreur lors du chargement des devoirs');
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (assignment: Partial<Assignment>) => {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Not authenticated');
      }

      const newAssignment = {
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        due_date: assignment.due_date,
        target_type: assignment.target_type,
        target_groups: assignment.target_groups || [],
        target_users: assignment.target_users || [],
        created_by: session.user.id, // Use the authenticated user's ID
        completed: false
      };

      const { data, error } = await supabase
        .from('assignments')
        .insert([newAssignment])
        .select(`
          *,
          creator:users!created_by(username)
        `)
        .single();

      if (error) throw error;

      // Format the assignment for the frontend
      const formattedAssignment: Assignment = {
        id: data.id,
        title: data.title,
        description: data.description,
        subject: data.subject,
        dueDate: data.due_date,
        completed: data.completed,
        created_by: data.created_by,
        targetType: data.target_type,
        targetGroups: data.target_groups,
        targetUsers: data.target_users,
        createdAt: data.created_at,
        users: {
          username: data.creator.username
        }
      };

      setAssignments(prev => [...prev, formattedAssignment]);
      toast.success('Devoir créé avec succès');
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Erreur lors de la création du devoir');
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const assignment = assignments.find((a) => a.id === id);
      const { error } = await supabase
        .from('assignments')
        .update({ completed: !assignment?.completed })
        .eq('id', id);

      if (error) throw error;
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, completed: !a.completed } : a
        )
      );
      toast.success('Statut mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return {
    assignments,
    loading,
    createAssignment,
    toggleComplete,
  };
}