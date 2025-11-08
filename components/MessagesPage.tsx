import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Message, User } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface MessagesPageProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  onSendMessage: (recipientId: string, text: string) => void;
  onSelectConversation: (userId: string) => void;
  selectedConversationUserId: string | null;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ currentUser, users, messages, onSendMessage, onSelectConversation, selectedConversationUserId }) => {
  const { t } = useTranslation();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = useMemo(() => {
    const conversationPartners = new Map<string, { user: User, lastMessage: Message }>();

    messages.forEach(msg => {
      const otherUserId = msg.senderId === currentUser.id ? msg.recipientId : msg.senderId;
      if (otherUserId === currentUser.id) return;

      if (!conversationPartners.has(otherUserId) || new Date(msg.timestamp) > new Date(conversationPartners.get(otherUserId)!.lastMessage.timestamp)) {
        const user = users.find(u => u.id === otherUserId);
        if (user) {
          conversationPartners.set(otherUserId, { user, lastMessage: msg });
        }
      }
    });

    return Array.from(conversationPartners.values()).sort((a, b) => 
      new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );
  }, [messages, users, currentUser.id]);

  const unreadCounts = useMemo(() => {
    return messages.reduce((acc, msg) => {
      if (msg.recipientId === currentUser.id && !msg.isRead) {
        acc[msg.senderId] = (acc[msg.senderId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [messages, currentUser.id]);
  
  const activeConversationMessages = useMemo(() => {
    if (!selectedConversationUserId) return [];
    return messages
      .filter(msg => 
        (msg.senderId === currentUser.id && msg.recipientId === selectedConversationUserId) ||
        (msg.senderId === selectedConversationUserId && msg.recipientId === currentUser.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedConversationUserId, currentUser.id]);

  const selectedUser = useMemo(() => {
    return users.find(u => u.id === selectedConversationUserId);
  }, [users, selectedConversationUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && selectedConversationUserId) {
      onSendMessage(selectedConversationUserId, messageText);
      setMessageText('');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[calc(100vh-12rem)] flex overflow-hidden">
      {/* Conversation List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('messages.title')}</h1>
        </div>
        <div className="flex-grow overflow-y-auto">
          {conversations.length > 0 ? conversations.map(({ user, lastMessage }) => (
            <button
              key={user.id}
              onClick={() => onSelectConversation(user.id)}
              className={`w-full text-left p-4 flex items-center space-x-3 transition-colors ${selectedConversationUserId === user.id ? 'bg-blue-50 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
            >
              <div className="relative flex-shrink-0">
                <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full" />
                {unreadCounts[user.id] > 0 && <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className={`font-semibold ${unreadCounts[user.id] > 0 ? 'text-gray-900 dark:text-gray-50' : 'text-gray-700 dark:text-gray-300'}`}>{user.name}</p>
                  <p className="text-xs text-gray-400">{new Date(lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <p className={`text-sm text-gray-500 dark:text-gray-400 truncate ${unreadCounts[user.id] > 0 && 'font-bold'}`}>
                  {lastMessage.text}
                </p>
              </div>
            </button>
          )) : <p className="p-4 text-gray-500">{t('messages.noMessages')}</p>}
        </div>
      </div>
      {/* Chat Window */}
      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
              <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="h-10 w-10 rounded-full" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{selectedUser.name}</h2>
            </div>
            <div className="flex-grow p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="space-y-4">
                {activeConversationMessages.length > 0 ? activeConversationMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3 rounded-lg ${msg.senderId === currentUser.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === currentUser.id ? 'text-blue-200' : 'text-gray-500'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                )) : (
                    <div className="text-center text-gray-500 p-8">{t('messages.startConversation', {name: selectedUser.name})}</div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder={t('messages.sendMessagePlaceholder')}
                  className="flex-grow w-full border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-full py-2 px-4 focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition">
                  {t('messages.send')}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>{t('messages.selectConversation')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
