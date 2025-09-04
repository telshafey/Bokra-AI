



import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon, PaperAirplaneIcon, XMarkIcon } from './icons/Icons';
import { sendMessageToAI } from '../services/geminiService';
// FIX: Import EmployeeProfile type to define component props and fix type error from App.tsx.
import type { ChatMessage, EmployeeProfile } from '../types';
import { useTranslation } from './contexts/LanguageContext';


// FIX: Define props for the Chatbot component to accept the currentUser object.
interface ChatbotProps {
  currentUser: EmployeeProfile;
}

const Chatbot: React.FC<ChatbotProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();

  useEffect(() => {
    // Reset initial message when language or user changes
    setMessages([{ sender: 'ai', text: t('chatbot.greeting', { name: currentUser.name }) }]);
  }, [currentUser.name, t]);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await sendMessageToAI(input, currentUser, language);
      let aiResponse = '';
      setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

      for await (const chunk of stream) {
        aiResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'ai', text: t('chatbot.error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 bg-sky-600 text-white p-4 rounded-full shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-110 focus:outline-none z-50"
        aria-label={t('chatbot.openAIAssistant')}
      >
        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-full max-w-sm h-[60vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="bg-sky-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold text-lg">{t('chatbot.header')}</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-sky-700 p-1 rounded-full">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-900">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-xl p-3 max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'}`}>
                   {msg.text || <span className="animate-pulse">...</span>}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} className="bg-sky-600 text-white p-2 rounded-lg disabled:bg-slate-400 hover:bg-sky-700 transition-colors">
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;