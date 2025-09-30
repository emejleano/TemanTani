
import React from 'react';

interface EcoScoreGaugeProps {
  score: number;
}

const EcoScoreGauge: React.FC<EcoScoreGaugeProps> = ({ score }) => {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 50) return 'text-red-500';
    if (s < 80) return 'text-yellow-500';
    return 'text-primary-500';
  };

  const getStrokeColor = (s: number) => {
    if (s < 50) return '#ef4444';
    if (s < 80) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle
            className="text-gray-200"
            strokeWidth="15"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
          />
          <circle
            strokeWidth="15"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={getStrokeColor(score)}
            fill="transparent"
            r={radius}
            cx="100"
            cy="100"
            className="transform -rotate-90 origin-center transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${getColor(score)}`}>{score}</span>
          <span className="text-gray-600 font-medium">Eco-Score</span>
        </div>
      </div>
    </div>
  );
};

export default EcoScoreGauge;
