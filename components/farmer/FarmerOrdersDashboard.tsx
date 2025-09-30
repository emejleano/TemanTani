import React, { useState, useEffect } from 'react';
import { User, Order, Product, FarmerPlan } from '../../types';
import { api } from '../../services/apiService';
import Card from '../shared/Card';
import PremiumFeatureLock from '../shared/PremiumFeatureLock';

interface FarmerOrdersDashboardProps {
  user: User;
  farmerPlan: FarmerPlan;
}

const FarmerOrdersDashboard: React.FC<FarmerOrdersDashboardProps> = ({ user, farmerPlan }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<{ [key: string]: Product }>({});
    const [buyers, setBuyers] = useState<{ [key: string]: User }>({});
    const [isLoading, setIsLoading] = useState(true);

    const isProUser = farmerPlan === FarmerPlan.PRO;

    useEffect(() => {
        if (!isProUser) {
            setIsLoading(false);
            return;
        }
        const fetchData = async () => {
            setIsLoading(true);
            const [fetchedOrders, allProducts, allUsers] = await Promise.all([
                api.getOrdersByFarmer(user.id),
                api.getProducts(),
                api.getUsers()
            ]);
            
            const productMap = allProducts.reduce((acc, p) => { acc[p.id] = p; return acc; }, {} as { [key: string]: Product });
            const buyerMap = allUsers.reduce((acc, u) => { acc[u.id] = u; return acc; }, {} as { [key: string]: User });
            
            setOrders(fetchedOrders);
            setProducts(productMap);
            setBuyers(buyerMap);
            setIsLoading(false);
        };
        fetchData();
    }, [user.id, isProUser]);
    
    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Memuat pesanan masuk...</div>;
        
        return (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tanggal</th>
                            <th scope="col" className="px-6 py-3">Produk Dipesan</th>
                            <th scope="col" className="px-6 py-3">Pembeli</th>
                            <th scope="col" className="px-6 py-3">Jumlah</th>
                            <th scope="col" className="px-6 py-3">Total Pemasukan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map(order => {
                            const product = products[order.productId];
                            const buyer = buyers[order.buyerId];
                            return (
                                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{product?.name || 'Produk Dihapus'}</td>
                                    <td className="px-6 py-4">{buyer?.name || 'Pembeli Dihapus'}</td>
                                    <td className="px-6 py-4">{order.quantity} {product?.unit}</td>
                                    <td className="px-6 py-4 font-semibold">Rp {order.totalPrice.toLocaleString('id-ID')}</td>
                                </tr>
                            );
                        }) : (
                             <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">Belum ada pesanan masuk.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
    
    return (
        <Card title="Pesanan Masuk">
            {!isProUser ? (
                <PremiumFeatureLock>
                    <div className="blur-sm">{renderContent()}</div>
                </PremiumFeatureLock>
            ) : (
                renderContent()
            )}
        </Card>
    );
};

export default FarmerOrdersDashboard;
