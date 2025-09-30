import React from 'react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  farmerName: string;
  onSelect: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, farmerName, onSelect }) => {
  return (
    <div 
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
        onClick={() => onSelect(product)}
    >
      <img className="h-48 w-full object-cover" src={product.imageUrl} alt={product.name} />
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-lg font-bold text-gray-800 truncate">{product.name}</h4>
        <p className="text-sm text-gray-500 mt-1">Oleh: {farmerName}</p>
        <div className="mt-4 flex-grow">
            <span className="text-2xl font-extrabold text-primary-600">
                Rp {product.price.toLocaleString('id-ID')}
            </span>
            <span className="text-gray-500"> / {product.unit}</span>
        </div>
        <button className="mt-4 w-full bg-primary-100 text-primary-700 font-bold py-2 px-4 rounded-lg hover:bg-primary-200 transition-colors">
            Lihat Detail
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
