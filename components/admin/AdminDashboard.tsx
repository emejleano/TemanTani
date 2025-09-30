import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import StatCard from './StatCard';
import { api } from '../../services/apiService';
import { UserRole } from '../../types';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({ totalUsers: 0, farmers: 0, buyers: 0, products: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            const [users, products] = await Promise.all([api.getUsers(), api.getProducts()]);
            const totalUsers = users.length;
            const farmers = users.filter(u => u.role === UserRole.FARMER).length;
            const buyers = users.filter(u => u.role === UserRole.BUYER).length;
            const totalProducts = products.length;
            setStats({ totalUsers, farmers, buyers, products: totalProducts });
            setIsLoading(false);
        };
        fetchStats();
    }, []);

    const statValue = (value: number) => isLoading ? '...' : value.toLocaleString('id-ID');

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Pengguna" value={statValue(stats.totalUsers)} />
                <StatCard title="Petani Terdaftar" value={statValue(stats.farmers)} />
                <StatCard title="Pembeli Terdaftar" value={statValue(stats.buyers)} />
                <StatCard title="Produk Aktif" value={statValue(stats.products)} />
            </div>
            <Card title="Aktivitas Terbaru">
                <p className="text-gray-500">Log aktivitas akan ditampilkan di sini di versi mendatang.</p>
            </Card>
        </div>
    );
};

export default AdminDashboard;
