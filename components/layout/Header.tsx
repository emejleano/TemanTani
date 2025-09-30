import React from 'react';
import { User, FarmerPlan } from '../../types';
import { LogoutIcon } from '../icons';

interface HeaderProps {
  user: User;
  title: string;
  onLogout: () => void;
  // Optional props for farmer plan simulation
  farmerPlan?: FarmerPlan;
  onPlanChange?: (newPlan: FarmerPlan) => void;
}

const Header: React.FC<HeaderProps> = ({ user, title, onLogout, farmerPlan, onPlanChange }) => {
  const isFarmer = user.role === 'FARMER';

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <div className="flex items-center space-x-4">
        {isFarmer && onPlanChange && (
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
             <span className="text-sm font-medium text-gray-600 ml-2">Simulasi Akun:</span>
            <label htmlFor="plan-toggle" className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="plan-toggle" 
                className="sr-only peer" 
                checked={farmerPlan === FarmerPlan.PRO} 
                onChange={(e) => onPlanChange(e.target.checked ? FarmerPlan.PRO : FarmerPlan.FREE)} 
              />
              <div className="w-28 h-8 bg-gray-200 rounded-full flex items-center justify-between px-2 text-sm font-bold text-gray-500">
                <span>Gratis</span>
                <span>Pro</span>
              </div>
              <div className="absolute top-1 left-1 bg-primary text-white w-12 h-6 rounded-full transition-transform peer-checked:translate-x-[60px] flex items-center justify-center shadow-md">
                {farmerPlan === FarmerPlan.FREE ? 'Off' : 'On'}
              </div>
            </label>
          </div>
        )}
        <div className="text-right">
          <p className="font-semibold text-gray-700">{user.name}</p>
          <p className="text-sm text-gray-500 capitalize">{user.role.toLowerCase()}</p>
        </div>
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-gray-600">{user.name.charAt(0)}</span>
        </div>
        <button onClick={onLogout} className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors" title="Logout">
          <LogoutIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
