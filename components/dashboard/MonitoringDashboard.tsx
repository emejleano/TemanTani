
import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import SensorChart from './SensorChart';
import WeatherWidget from './WeatherWidget';
import { getSoilMoistureData, getSoilTemperatureData, getWeatherData } from '../../services/mockData';
import { SensorDataPoint, WeatherData } from '../../types';

const MonitoringDashboard: React.FC = () => {
  const [moistureData, setMoistureData] = useState<SensorDataPoint[]>([]);
  const [temperatureData, setTemperatureData] = useState<SensorDataPoint[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    setMoistureData(getSoilMoistureData());
    setTemperatureData(getSoilTemperatureData());
    setWeatherData(getWeatherData());
  }, []);

  const currentMoisture = moistureData.length > 0 ? moistureData[moistureData.length-1].value : 0;
  const isMoistureLow = currentMoisture < 40;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Kelembapan Tanah (%)">
                <SensorChart data={moistureData} title="Kelembapan" lineColor="#3b82f6" unit="%" />
            </Card>
            <Card title="Suhu Lahan (°C)">
                <SensorChart data={temperatureData} title="Suhu" lineColor="#ef4444" unit="°C" />
            </Card>
        </div>
      </div>

      <div className="grid grid-rows-2 gap-6">
        <Card title="Cuaca Terkini & Prakiraan">
          {weatherData && <WeatherWidget weatherData={weatherData} />}
        </Card>
        <Card title="Notifikasi & Alert">
          <div className={`p-4 rounded-lg ${isMoistureLow ? 'bg-red-100 border-red-400 border' : 'bg-green-100 border-green-400 border'}`}>
            <h4 className={`font-bold ${isMoistureLow ? 'text-red-800' : 'text-green-800'}`}>
              {isMoistureLow ? 'Peringatan Dini!' : 'Status Normal'}
            </h4>
            <p className={`text-sm ${isMoistureLow ? 'text-red-700' : 'text-green-700'}`}>
              {isMoistureLow 
                ? `Kelembapan tanah rendah (${currentMoisture}%), lahan butuh penyiraman.`
                : 'Kondisi lahan terpantau aman dan optimal.'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
