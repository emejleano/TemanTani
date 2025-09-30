import React, { useState } from 'react';
import { Product, User } from '../../types';
import CheckoutModal from '../shared/CheckoutModal';
import ChatModal from '../shared/ChatModal';

interface ProductDetailModalProps {
  product: Product;
  farmer: User;
  user: User; // The logged-in buyer
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, farmer, user, onClose }) => {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleBuy = () => {
        setIsCheckoutOpen(true);
    };

    const handleChat = () => {
        setIsChatOpen(true);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 h-auto max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">Detail Produk</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl">&times;</button>
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md"/>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                            <p className="text-md text-gray-500 mt-2">Oleh: <span className="font-semibold text-primary">{farmer?.name || 'Petani'}</span> dari {farmer?.city}</p>
                            
                            <div className="mt-4">
                                <span className="text-4xl font-extrabold text-primary-600">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </span>
                                <span className="text-gray-500"> / {product.unit}</span>
                            </div>

                            <p className="mt-4 text-gray-600">{product.description}</p>

                            <p className="mt-4 font-semibold">Stok tersedia: <span className="text-gray-700">{product.stock} {product.unit}</span></p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={handleChat}
                                    className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Chat Petani
                                </button>
                                <button 
                                    onClick={handleBuy}
                                    className="flex-1 bg-primary hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                                    disabled={product.stock === 0}
                                >
                                    {product.stock > 0 ? 'Beli Sekarang' : 'Stok Habis'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {isCheckoutOpen && (
                <CheckoutModal
                    product={product}
                    buyer={user}
                    onClose={() => setIsCheckoutOpen(false)}
                    onConfirm={() => {
                        alert(`Pesanan untuk ${product.name} berhasil dibuat!`);
                        setIsCheckoutOpen(false);
                        onClose();
                    }}
                />
            )}

            {isChatOpen && (
                <ChatModal
                    user={user}
                    otherUser={farmer}
                    onClose={() => setIsChatOpen(false)}
                />
            )}
        </>
    );
};

export default ProductDetailModal;
