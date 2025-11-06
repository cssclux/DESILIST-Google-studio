import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Listing, User, ChatThread, Message } from '../types';
import { XMarkIcon, PaperAirplaneIcon } from './icons/Icons';

interface ChatModalProps {
  currentUser: User;
  listing: Listing;
  chatThreads: ChatThread[];
  onSendMessage: (threadId: string, text: string) => void;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ currentUser, listing, chatThreads, onSendMessage, onClose }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const threadId = `${listing.id}-${currentUser.email}`;
  const currentThread = chatThreads.find(t => t.id === threadId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [currentThread?.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(threadId, message.trim());
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="glass-card w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in-down" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src={listing.seller.avatarUrl || `https://i.pravatar.cc/150?u=${listing.seller.email}`} alt={listing.seller.name} className="h-10 w-10 rounded-full" />
            <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Chat with {listing.seller.name.split(' ')[0]}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">Re: {listing.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 flex-grow overflow-y-auto bg-slate-50 dark:bg-gray-900/50">
          <div className="space-y-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg flex items-center gap-3 shadow-sm border border-gray-200 dark:border-gray-700">
                <img src={listing.imageUrls[0]} alt={listing.title} className="h-12 w-12 rounded-md object-cover flex-shrink-0"/>
                <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{listing.title}</p>
                    <p className="font-bold text-primary">{listing.price}</p>
                </div>
            </div>

            {currentThread?.messages.map((msg, index) => (
              <div key={msg.id || index} className={`flex items-end gap-2 ${msg.sender.email === currentUser.email ? 'justify-end' : 'justify-start'}`}>
                {msg.sender.email !== currentUser.email && (
                  <img src={msg.sender.avatarUrl || `https://i.pravatar.cc/150?u=${msg.sender.email}`} alt={msg.sender.name} className="h-6 w-6 rounded-full" />
                )}
                <div className={`max-w-xs md:max-w-md px-3 py-2 rounded-2xl ${msg.sender.email === currentUser.email ? 'bg-primary text-white rounded-br-lg' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-lg'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
                 {msg.sender.email === currentUser.email && (
                  <img src={currentUser.avatarUrl || `https://i.pravatar.cc/150?u=${currentUser.email}`} alt={currentUser.name} className="h-6 w-6 rounded-full" />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="input"
            />
            <button type="submit" className="p-3 bg-primary hover:bg-primary-dark text-white rounded-full shadow-md transition-colors disabled:opacity-50" disabled={!message.trim()}>
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
