import React from 'react';
import { 
    DashboardIcon, EcoIcon, WaterIcon, ChartIcon, MarketplaceIcon, 
    CommunityIcon, OrderIcon, MessageIcon, DeviceIcon 
} from '../icons';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard Utama', icon: <DashboardIcon /> },
  { id: 'eco-score', label: 'Eco-Score', icon: <EcoIcon /> },
  { id: 'irrigation', label: 'Kontrol Irigasi', icon: <WaterIcon /> },
  { id: 'predictions', label: 'Prediksi & AI', icon: <ChartIcon /> },
  { id: 'marketplace', label: 'Marketplace', icon: <MarketplaceIcon />, isPro: true },
  { id: 'orders', label: 'Pesanan Masuk', icon: <OrderIcon />, isPro: true },
  { id: 'chats', label: 'Pesan', icon: <MessageIcon />, isPro: true },
  { id: 'community', label: 'Komunitas', icon: <CommunityIcon />, isPro: true },
  { id: 'devices', label: 'Perangkat IoT', icon: <DeviceIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
      <div className="p-4 flex items-center border-b h-16">
         <img src="https://raw.githubusercontent.com/google/material-design-icons/master/src/social/agriculture/materialicons/24px.svg" alt="Logo" className="w-10 h-10" style={{ filter: 'grayscale(1) brightness(0.5) invert(1)'}}/>
        <h1 className="text-xl font-bold text-gray-800 ml-3">Teman Tani</h1>
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
                {item.isPro && <span className="ml-auto text-xs font-bold text-white bg-primary rounded-full px-2 py-0.5">PRO</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
