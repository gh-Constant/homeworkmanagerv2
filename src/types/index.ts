export type Category = 'C2' | 'C1' | 'B2' | 'B1' | 'A2' | 'A1';
export type Subject = 'Communication' | 'SAE' | 'Anglais' | 'Informatique' | 'Management' | 'Marketing';
export type TargetType = 'global' | 'group' | 'personal';
export type UserRole = 'user' | 'admin';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  dueDate: string;
  completed: boolean;
  created_by: string;
  targetType: TargetType;
  targetGroups?: Category[];
  targetUsers?: string[];
  createdAt: string;
  users: {
    username: string;
  };
}

export interface User {
  id: string;
  username: string;
  pin: string;
  category: Category;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}