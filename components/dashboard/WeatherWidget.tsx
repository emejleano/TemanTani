
import React from 'react';
import { WeatherData } from '../../types';
import { SunIcon, CloudIcon, RainIcon } from '../icons';

interface WeatherWidgetProps {
  weatherData: WeatherData;
}

const WeatherIcon: React.FC<{ icon: string, className?: string }> = ({ icon, className="w-16 h-16" }) => {
  switch (icon) {
    case 'sun': return <SunIcon className={`${className} text-yellow-500`} />;
    case 'cloud': return <CloudIcon className={`${className} text-gray-500`} />;
    case 'rain': return <RainIcon className={`${className} text-blue-500`} />;
    default: return <CloudIcon className={`${className} text-gray-500`} />;
  }
};


const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weatherData }) => {
  const { current, forecast } = weatherData;

  return (
    <div className="flex flex-col h-full">
        <div className="flex items-center">
            <WeatherIcon icon={current.icon} />
            <div className="ml-4">
            <p className="text-4xl font-bold text-gray-800">{current.temp}°C</p>
            <p className="text-gray-600">{current.description}</p>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 text-center text-sm text-gray-600">
            <div>
                <p className="font-semibold">Kelembapan</p>
                <p>{current.humidity}%</p>
            </div>
            <div>
                <p className="font-semibold">Curah Hujan</p>
                <p>{current.rainfall} mm</p>
            </div>
        </div>
        <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex justify-between text-center">
            {forecast.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                    <p className="font-semibold text-sm text-gray-700">{item.day}</p>
                    <WeatherIcon icon={item.icon} className="w-8 h-8 my-1"/>
                    <p className="text-sm text-gray-600">{item.temp}°C</p>
                </div>
            ))}
            </div>
        </div>
    </div>
  );
};

export default WeatherWidget;
