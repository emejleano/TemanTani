import React, { useState } from 'react';
import { Product, User } from '../../types';
import { api } from '../../services/apiService';

interface CheckoutModalProps {
  product: Product;
  buyer: User;
  onClose: () => void;
  onConfirm: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, buyer, onClose, onConfirm }) => {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await api.createOrder({
                buyerId: buyer.id,
                productId: product.id,
                quantity: quantity,
                totalPrice: quantity * product.price
            });
            // Update product stock
            await api.updateProduct(product.id, { stock: product.stock - quantity });
            onConfirm();
        } catch (error) {
            console.error("Failed to create order:", error);
            alert("Gagal membuat pesanan. Stok mungkin tidak mencukupi.");
        } finally {
            setIsLoading(false);
        }
    };

    const totalPrice = quantity * product.price;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
            <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Konfirmasi Pesanan</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-lg"/>
                        <div>
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-500">Rp {product.price.toLocaleString('id-ID')} / {product.unit}</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jumlah</label>
                        <input 
                            type="number" 
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                            min="1"
                            max={product.stock}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total Harga:</span>
                            <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                <button type="button" onClick={onClose} disabled={isLoading} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Batal</button>
                <button 
                    type="button" 
                    onClick={handleConfirm} 
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 disabled:bg-primary-300"
                >
                    {isLoading ? 'Memproses...' : 'Konfirmasi Pesanan'}
                </button>
            </div>
        </div>
        </div>
    );
};

export default CheckoutModal;
