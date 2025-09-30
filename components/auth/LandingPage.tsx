import React from 'react';

interface LandingPageProps {
  onNavigate: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
      <header className="absolute top-0 left-0 p-8">
        <div className="flex items-center">
            <img src="https://raw.githubusercontent.com/google/material-design-icons/master/src/social/agriculture/materialicons/24px.svg" alt="Logo" className="w-12 h-12" style={{ filter: 'grayscale(1) brightness(0.5) invert(1)'}}/>
            <h1 className="text-3xl font-bold text-gray-800 ml-3">Teman Tani</h1>
        </div>
      </header>
      <main className="text-center px-4">
        <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
          Platform Pertanian Cerdas, <br />
          <span className="text-primary-600">Untuk Hasil Panen Terbaik Anda</span>
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          Monitor lahan, dapatkan rekomendasi cerdas berbasis AI, dan jual hasil panen Anda langsung ke pembeli. Semua dalam satu platform.
        </p>
        <div className="mt-10">
          <button
            onClick={onNavigate}
            className="bg-primary-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-primary-700 transition-transform transform hover:scale-105 shadow-lg"
          >
            Mulai Sekarang
          </button>
        </div>
      </main>
      <footer className="absolute bottom-0 p-8 text-gray-500">
        &copy; {new Date().getFullYear()} Teman Tani. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;