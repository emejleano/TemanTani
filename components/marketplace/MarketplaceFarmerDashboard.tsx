import React, { useState, useEffect, useCallback } from 'react';
import { Product, User, FarmerPlan } from '../../types';
import { api } from '../../services/apiService';
import Card from '../shared/Card';
import ProductFormModal from './ProductFormModal';
import { PlusIcon, EditIcon, DeleteIcon } from '../icons';
import PremiumFeatureLock from '../shared/PremiumFeatureLock';

interface MarketplaceFarmerDashboardProps {
    user: User;
    farmerPlan: FarmerPlan;
}

const MarketplaceFarmerDashboard: React.FC<MarketplaceFarmerDashboardProps> = ({ user, farmerPlan }) => {
    const [myProducts, setMyProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const isProUser = farmerPlan === FarmerPlan.PRO;

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        const products = await api.getProductsByFarmer(user.id);
        setMyProducts(products);
        setIsLoading(false);
    }, [user.id]);

    useEffect(() => {
        if (isProUser) {
            fetchProducts();
        } else {
            setIsLoading(false);
        }
    }, [isProUser, fetchProducts]);

    const handleOpenModal = (product: Product | null = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = async (productData: Omit<Product, 'id' | 'farmerId'>) => {
        if (editingProduct) {
            // Update
            await api.updateProduct(editingProduct.id, productData);
        } else {
            // Create
            await api.createProduct({ ...productData, farmerId: user.id });
        }
        fetchProducts();
        handleCloseModal();
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            await api.deleteProduct(productId);
            fetchProducts();
        }
    };
    
    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Memuat produk Anda...</div>;
        
        return (
            <>
                 <div className="flex justify-end mb-4">
                    <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <PlusIcon className="w-5 h-5 mr-2" /> Tambah Produk Baru
                    </button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama Produk</th>
                            <th scope="col" className="px-6 py-3">Harga</th>
                            <th scope="col" className="px-6 py-3">Stok</th>
                            <th scope="col" className="px-6 py-3">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {myProducts.length > 0 ? myProducts.map(product => (
                            <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4">Rp {product.price.toLocaleString('id-ID')} / {product.unit}</td>
                                <td className="px-6 py-4">{product.stock} {product.unit}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800 p-1" title="Edit">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800 p-1" title="Hapus">
                                        <DeleteIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">Anda belum memiliki produk.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }

    return (
        <div className="space-y-6">
            <Card title="Produk Anda di Marketplace">
                {!isProUser ? (
                     <PremiumFeatureLock>
                         <div className="blur-sm">{renderContent()}</div>
                    </PremiumFeatureLock>
                ) : (
                    renderContent()
                )}
            </Card>
            {isModalOpen && (
                <ProductFormModal 
                    onClose={handleCloseModal} 
                    onSave={handleSaveProduct}
                    product={editingProduct} 
                />
            )}
        </div>
    );
};

export default MarketplaceFarmerDashboard;
