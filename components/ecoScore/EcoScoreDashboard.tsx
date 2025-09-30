import React, { useState, useEffect } from 'react';
import { FarmerPlan, EcoScore as EcoScoreType } from '../../types';
import Card from '../shared/Card';
import PremiumFeatureLock from '../shared/PremiumFeatureLock';
import { getEcoScore } from '../../services/mockData';
import EcoScoreGauge from './EcoScoreGauge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface EcoScoreDashboardProps {
  farmerPlan: FarmerPlan;
}

const EcoScoreDashboard: React.FC<EcoScoreDashboardProps> = ({ farmerPlan }) => {
  const [ecoScore, setEcoScore] = useState<EcoScoreType | null>(null);

  useEffect(() => {
    setEcoScore(getEcoScore());
  }, []);

  if (!ecoScore) return <div>Loading...</div>;
  
  const isProUser = farmerPlan === FarmerPlan.PRO;

  const scoreData = [
    { name: 'Air', score: ecoScore.waterEfficiency },
    { name: 'Pupuk', score: ecoScore.fertilizerUse },
    { name: 'Produktivitas', score: ecoScore.productivity },
    { name: 'Limbah', score: ecoScore.wasteManagement },
  ];
  
  const getBarColor = (score: number) => {
    if (score < 50) return '#ef4444';
    if (score < 80) return '#f59e0b';
    return '#22c55e';
  }

  const lowScoreTip = "Skor efisiensi air tergolong boros. Coba tambahkan mulsa jerami untuk mengurangi penguapan.";
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card title="Total Eco-Score" className="lg:col-span-1">
        <EcoScoreGauge score={ecoScore.total} />
      </Card>

      <Card title="Komponen Eco-Score" className="lg:col-span-2">
         <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} />
                    <Tooltip cursor={{fill: 'transparent'}}/>
                    <Bar dataKey="score" barSize={30} radius={[0, 15, 15, 0]}>
                       {scoreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                       ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
         </div>
      </Card>
      
      <Card title="Tips Harian (Eco-Rekomendasi)" className="lg:col-span-3">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md">
          <p className="font-bold">Rekomendasi untuk Anda:</p>
          <p>{lowScoreTip}</p>
        </div>
      </Card>
      
      <div className="lg:col-span-3 grid md:grid-cols-2 gap-6">
        <Card title="Input Data Keberlanjutan">
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jenis Pupuk</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm">
                        <option>Organik</option>
                        <option>Kimia</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Hasil Panen (kg)</label>
                    <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="Contoh: 1000"/>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Simpan Data</button>
            </form>
        </Card>
        
        {isProUser ? (
             <Card title="Laporan & Benchmarking">
                <div className="space-y-4">
                    <p className="text-gray-600">Download laporan keberlanjutan terperinci dan lihat perbandingan Eco-Score Anda dengan komunitas.</p>
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">Download Laporan (PDF)</button>
                    <div className="text-center pt-4">
                        <p className="text-gray-600">Skor Komunitas Rata-rata</p>
                        <p className="text-3xl font-bold text-indigo-600">75</p>
                    </div>
                </div>
             </Card>
        ) : (
            <PremiumFeatureLock>
                <Card title="Laporan & Benchmarking">
                     <div className="space-y-4 text-center blur-sm">
                        <p className="text-gray-600">Download laporan keberlanjutan terperinci dan lihat perbandingan Eco-Score Anda dengan komunitas.</p>
                        <button disabled className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg">Download Laporan (PDF)</button>
                        <div className="text-center pt-4">
                            <p className="text-gray-600">Skor Komunitas Rata-rata</p>
                            <p className="text-3xl font-bold text-indigo-600">XX</p>
                        </div>
                    </div>
                </Card>
            </PremiumFeatureLock>
        )}
      </div>
    </div>
  );
};

export default EcoScoreDashboard;