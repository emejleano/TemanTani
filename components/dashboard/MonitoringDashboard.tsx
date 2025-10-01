import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import SensorChart from './SensorChart';
import WeatherWidget from './WeatherWidget';
import { SensorDataPoint, WeatherData } from '../../types';
import BMKGRainMap from "../BMKGRainMap";

const API_KEY = "20bb443cf41991d2c9e31cac16348d6c"; // 🔑 API Key OpenWeather
const CITY = "Jakarta"; // 🏙️ Lokasi lahan kamu

const MonitoringDashboard: React.FC = () => {
  const [moistureData, setMoistureData] = useState<SensorDataPoint[]>([]);
  const [temperatureData, setTemperatureData] = useState<SensorDataPoint[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [connected, setConnected] = useState(false);

  // 🌱 Simulasi data sensor IoT setiap 5 detik
  useEffect(() => {
    const generateMockSensorData = () => {
      return {
        moisture: Math.floor(Math.random() * 60) + 20,    // 20–80%
        temperature: Math.floor(Math.random() * 10) + 25, // 25–35 °C
      };
    };

    const fetchSensorData = () => {
      const data = generateMockSensorData();
      setMoistureData(prev => [
        ...prev.slice(-20), // simpan max 20 titik agar chart ringan
        { time: new Date().toLocaleTimeString(), value: data.moisture }
      ]);
      setTemperatureData(prev => [
        ...prev.slice(-20),
        { time: new Date().toLocaleTimeString(), value: data.temperature }
      ]);
      setConnected(true);
    };

    fetchSensorData(); // panggil pertama kali
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🌤️ Ambil cuaca real-time & prakiraan dari OpenWeather
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const [currentRes, forecastRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`),
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&appid=${API_KEY}`)
        ]);

        const current = await currentRes.json();
        const forecast = await forecastRes.json();

        if (currentRes.ok && forecastRes.ok) {
          const formattedWeather: WeatherData = {
            current: {
              temp: Math.round(current.main.temp),
              description: current.weather[0].description,
              icon: mapOpenWeatherIcon(current.weather[0].main),
              humidity: current.main.humidity,
              rainfall: current.rain?.['1h'] || 0
            },
            forecast: forecast.list
              .filter((_: any, i: number) => i % 8 === 0) // ambil tiap 24 jam sekali
              .slice(0, 5)
              .map((item: any) => ({
                day: new Date(item.dt_txt).toLocaleDateString('id-ID', { weekday: 'long' }),
                temp: Math.round(item.main.temp),
                icon: mapOpenWeatherIcon(item.weather[0].main)
              }))
          };

          setWeatherData(formattedWeather);
        } else {
          console.error("Gagal ambil cuaca:", current.message || forecast.message);
        }
      } catch (err) {
        console.error("🌧️ Error fetch cuaca:", err);
      }
    };

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 600000); // refresh tiap 10 menit
    return () => clearInterval(interval);
  }, []);

  const currentMoisture = moistureData.length > 0 ? moistureData[moistureData.length - 1].value : 0;
  const isMoistureLow = currentMoisture < 40;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 📊 Sensor Charts */}
      <div className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Kelembapan Tanah (%)">
            {!connected ? (
              <p className="text-yellow-600 text-center text-lg">🔌 Menunggu koneksi IoT...</p>
            ) : (
              <SensorChart data={moistureData} title="Kelembapan" lineColor="#3b82f6" unit="%" />
            )}
          </Card>

          <Card title="Suhu Lahan (°C)">
            {!connected ? (
              <p className="text-yellow-600 text-center text-lg">🔌 Menunggu koneksi IoT...</p>
            ) : (
              <SensorChart data={temperatureData} title="Suhu" lineColor="#ef4444" unit="°C" />
            )}
          </Card>
        </div>
      </div>

      {/* 🌤️ Cuaca + Notifikasi */}
      <div className="grid grid-rows-2 gap-6">
        <Card title="Cuaca Terkini & Prakiraan">
          {weatherData ? (
            <WeatherWidget weatherData={weatherData} />
          ) : (
            <p className="text-gray-500 text-center">📡 Mengambil data cuaca...</p>
          )}
        </Card>

        <Card title="Notifikasi & Alert">
          {!connected ? (
            <p className="text-gray-500 text-center">📡 Menunggu data sensor...</p>
          ) : (
            <div
              className={`p-4 rounded-lg ${
                isMoistureLow ? 'bg-red-100 border-red-400 border' : 'bg-green-100 border-green-400 border'
              }`}
            >
              <h4 className={`font-bold ${isMoistureLow ? 'text-red-800' : 'text-green-800'}`}>
                {isMoistureLow ? '⚠️ Peringatan Dini!' : '✅ Status Normal'}
              </h4>
              <p className={`text-sm ${isMoistureLow ? 'text-red-700' : 'text-green-700'}`}>
                {isMoistureLow
                  ? `Kelembapan tanah rendah (${currentMoisture}%), lahan butuh penyiraman.`
                  : 'Kondisi lahan terpantau aman dan optimal.'}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* 🌧️ Peta BMKG */}
      <div className="lg:col-span-3">
        <Card title="Peta Curah & Hari Hujan BMKG">
          <BMKGRainMap />
        </Card>
      </div>
    </div>
  );
};

// 🧠 Helper: Ubah kondisi cuaca OpenWeather ke ikon internal kamu
const mapOpenWeatherIcon = (main: string): string => {
  switch (main.toLowerCase()) {
    case "clear":
      return "sun";
    case "clouds":
      return "cloud";
    case "rain":
    case "drizzle":
    case "thunderstorm":
      return "rain";
    default:
      return "cloud";
  }
};

export default MonitoringDashboard;
