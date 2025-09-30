import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MonitoringDashboard from './components/dashboard/MonitoringDashboard';
import EcoScoreDashboard from './components/ecoScore/EcoScoreDashboard';
import IrrigationControl from './components/irrigation/IrrigationControl';
import PredictionsDashboard from './components/predictions/PredictionsDashboard';
import MarketplaceFarmerDashboard from './components/marketplace/MarketplaceFarmerDashboard';
import CommunityDashboard from './components/community/CommunityDashboard';
import FarmerOrdersDashboard from './components/farmer/FarmerOrdersDashboard';
import FarmerChatsDashboard from './components/farmer/FarmerChatsDashboard';
import IoTDeviceDashboard from './components/devices/IoTDeviceDashboard';
import Chatbot from './components/chatbot/Chatbot';
import { User, FarmerPlan } from './types';

interface FarmerAppProps {
  user: User;
  onLogout: () => void;
}

const viewTitles: { [key: string]: string } = {
    dashboard: 'Dashboard Utama',
    'eco-score': 'Eco-Score & Keberlanjutan',
    irrigation: 'Kontrol & Otomatisasi Irigasi',
    predictions: 'Prediksi & Rekomendasi AI',
    marketplace: 'Manajemen Marketplace',
    orders: 'Pesanan Masuk',
    chats: 'Pesan dari Pembeli',
    community: 'Komunitas & Artikel',
    devices: 'Manajemen Perangkat IoT',
};

const FarmerApp: React.FC<FarmerAppProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [simulatedPlan, setSimulatedPlan] = useState<FarmerPlan>(user.plan || FarmerPlan.FREE);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <MonitoringDashboard />;
      case 'eco-score':
        return <EcoScoreDashboard farmerPlan={simulatedPlan} />;
      case 'irrigation':
        return <IrrigationControl />;
      case 'predictions':
        return <PredictionsDashboard farmerPlan={simulatedPlan} />;
       case 'marketplace':
        return <MarketplaceFarmerDashboard user={user} farmerPlan={simulatedPlan} />;
      case 'orders':
        return <FarmerOrdersDashboard user={user} farmerPlan={simulatedPlan} />;
      case 'chats':
        return <FarmerChatsDashboard user={user} farmerPlan={simulatedPlan} />;
      case 'community':
        return <CommunityDashboard user={user} farmerPlan={simulatedPlan} />;
      case 'devices':
        return <IoTDeviceDashboard />;
      default:
        return <MonitoringDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            user={user} 
            title={viewTitles[activeView] || 'Teman Tani'} 
            onLogout={onLogout}
            farmerPlan={simulatedPlan}
            onPlanChange={setSimulatedPlan}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderActiveView()}
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default FarmerApp;
