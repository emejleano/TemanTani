import React, { useState } from 'react';
import LandingPage from './components/auth/LandingPage';
import AuthPage from './components/auth/AuthPage';
import FarmerApp from './FarmerApp';
import BuyerApp from './BuyerApp';
import AdminApp from './AdminApp';
import { User } from './types';

type AppState = 'landing' | 'auth' | 'farmer' | 'buyer' | 'admin';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setAppState(user.role.toLowerCase() as AppState);
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
      setAppState('landing');
  }

  const renderContent = () => {
    switch (appState) {
      case 'landing':
        return <LandingPage onNavigate={() => setAppState('auth')} />;
      case 'auth':
        return <AuthPage onLoginSuccess={handleLogin} onBackToLanding={() => setAppState('landing')} />;
      case 'farmer':
        return currentUser && <FarmerApp user={currentUser} onLogout={handleLogout} />;
      case 'buyer':
        return currentUser && <BuyerApp user={currentUser} onLogout={handleLogout} />;
      case 'admin':
        return currentUser && <AdminApp user={currentUser} onLogout={handleLogout} />;
      default:
        return <LandingPage onNavigate={() => setAppState('auth')} />;
    }
  };

  return <div className="bg-gray-100 min-h-screen">{renderContent()}</div>;
};

export default App;
