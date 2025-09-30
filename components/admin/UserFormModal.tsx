import React, { useState } from 'react';
import { User, FarmerPlan, UserRole } from '../../types';

interface UserFormModalProps {
  user: User;
  onClose: () => void;
  onSave: (userData: Omit<User, 'id' | 'joinDate' | 'password'>) => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      address: user.address,
      city: user.city,
      province: user.province,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <form onSubmit={handleSubmit}>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Edit Pengguna: {user.name}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700">Peran</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value={UserRole.FARMER}>Petani</option>
                                <option value={UserRole.BUYER}>Pembeli</option>
                            </select>
                        </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700">Paket</label>
                            <select name="plan" value={formData.plan} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value={FarmerPlan.FREE}>Gratis</option>
                                <option value={FarmerPlan.PRO}>Pro</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700">Simpan Perubahan</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
