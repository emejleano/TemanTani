import React, { useState, useEffect, useCallback } from 'react';
import { Article, User } from '../../types';
import { api } from '../../services/apiService';
import Card from '../shared/Card';
import ArticleFormModal from './ArticleFormModal';
import { PlusIcon, EditIcon, DeleteIcon } from '../icons';

interface ArticleManagementProps {
    user: User;
}

const ArticleManagement: React.FC<ArticleManagementProps> = ({ user }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    const fetchArticles = useCallback(async () => {
        setIsLoading(true);
        const fetchedArticles = await api.getArticles();
        setArticles(fetchedArticles);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleOpenModal = (article: Article | null = null) => {
        setEditingArticle(article);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingArticle(null);
    };

    const handleSaveArticle = async (articleData: Omit<Article, 'id' | 'publishDate' | 'authorId'>) => {
        if (editingArticle) {
            await api.updateArticle(editingArticle.id, articleData);
        } else {
            await api.createArticle({ ...articleData, authorId: user.id });
        }
        fetchArticles();
        handleCloseModal();
    };

    const handleDeleteArticle = async (articleId: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
            await api.deleteArticle(articleId);
            fetchArticles();
        }
    };

    if (isLoading) return <div>Memuat artikel...</div>;

    return (
        <Card title="Manajemen Artikel">
             <div className="flex justify-end mb-4">
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" /> Tambah Artikel
                </button>
            </div>
            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Judul</th>
                            <th scope="col" className="px-6 py-3">Tgl Publikasi</th>
                            <th scope="col" className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(article => (
                            <tr key={article.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
                                <td className="px-6 py-4">{new Date(article.publishDate).toLocaleDateString('id-ID')}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                     <button onClick={() => handleOpenModal(article)} className="text-blue-600 hover:text-blue-800 p-1" title="Edit">
                                        <EditIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDeleteArticle(article.id)} className="text-red-600 hover:text-red-800 p-1" title="Hapus">
                                        <DeleteIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <ArticleFormModal 
                    article={editingArticle} 
                    onClose={handleCloseModal} 
                    onSave={handleSaveArticle}
                />
            )}
        </Card>
    );
};

export default ArticleManagement;
