import React, { useState, useEffect } from 'react';
import { User, ChatConversation, FarmerPlan } from '../../types';
import { api } from '../../services/apiService';
import Card from '../shared/Card';
import ChatModal from '../shared/ChatModal';
import PremiumFeatureLock from '../shared/PremiumFeatureLock';

interface FarmerChatsDashboardProps {
  user: User;
  farmerPlan: FarmerPlan;
}

const FarmerChatsDashboard: React.FC<FarmerChatsDashboardProps> = ({ user, farmerPlan }) => {
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [otherUsers, setOtherUsers] = useState<{ [key: string]: User }>({});
    const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isProUser = farmerPlan === FarmerPlan.PRO;

    useEffect(() => {
        if (!isProUser) {
            setIsLoading(false);
            return;
        }
        const fetchData = async () => {
            setIsLoading(true);
            const [convos, allUsers] = await Promise.all([
                api.getConversationsForUser(user.id),
                api.getUsers()
            ]);
            
            const userMap = allUsers.reduce((acc, u) => { acc[u.id] = u; return acc; }, {} as { [key: string]: User });
            
            setConversations(convos);
            setOtherUsers(userMap);
            setIsLoading(false);
        };
        fetchData();
    }, [user.id, isProUser]);

    const handleConversationClick = (convo: ChatConversation) => {
        setSelectedConversation(convo);
    };

    const getOtherParticipant = (convo: ChatConversation): User | undefined => {
        const otherId = convo.participants.find(pId => pId !== user.id);
        return otherId ? otherUsers[otherId] : undefined;
    };
    
    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">Memuat pesan...</div>;

        return (
             <div className="space-y-2">
                {conversations.length > 0 ? conversations.map(convo => {
                    const otherUser = getOtherParticipant(convo);
                    const lastMessage = convo.messages[convo.messages.length - 1];
                    return (
                        <div key={convo.id} onClick={() => handleConversationClick(convo)} className="p-4 bg-white border rounded-lg hover:bg-gray-50 cursor-pointer flex items-center space-x-4">
                             <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                                {otherUser?.name.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold text-gray-800">{otherUser?.name || 'Pengguna Dihapus'}</p>
                                <p className="text-sm text-gray-500 truncate">{lastMessage ? `${lastMessage.senderId === user.id ? 'Anda: ' : ''}${lastMessage.text}` : 'Belum ada pesan'}</p>
                            </div>
                            <span className="text-xs text-gray-400">{new Date(convo.lastMessageTimestamp).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })}</span>
                        </div>
                    );
                }) : (
                    <p className="text-center py-8 text-gray-500">Belum ada pesan masuk.</p>
                )}
            </div>
        );
    }

    return (
        <Card title="Pesan dari Pembeli">
            {!isProUser ? (
                <PremiumFeatureLock>
                    <div className="blur-sm">{renderContent()}</div>
                </PremiumFeatureLock>
            ) : (
                renderContent()
            )}
            {selectedConversation && getOtherParticipant(selectedConversation) && (
                <ChatModal
                    user={user}
                    otherUser={getOtherParticipant(selectedConversation)!}
                    onClose={() => setSelectedConversation(null)}
                />
            )}
        </Card>
    );
};

export default FarmerChatsDashboard;
