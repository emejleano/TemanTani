
import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import { getIrrigationLogs } from '../../services/mockData';
import { IrrigationLog } from '../../types';

const IrrigationControl: React.FC = () => {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [logs, setLogs] = useState<IrrigationLog[]>([]);

  useEffect(() => {
    setLogs(getIrrigationLogs());
  }, []);

  const handlePumpToggle = () => {
    if (!isAutoMode) {
      setIsPumpOn(!isPumpOn);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Kontrol Irigasi">
        <div className="space-y-6">
          {/* Mode Otomatis */}
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
            <div>
              <h4 className="font-bold text-gray-800">Mode Otomatis (Smart Irrigation)</h4>
              <p className="text-sm text-gray-600">Pompa aktif/nonaktif sesuai data sensor & cuaca.</p>
            </div>
            <label htmlFor="auto-mode-toggle" className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="auto-mode-toggle" className="sr-only peer" checked={isAutoMode} onChange={() => setIsAutoMode(!isAutoMode)} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Kontrol Manual */}
          <div className={`p-4 rounded-lg ${isAutoMode ? 'bg-gray-200 opacity-50' : 'bg-white border'}`}>
            <h4 className="font-bold text-gray-800">Kontrol Manual Jarak Jauh</h4>
            <p className={`text-sm mb-4 ${isAutoMode ? 'text-gray-500' : 'text-gray-600'}`}>
              {isAutoMode ? 'Nonaktifkan mode otomatis untuk kontrol manual.' : 'Nyalakan atau matikan pompa air secara manual.'}
            </p>
            <button
              onClick={handlePumpToggle}
              disabled={isAutoMode}
              className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ${isPumpOn ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} ${isAutoMode ? 'cursor-not-allowed' : ''}`}
            >
              {isPumpOn ? 'MATIKAN POMPA' : 'NYALAKAN POMPA'}
            </button>
          </div>
        </div>
      </Card>

      <Card title="Riwayat Penyiraman (Logging)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Tanggal</th>
                <th scope="col" className="px-6 py-3">Waktu</th>
                <th scope="col" className="px-6 py-3">Durasi</th>
                <th scope="col" className="px-6 py-3">Volume (L)</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{log.date}</td>
                  <td className="px-6 py-4">{log.startTime}</td>
                  <td className="px-6 py-4">{log.duration}</td>
                  <td className="px-6 py-4">{log.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default IrrigationControl;
