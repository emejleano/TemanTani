import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, ChatConversation, ChatMessage } from '../../types';
import { api } from '../../services/apiService';
import { SendIcon } from '../icons';

interface ChatModalProps {
  user: User;
  otherUser: User;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ user, otherUser, onClose }) => {
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversation = useCallback(async () => {
    const conv = await api.getOrCreateConversation(user.id, otherUser.id);
    setConversation(conv);
  }, [user.id, otherUser.id]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !conversation) return;

    const sentMessage = await api.sendMessage(conversation.id, user.id, newMessage);
    
    // Optimistically update UI
    setConversation(prev => prev ? { ...prev, messages: [...prev.messages, sentMessage] } : null);
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg m-4 h-[70vh] flex flex-col">
        <header className="bg-primary text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">
                    {otherUser.name.charAt(0)}
                </div>
                <div>
                    <h3 className="font-bold text-lg">{otherUser.name}</h3>
                    <p className="text-xs opacity-80 capitalize">{otherUser.role.toLowerCase()}</p>
                </div>
            </div>
            <button onClick={onClose} className="font-bold text-2xl">&times;</button>
        </header>
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
            {conversation?.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.senderId === user.id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-right mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                </div>
            ))}
             <div ref={messagesEndRef} />
            </div>
        </main>
         <footer className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="bg-primary text-white p-3 rounded-full hover:bg-primary-600">
                <SendIcon className="w-5 h-5" />
              </button>
            </form>
          </footer>
      </div>
    </div>
  );
};

export default ChatModal;
