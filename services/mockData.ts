// This file simulates fetching data from sensors, weather APIs, etc.

import { SensorDataPoint, WeatherData, EcoScore, IrrigationLog, MarketPrice } from '../types';

// Function to generate sensor data for the last 7 time points (e.g., hours)
const generateSensorData = (base: number, variation: number, points: number = 7): SensorDataPoint[] => {
    const data: SensorDataPoint[] = [];
    const now = new Date();
    for (let i = points - 1; i >= 0; i--) {
        const value = base + (Math.random() - 0.5) * variation;
        const time = new Date(now.getTime() - i * 60 * 60 * 1000); // i hours ago
        data.push({
            time: `${time.getHours()}:00`,
            value: parseFloat(value.toFixed(1)),
        });
    }
    return data;
};

export const getSoilMoistureData = (): SensorDataPoint[] => {
    // Let's make the last value low to trigger the alert in MonitoringDashboard
    const data = generateSensorData(55, 20);
    if (data.length > 0) {
      data[data.length - 1].value = 38; // low moisture to trigger alert
    }
    return data;
};

export const getSoilTemperatureData = (): SensorDataPoint[] => {
    return generateSensorData(28, 3);
};

export const getWeatherData = (): WeatherData => {
    return {
        current: {
            temp: 31,
            description: 'Cerah Berawan',
            icon: 'cloud',
            humidity: 75,
            rainfall: 0,
        },
        forecast: [
            { day: 'Besok', temp: 32, icon: 'sun' },
            { day: 'Lusa', temp: 30, icon: 'cloud' },
            { day: 'Jumat', temp: 28, icon: 'rain' },
        ],
    };
};

export const getEcoScore = (): EcoScore => {
    return {
        total: 78,
        waterEfficiency: 65, // Low-ish to match the tip in EcoScoreDashboard
        fertilizerUse: 85,
        productivity: 80,
        wasteManagement: 90,
    };
};

export const getIrrigationLogs = (): IrrigationLog[] => {
    return [
        { date: '2024-07-20', startTime: '06:00', duration: '30 menit', volume: 500 },
        { date: '2024-07-18', startTime: '06:15', duration: '25 menit', volume: 450 },
        { date: '2024-07-16', startTime: '05:50', duration: '35 menit', volume: 550 },
        { date: '2024-07-14', startTime: '06:00', duration: '30 menit', volume: 500 },
    ];
};

export const getMarketPrices = (): MarketPrice[] => {
    return [
        { month: 'Jan', price: 9500 },
        { month: 'Feb', price: 9800 },
        { month: 'Mar', price: 9750 },
        { month: 'Apr', price: 10200 },
        { month: 'Mei', price: 10500 },
        { month: 'Jun', price: 10300 },
        { month: 'Jul', price: 10800 },
    ];
};
