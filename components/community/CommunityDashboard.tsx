import React, { useState, useEffect } from 'react';
import { Article, User, FarmerPlan } from '../../types';
import { api } from '../../services/apiService';
import Card from '../shared/Card';
import ArticleDetailModal from './ArticleDetailModal';
import PremiumFeatureLock from '../shared/PremiumFeatureLock';

interface CommunityDashboardProps {
    user: User;
    farmerPlan: FarmerPlan;
}

const CommunityDashboard: React.FC<CommunityDashboardProps> = ({ user, farmerPlan }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [authors, setAuthors] = useState<{ [key: string]: string }>({});
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const isProUser = farmerPlan === FarmerPlan.PRO;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const fetchedArticles = await api.getArticles();
            const fetchedUsers = await api.getUsers();
            
            const authorMap = fetchedUsers.reduce((acc, user) => {
                acc[user.id] = user.name;
                return acc;
            }, {} as { [key: string]: string });

            setArticles(fetchedArticles);
            setAuthors(authorMap);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleArticleUpdate = (updatedArticle: Article) => {
        setArticles(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
    }

    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Memuat artikel...</div>;
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                    <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedArticle(article)}>
                        <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h4 className="font-bold text-lg">{article.title}</h4>
                            <p className="text-sm text-gray-500">Oleh {authors[article.authorId] || 'Admin'} - {new Date(article.publishDate).toLocaleDateString('id-ID')}</p>
                            <div className="mt-2">
                                {article.tags.map(tag => <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{tag}</span>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card title="Artikel & Tips Pertanian">
                {!isProUser ? (
                    <PremiumFeatureLock>
                         <div className="blur-sm">{renderContent()}</div>
                    </PremiumFeatureLock>
                ) : (
                    renderContent()
                )}
            </Card>

            {selectedArticle && (
                <ArticleDetailModal 
                    article={selectedArticle} 
                    user={user}
                    authorName={authors[selectedArticle.authorId] || 'Admin'}
                    onClose={() => setSelectedArticle(null)} 
                    onUpdate={handleArticleUpdate}
                />
            )}
        </div>
    );
};

export default CommunityDashboard;
