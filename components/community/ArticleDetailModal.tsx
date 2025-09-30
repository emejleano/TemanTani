import React, { useState, useEffect, useCallback } from 'react';
import { Article, User, Comment, Like } from '../../types';
import { api } from '../../services/apiService';
import { HeartIcon, HeartIconFilled, SendIcon } from '../icons';

interface ArticleDetailModalProps {
  article: Article;
  user: User;
  authorName: string;
  onClose: () => void;
  onUpdate: (article: Article) => void;
}

const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, user, authorName, onClose, onUpdate }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthors, setCommentAuthors] = useState<{ [key: string]: string }>({});
  const [likes, setLikes] = useState<Like[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const userHasLiked = likes.some(like => like.userId === user.id);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const [fetchedComments, fetchedLikes, allUsers] = await Promise.all([
        api.getCommentsForArticle(article.id),
        api.getLikesForArticle(article.id),
        api.getUsers()
    ]);
    
    const userMap = allUsers.reduce((acc, u) => {
        acc[u.id] = u.name;
        return acc;
    }, {} as {[key: string]: string});

    setComments(fetchedComments);
    setCommentAuthors(userMap);
    setLikes(fetchedLikes);
    setIsLoading(false);
  }, [article.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLikeToggle = async () => {
    await api.toggleLike(article.id, user.id);
    const updatedLikes = await api.getLikesForArticle(article.id);
    setLikes(updatedLikes);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    await api.addComment(article.id, user.id, newComment);
    setNewComment('');
    fetchData(); // Refetch comments to show the new one
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-start">
            <div>
                <h3 className="text-2xl font-bold text-gray-800">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Oleh {authorName} - {new Date(article.publishDate).toLocaleDateString('id-ID')}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl">&times;</button>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
            <img src={article.imageUrl} alt={article.title} className="w-full h-72 object-cover rounded-lg my-4" />
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{article.content}</div>
            
            <div className="my-6 border-t border-gray-200"></div>

            {/* --- Likes and Comments Section --- */}
            <div>
                <div className="flex items-center space-x-4 mb-4">
                    <button onClick={handleLikeToggle} className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                        {userHasLiked ? <HeartIconFilled className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6" />}
                        <span className="font-semibold">{likes.length} Suka</span>
                    </button>
                    <span className="text-gray-600 font-semibold">{comments.length} Komentar</span>
                </div>

                {/* --- Comments List --- */}
                 <div className="space-y-4">
                    {isLoading ? <p>Memuat komentar...</p> : comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                                {commentAuthors[comment.userId]?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-lg p-3">
                                <p className="font-semibold text-sm text-gray-800">{commentAuthors[comment.userId] || 'Pengguna'}</p>
                                <p className="text-sm text-gray-600">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
             <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar Anda..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="bg-primary text-white p-3 rounded-full hover:bg-primary-600">
                <SendIcon className="w-5 h-5" />
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailModal;
