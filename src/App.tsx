import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { BookOpen, LogOut, Plus } from 'lucide-react';
import { RegisterForm } from './components/RegisterForm';
import { AssignmentForm } from './components/AssignmentForm';
import { AssignmentList } from './components/AssignmentList';
import { Calendar } from './components/Calendar';
import { Timeline } from './components/Timeline';
import { AdminPanel } from './components/AdminPanel';
import { ViewSelector } from './components/ViewSelector';
import { useAssignments } from './hooks/useAssignments';

type View = 'calendar' | 'timeline' | 'list';

function Dashboard() {
  const { user, logout } = useAuth();
  const { assignments, loading, createAssignment, toggleComplete } = useAssignments(user);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('calendar');

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    if (user?.role === 'admin') {
      return <AdminPanel />;
    }

    switch (currentView) {
      case 'calendar':
        return <Calendar assignments={assignments} />;
      case 'timeline':
        return (
          <Timeline
            assignments={assignments}
            onToggleComplete={toggleComplete}
          />
        );
      default:
        return (
          <AssignmentList
            assignments={assignments}
            onToggleComplete={toggleComplete}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Système de Gestion des Devoirs
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.username} ({user?.category})
              </span>
              <button onClick={() => logout()} className="btn-secondary">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.role === 'admin' ? 'Administration' : 'Mes devoirs'}
            </h2>
            {user?.role !== 'admin' && (
              <ViewSelector
                currentView={currentView}
                onViewChange={setCurrentView}
              />
            )}
          </div>
          {user?.role !== 'admin' && (
            <button onClick={() => setIsFormOpen(true)} className="btn">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau devoir
            </button>
          )}
        </div>

        {renderContent()}

        <AssignmentForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={createAssignment}
        />
      </main>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <RegisterForm />;
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppContent />
    </AuthProvider>
  );
}

export default App;