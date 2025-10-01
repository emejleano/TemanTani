import React, { useState } from 'react';
import { User } from './types';
import Header from './components/layout/Header';
import MarketplaceBuyerDashboard from './components/marketplace/MarketplaceBuyerDashboard';
import BuyerOrdersDashboard from './components/buyer/BuyerOrdersDashboard';
import BuyerChatsDashboard from './components/buyer/BuyerChatsDashboard';
import { MarketplaceIcon, OrderIcon, MessageIcon } from './components/icons';

interface BuyerAppProps {
  user: User;
  onLogout: () => void;
}

const viewTitles: { [key: string]: string } = {
    marketplace: 'Marketplace',
    orders: 'Pesanan Saya',
    chats: 'Pesan Saya',
};

const BuyerSidebar: React.FC<{ activeView: string; setActiveView: (view: string) => void }> = ({ activeView, setActiveView }) => {
    const navItems = [
      { id: 'marketplace', label: 'Marketplace', icon: <MarketplaceIcon /> },
      { id: 'orders', label: 'Pesanan Saya', icon: <OrderIcon /> },
      { id: 'chats', label: 'Pesan', icon: <MessageIcon /> },
    ];

    return (
        <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
            <div className="p-4 flex items-center border-b h-16">
                <img src="https://emejleano.github.io/TemanTani/logo.png" alt="Logo" className="w-30 h-28"/>
            </div>
            <nav className="mt-4 flex-1">
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

const BuyerApp: React.FC<BuyerAppProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('marketplace');

  const renderActiveView = () => {
    switch (activeView) {
      case 'marketplace':
        return <MarketplaceBuyerDashboard user={user} />;
      case 'orders':
        return <BuyerOrdersDashboard user={user} />;
      case 'chats':
        return <BuyerChatsDashboard user={user} />;
      default:
        return <MarketplaceBuyerDashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
        <BuyerSidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
                user={user} 
                title={viewTitles[activeView] || 'Marketplace'} 
                onLogout={onLogout} 
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
            {renderActiveView()}
            </main>
      </div>
    </div>
  );
};

export default BuyerApp;
