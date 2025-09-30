import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { api } from '../../services/apiService';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onBackToLanding: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>(UserRole.FARMER);
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regProvince, setRegProvince] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (!loginEmail || !loginPassword) {
          setError('Email dan password harus diisi.');
          return;
      }
      const user = await api.authenticateUser(loginEmail, loginPassword);
      if (user) {
          onLoginSuccess(user);
      } else {
          setError('Email atau password salah.');
      }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (!regName || !regEmail || !regPassword || !regAddress || !regCity || !regProvince) {
          setError('Semua field wajib diisi.');
          return;
      }
      try {
        const newUser = await api.createUser({
            name: regName,
            email: regEmail,
            password: regPassword,
            role: regRole,
            address: regAddress,
            city: regCity,
            province: regProvince,
        });
        // Automatically log in after registration
        onLoginSuccess(newUser);
      } catch (err) {
          setError('Gagal membuat akun. Email mungkin sudah terdaftar.');
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Selamat Datang di Teman Tani</h1>
            <p className="text-gray-600">Masuk atau daftar untuk melanjutkan</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 font-semibold text-center transition-colors ${activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            >
              Masuk
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 font-semibold text-center transition-colors ${activeTab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            >
              Daftar
            </button>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm" role="alert">{error}</div>}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="anda@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">Masuk</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700">Daftar Sebagai</label>
                 <div className="mt-2 grid grid-cols-2 gap-3">
                    <label className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none ${regRole === UserRole.FARMER ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                        <input type="radio" name="role" value={UserRole.FARMER} checked={regRole === UserRole.FARMER} onChange={() => setRegRole(UserRole.FARMER)} className="sr-only"/>
                        <span className="flex flex-1"><span className="flex flex-col"><span className="block text-sm font-medium text-gray-900">Petani</span></span></span>
                    </label>
                    <label className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none ${regRole === UserRole.BUYER ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                        <input type="radio" name="role" value={UserRole.BUYER} checked={regRole === UserRole.BUYER} onChange={() => setRegRole(UserRole.BUYER)} className="sr-only"/>
                        <span className="flex flex-1"><span className="flex flex-col"><span className="block text-sm font-medium text-gray-900">Pembeli</span></span></span>
                    </label>
                </div>
              </div>
              <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Nama Lengkap" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Email" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
              <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Password" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
              <input type="text" value={regAddress} onChange={e => setRegAddress(e.target.value)} placeholder="Alamat Lengkap" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={regCity} onChange={e => setRegCity(e.target.value)} placeholder="Kota/Kabupaten" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
                <input type="text" value={regProvince} onChange={e => setRegProvince(e.target.value)} placeholder="Provinsi" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">Daftar</button>
            </form>
          )}
        </div>
        <div className="text-center mt-4">
            <button onClick={onBackToLanding} className="text-sm text-gray-600 hover:text-primary">← Kembali ke Halaman Utama</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
