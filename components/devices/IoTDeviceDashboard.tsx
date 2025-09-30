import React, { useState } from 'react';
import Card from '../shared/Card';
import { DeviceIcon } from '../icons';

type DeviceStatus = 'disconnected' | 'searching' | 'connecting' | 'connected';

interface IoTDevice {
    id: string;
    type: string;
    status: 'Active';
}

const IoTDeviceDashboard: React.FC = () => {
    const [status, setStatus] = useState<DeviceStatus>('disconnected');
    const [device, setDevice] = useState<IoTDevice | null>(null);

    const handleFindDevice = () => {
        setStatus('searching');
        setTimeout(() => {
            setStatus('connecting');
            setTimeout(() => {
                setDevice({
                    id: 'TT-SENSOR-01',
                    type: 'Sensor Kelembapan & Suhu',
                    status: 'Active',
                });
                setStatus('connected');
            }, 2000);
        }, 3000);
    };

    const handleDisconnect = () => {
        setDevice(null);
        setStatus('disconnected');
    };

    const renderContent = () => {
        switch (status) {
            case 'searching':
                return (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600">Mencari perangkat di sekitar...</p>
                    </div>
                );
            case 'connecting':
                 return (
                    <div className="text-center">
                        <div className="animate-ping rounded-full h-12 w-12 bg-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600">Perangkat 'TemanTani-Sensor-01' ditemukan! Menghubungkan...</p>
                    </div>
                );
            case 'connected':
                return device && (
                    <div>
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-md mb-6 text-center">
                            <p className="font-bold">Perangkat Berhasil Terhubung!</p>
                        </div>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex justify-between"><strong>ID Perangkat:</strong> <span>{device.id}</span></li>
                            <li className="flex justify-between"><strong>Tipe:</strong> <span>{device.type}</span></li>
                            <li className="flex justify-between"><strong>Status:</strong> <span className="font-semibold text-green-600">{device.status}</span></li>
                        </ul>
                        <button 
                            onClick={handleDisconnect}
                            className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Putuskan Hubungan
                        </button>
                    </div>
                );
            case 'disconnected':
            default:
                return (
                    <div className="text-center">
                        <DeviceIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h4 className="font-semibold text-lg text-gray-700">Tidak ada perangkat terhubung.</h4>
                        <p className="text-gray-500 mt-2">Hubungkan sensor IoT Anda untuk memulai pemantauan lahan secara real-time.</p>
                        <button
                            onClick={handleFindDevice}
                            className="mt-6 bg-primary hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                        >
                            Temukan Perangkat Saya
                        </button>
                    </div>
                );
        }
    }


    return (
        <div className="max-w-2xl mx-auto">
            <Card title="Koneksi Perangkat IoT">
               <div className="p-6">
                 {renderContent()}
               </div>
            </Card>
        </div>
    );
};

export default IoTDeviceDashboard;
