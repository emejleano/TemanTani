import React, { useState, useEffect, useMemo } from 'react';
import { User, Order, Product } from '../../types';
import { api } from '../../services/apiService';
import Card from '../shared/Card';

interface BuyerOrdersDashboardProps {
  user: User;
}

const BuyerOrdersDashboard: React.FC<BuyerOrdersDashboardProps> = ({ user }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<{ [key: string]: Product }>({});
    const [farmers, setFarmers] = useState<{ [key: string]: User }>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [fetchedOrders, allProducts, allUsers] = await Promise.all([
                api.getOrdersByBuyer(user.id),
                api.getProducts(),
                api.getUsers()
            ]);
            
            const productMap = allProducts.reduce((acc, p) => {
                acc[p.id] = p;
                return acc;
            }, {} as { [key: string]: Product });
            
            const farmerMap = allUsers.reduce((acc, u) => {
                acc[u.id] = u;
                return acc;
            }, {} as { [key: string]: User });
            
            setOrders(fetchedOrders);
            setProducts(productMap);
            setFarmers(farmerMap);
            setIsLoading(false);
        };
        fetchData();
    }, [user.id]);
    
    if (isLoading) return <div className="text-center p-8">Memuat pesanan Anda...</div>;

    return (
        <Card title="Riwayat Pesanan Saya">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tanggal Pesan</th>
                            <th scope="col" className="px-6 py-3">Produk</th>
                            <th scope="col" className="px-6 py-3">Petani</th>
                            <th scope="col" className="px-6 py-3">Jumlah</th>
                            <th scope="col" className="px-6 py-3">Total Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? orders.map(order => {
                            const product = products[order.productId];
                            const farmer = product ? farmers[product.farmerId] : null;
                            return (
                                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{product?.name || 'Produk Dihapus'}</td>
                                    <td className="px-6 py-4">{farmer?.name || 'Petani Dihapus'}</td>
                                    <td className="px-6 py-4">{order.quantity} {product?.unit}</td>
                                    <td className="px-6 py-4 font-semibold">Rp {order.totalPrice.toLocaleString('id-ID')}</td>
                                </tr>
                            );
                        }) : (
                             <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">Anda belum memiliki pesanan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default BuyerOrdersDashboard;
