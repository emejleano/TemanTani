import React, { useState, useEffect, useMemo } from 'react';
import { Product, User } from '../../types';
import { api } from '../../services/apiService';
import ProductCard from './ProductCard';
import ProductDetailModal from './ProductDetailModal';

interface MarketplaceBuyerDashboardProps {
    user: User;
}

const MarketplaceBuyerDashboard: React.FC<MarketplaceBuyerDashboardProps> = ({ user }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [farmers, setFarmers] = useState<{ [key: string]: User }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [fetchedProducts, fetchedUsers] = await Promise.all([
                api.getProducts(),
                api.getUsers()
            ]);
            
            const farmerMap = fetchedUsers.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {} as { [key: string]: User });

            setProducts(fetchedProducts);
            setFarmers(farmerMap);
            setIsLoading(false);
        };
        fetchData();
    }, []);
    
    const filteredProducts = useMemo(() => {
        return products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmers[product.farmerId]?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm, farmers]);

    if (isLoading) {
        return <div className="text-center p-8">Memuat produk...</div>;
    }

    return (
        <div className="space-y-6">
             <div className="bg-white p-4 rounded-lg shadow-sm">
                <input
                    type="text"
                    placeholder="Cari nama produk atau petani..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? filteredProducts.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        farmerName={farmers[product.farmerId]?.name || 'Petani'}
                        onSelect={() => setSelectedProduct(product)} 
                    />
                )) : (
                    <p className="col-span-full text-center text-gray-500">Produk tidak ditemukan.</p>
                )}
            </div>

            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    farmer={farmers[selectedProduct.farmerId]}
                    user={user}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default MarketplaceBuyerDashboard;
