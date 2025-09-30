import React, { useState } from 'react';
import { Product } from '../../types';

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id' | 'farmerId'>) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        unit: product?.unit || 'kg',
        stock: product?.stock || 0,
        imageUrl: product?.imageUrl || '',
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const isNumber = type === 'number';
      setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(formData.price <= 0 || formData.stock < 0) {
        alert("Harga dan stok tidak boleh negatif.");
        return;
      }
      onSave(formData);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Satuan</label>
                            <select name="unit" value={formData.unit} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option>kg</option>
                                <option>ikat</option>
                                <option>buah</option>
                                <option>liter</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stok</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
                        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700">Simpan Produk</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
