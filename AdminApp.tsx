import React, { useState } from 'react';
import AdminSidebar from './components/admin/AdminSidebar';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ArticleManagement from './components/admin/ArticleManagement';
import { User } from './types';
import Header from './components/layout/Header';

interface AdminAppProps {
  user: User;
  onLogout: () => void;
}

const viewTitles: { [key: string]: string } = {
    dashboard: 'Admin Dashboard',
    users: 'Manajemen Pengguna',
    articles: 'Manajemen Artikel',
    settings: 'Pengaturan'
};

const AdminApp: React.FC<AdminAppProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'articles':
        return <ArticleManagement user={user} />;
      case 'settings':
        return <div>Pengaturan</div>;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} title={viewTitles[activeView] || 'Admin Panel'} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default AdminApp;
