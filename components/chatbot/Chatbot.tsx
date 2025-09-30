

import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon, SendIcon } from '../icons';
import { askChatbot } from '../../services/geminiService';
// FIX: Renamed ChatMessage to BotMessage to avoid type conflicts with user-to-user chat.


type BotMessage = {
  role: 'user' | 'model';
  text: string;
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>([
    { role: 'model', text: '🌱 Halo! Saya Teman Tani, asisten virtual pertanian Anda. Apa yang ingin Anda tanyakan hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: BotMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const chatHistory = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const responseText = await askChatbot(chatHistory, input);
    const modelMessage: BotMessage = { role: 'model', text: responseText };

    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Tombol Chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 z-50"
        aria-label="Buka Chatbot"
      >
        <ChatIcon className="w-8 h-8" />
      </button>

      {/* Jendela Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-[65vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 border border-green-200">
          <header className="bg-green-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-lg">🤖 Asisten Teman Tani</h3>
            <button onClick={() => setIsOpen(false)} className="font-bold text-2xl">&times;</button>
          </header>

          <main className="flex-1 p-4 overflow-y-auto bg-green-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-green-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-green-200 shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs px-4 py-3 rounded-2xl bg-white text-gray-800 rounded-bl-none border border-green-200 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </main>

          <footer className="p-4 border-t border-green-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="🌿 Ketik pertanyaan Anda..."
                className="flex-1 px-4 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default Chatbot;
