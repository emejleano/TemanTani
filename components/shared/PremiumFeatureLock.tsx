
import React from 'react';
import { LockIcon } from '../icons';

interface PremiumFeatureLockProps {
  children: React.ReactNode;
}

const PremiumFeatureLock: React.FC<PremiumFeatureLockProps> = ({ children }) => {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
        <LockIcon className="w-12 h-12 text-primary-500 mb-4" />
        <h4 className="text-xl font-bold text-gray-800">Fitur Premium</h4>
        <p className="text-gray-600 mt-1">Upgrade ke akun Pro untuk membuka fitur ini.</p>
        <button className="mt-4 bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Upgrade Sekarang
        </button>
      </div>
    </div>
  );
};

export default PremiumFeatureLock;
