import React, { useState } from 'react';
import { Article } from '../../types';

interface ArticleFormModalProps {
  article: Article | null;
  onClose: () => void;
  onSave: (articleData: Omit<Article, 'id' | 'publishDate' | 'authorId'>) => void;
}

const ArticleFormModal: React.FC<ArticleFormModalProps> = ({ article, onClose, onSave }) => {
  const [formData, setFormData] = useState({
      title: article?.title || '',
      content: article?.content || '',
      imageUrl: article?.imageUrl || '',
      tags: article?.tags?.join(', ') || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const articleData = {
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      }
      onSave(articleData);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
        <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">{article ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Judul Artikel</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Konten</label>
                        <textarea name="content" value={formData.content} onChange={handleChange} rows={10} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
                        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Tags (pisahkan dengan koma)</label>
                        <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g. padi, organik, tips"/>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700">Simpan Artikel</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleFormModal;
