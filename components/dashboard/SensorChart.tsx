
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SensorDataPoint } from '../../types';

interface SensorChartProps {
  data: SensorDataPoint[];
  title: string;
  lineColor: string;
  unit: string;
}

const SensorChart: React.FC<SensorChartProps> = ({ data, title, lineColor, unit }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} unit={unit} />
          <Tooltip
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }}
            labelStyle={{ fontWeight: 'bold' }}
            formatter={(value) => [`${value}${unit}`, title]}
          />
          <Legend />
          <Line type="monotone" dataKey="value" name={title} stroke={lineColor} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
