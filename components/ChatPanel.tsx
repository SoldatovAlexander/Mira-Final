import React, { useRef, useEffect } from 'react';
import { Send, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { SmartImage } from './SmartImage';

interface ChatPanelProps {
  messages: Message[];
  isStreaming: boolean;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onReset: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isStreaming,
  inputValue,
  onInputChange,
  onSend,
  onReset
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Moscow'
      }).format(date);
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/20 border-r border-white/30 backdrop-blur-md relative">
      
      {/* Sticky Header */}
      <div className="absolute top-0 left-0 right-0 z-10 glass-panel border-b-0 border-white/20 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <SmartImage src="avatar_mira.png" alt="Mira" className="w-full h-full rounded-full object-cover shadow-sm bg-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold text-dark text-sm leading-tight">Mira</h2>
            <span className="text-xs text-gray-500">AI-рекрутер</span>
          </div>
        </div>
        
        {messages.length > 0 && (
          <button 
            onClick={onReset}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-white/40"
            title="Сбросить чат"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-24 pb-4 px-4 space-y-6 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 text-sm mt-10">
            <p>Привет! Я Mira.</p>
            <p>Чем могу помочь в найме сегодня?</p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3 shadow-sm relative text-sm md:text-base ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'glass-message-ai text-dark rounded-bl-none'
              }`}
            >
              {msg.role === 'model' && (
                <div className="markdown-body">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
              {msg.role === 'user' && (
                <div className="whitespace-pre-wrap">{msg.text}</div>
              )}
              
              <div 
                className={`text-[10px] mt-1 opacity-70 flex w-full ${
                  msg.role === 'user' ? 'justify-end text-white' : 'justify-start text-gray-500'
                }`}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
            
            {/* Tiny avatar for AI messages */}
            {msg.role === 'model' && (
               <div className="w-5 h-5 mt-2 ml-1">
                 <SmartImage src="avatar_mira.png" alt="bot" className="w-full h-full rounded-full opacity-50" />
               </div>
            )}
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-start">
             <div className="glass-message-ai px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/30 border-t border-white/30 backdrop-blur-md">
        <div className="relative flex items-end gap-2 bg-white/60 rounded-3xl p-2 border border-white/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all shadow-sm">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите сообщение..."
            className="w-full bg-transparent border-none outline-none resize-none px-3 py-2 text-dark placeholder-gray-500 min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={onSend}
            disabled={!inputValue.trim() || isStreaming}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
              inputValue.trim() && !isStreaming
                ? 'bg-primary text-white shadow-md hover:bg-orange-500 transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;