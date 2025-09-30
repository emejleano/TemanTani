import React from 'react';
import { DashboardIcon, UsersIcon, ArticleIcon, SettingsIcon } from '../icons';

interface AdminSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'users', label: 'Manajemen User', icon: <UsersIcon /> },
  { id: 'articles', label: 'Manajemen Artikel', icon: <ArticleIcon /> },
  { id: 'settings', label: 'Pengaturan', icon: <SettingsIcon /> },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0">
      <div className="p-4 flex items-center border-b">
         <img src="https://raw.githubusercontent.com/google/material-design-icons/master/src/social/agriculture/materialicons/24px.svg" alt="Logo" className="w-10 h-10" style={{ filter: 'grayscale(1) brightness(0.5) invert(1)'}}/>
        <h1 className="text-xl font-bold text-gray-800 ml-3">Admin Panel</h1>
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="px-4 py-1">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView(item.id);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  activeView === item.id
                    ? 'bg-primary-100 text-primary-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {React.cloneElement(item.icon, { className: 'w-5 h-5 mr-3' })}
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
export default AdminSidebar;
