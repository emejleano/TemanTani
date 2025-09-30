import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../../types';
import { api } from '../../services/apiService';
import Card from '../shared/Card';
import UserFormModal from './UserFormModal';
import { PlusIcon, EditIcon, DeleteIcon } from '../icons';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        const fetchedUsers = await api.getUsers();
        // Filter out the admin user from being displayed
        setUsers(fetchedUsers.filter(u => u.role !== UserRole.ADMIN));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = async (userData: Omit<User, 'id' | 'joinDate' | 'password'>) => {
        if (editingUser) {
            await api.updateUser(editingUser.id, userData);
        } else {
            // Note: Admin creating user might need more fields, simplified for now
            // await api.createUser(userData);
            alert("Fungsi tambah user oleh admin belum diimplementasikan sepenuhnya.")
        }
        fetchUsers();
        handleCloseModal();
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini? Semua data terkait (produk, komentar) akan ikut terhapus.")) {
            await api.deleteUser(userId);
            fetchUsers();
        }
    };

    if (isLoading) return <div>Memuat pengguna...</div>

    return (
        <Card title="Manajemen Pengguna">
             {/* <div className="flex justify-end mb-4">
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" /> Tambah Pengguna
                </button>
            </div> */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Peran</th>
                            <th scope="col" className="px-6 py-3">Paket</th>
                            <th scope="col" className="px-6 py-3">Tgl Bergabung</th>
                            <th scope="col" className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4 capitalize">{user.role.toLowerCase()}</td>
                                <td className="px-6 py-4">{user.plan}</td>
                                <td className="px-6 py-4">{new Date(user.joinDate).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button onClick={() => handleOpenModal(user)} className="text-blue-600 hover:text-blue-800 p-1" title="Edit">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 p-1" title="Hapus">
                                        <DeleteIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && editingUser && (
                <UserFormModal 
                    user={editingUser} 
                    onClose={handleCloseModal} 
                    onSave={handleSaveUser}
                />
            )}
        </Card>
    );
};

export default UserManagement;
