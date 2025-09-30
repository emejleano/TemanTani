import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import { FarmerPlan, MarketPrice } from '../../types';
import PremiumFeatureLock from '../shared/PremiumFeatureLock';
import { getMarketPrices } from '../../services/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PredictionsDashboardProps {
  farmerPlan: FarmerPlan;
}

const PredictionsDashboard: React.FC<PredictionsDashboardProps> = ({ farmerPlan }) => {
  const [marketData, setMarketData] = useState<MarketPrice[]>([]);
  
  useEffect(() => {
    setMarketData(getMarketPrices());
  }, []);

  const isProUser = farmerPlan === FarmerPlan.PRO;

  const renderPremiumFeatures = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Prediksi Estimasi Hasil Panen">
        <div className="text-center">
            <p className="text-gray-600 mb-2">Estimasi hasil panen berdasarkan data input Anda:</p>
            <p className="text-4xl font-bold text-primary-600">4.5 ton/ha</p>
            <p className="text-sm text-gray-500 mt-2">Akurasi prediksi: 85%</p>
        </div>
      </Card>
      <Card title="Rekomendasi Optimasi Input (AI)">
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-md">
            <p className="font-bold">Rekomendasi AI:</p>
            <p>"Untuk mencapai hasil panen 5 ton/ha, disarankan tambah 20 kg pupuk organik NPK per hektar."</p>
        </div>
      </Card>
    </div>
  );

  const renderLockedFeatures = () => (
    <PremiumFeatureLock>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 blur-sm">
        <Card title="Prediksi Estimasi Hasil Panen">
            <div className="text-center">
                <p className="text-gray-600 mb-2">Estimasi hasil panen berdasarkan data input Anda:</p>
                <p className="text-4xl font-bold text-primary-600">X.X ton/ha</p>
                <p className="text-sm text-gray-500 mt-2">Akurasi prediksi: XX%</p>
            </div>
        </Card>
        <Card title="Rekomendasi Optimasi Input (AI)">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-md">
                <p className="font-bold">Rekomendasi AI:</p>
                <p>"................................................................................"</p>
            </div>
        </Card>
      </div>
    </PremiumFeatureLock>
  );

  return (
    <div className="space-y-6">
      {isProUser ? renderPremiumFeatures() : renderLockedFeatures()}
      
      <Card title="Tren Harga Pasar (Komoditas: Padi)">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis unit=" Rp" width={80} />
              <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`}/>
              <Legend />
              <Line type="monotone" dataKey="price" name="Harga/kg" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default PredictionsDashboard;