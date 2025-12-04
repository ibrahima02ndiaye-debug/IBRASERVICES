

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
// FIX: Removed import from obsolete `geminiService.ts`.
import { ChatMessage } from '../types';
import { SendIcon, CloseIcon, ChatIcon, BotIcon } from './icons/Icons';

const ChatAssistant: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX: Removed startChat() call from obsolete service.
    setMessages([{ sender: 'bot', text: t('chat.greeting') }]);
  }, [t]);

  useEffect(() => {
    if(isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // FIX: Call backend API for a streaming chat response.
      const response = await fetch('/api/ai/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok || !response.body) {
        throw new Error('API request failed');
      }
      
      let botResponse = '';
      setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value);
        botResponse += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'bot', text: botResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessageIndex = newMessages.length - 1;
        // FIX: Improved error handling logic.
        if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].sender === 'bot' && newMessages[lastMessageIndex].text === '') {
            newMessages[lastMessageIndex].text = t('chat.error');
        } else {
            newMessages.push({ sender: 'bot', text: t('chat.error') });
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1.5">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 z-50"
        aria-label={isOpen ? t('chat.close') : t('chat.open')}
      >
        {isOpen ? <CloseIcon className="w-7 h-7" /> : <ChatIcon className="w-8 h-8" />}
      </button>

      <div className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col z-40 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
              <BotIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              <h3 className="font-bold text-lg text-gray-950 dark:text-white">{t('chat.title')}</h3>
          </div>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'bot' && <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex-shrink-0 flex items-center justify-center"><BotIcon className="w-5 h-5 text-blue-500 dark:text-blue-400"/></div>}
              <div className={`max-w-xs px-4 py-2.5 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-lg'}`}>
                {msg.text === '' && msg.sender === 'bot' ? <TypingIndicator /> : <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-950 dark:text-white px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="ml-3 bg-blue-600 text-white p-3 rounded-full disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatAssistant;
