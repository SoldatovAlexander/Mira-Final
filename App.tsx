import React, { useState, useEffect } from 'react';
import ChatPanel from './components/ChatPanel';
import ContentPanel from './components/ContentPanel';
import { Message } from './types';
import { streamChatResponse, streamHtmlResponse } from './services/geminiService';
import { loadPrompts, extractSection } from './services/promptLoader';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const [isHtmlStreaming, setIsHtmlStreaming] = useState(false);
  
  // HTML Content State
  const [htmlContent, setHtmlContent] = useState('');
  
  // Prompts State
  const [systemPromptChat, setSystemPromptChat] = useState('');
  const [systemPromptHtml, setSystemPromptHtml] = useState('');
  const [baseKnowledge, setBaseKnowledge] = useState('');

  // Mobile Tab State
  const [activeTab, setActiveTab] = useState<'chat' | 'content'>('chat');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Load Prompts
    const initPrompts = async () => {
      const { systemPrompt, baseKnowledge } = await loadPrompts();
      
      const chatSection = extractSection(systemPrompt, 'CHAT');
      const htmlSection = extractSection(systemPrompt, 'HTML');

      setSystemPromptChat(chatSection || systemPrompt); 
      setSystemPromptHtml(htmlSection || "You are a UI generator."); 
      setBaseKnowledge(baseKnowledge);
    };
    initPrompts();

    // 2. Mobile Detection
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setActiveTab('chat');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isChatStreaming) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    // Add User Message
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
    };
    
    const newHistory = [...messages, newUserMsg];
    setMessages(newHistory);
    
    // Start Parallel Generations
    setIsChatStreaming(true);
    setIsHtmlStreaming(true);

    // 1. Chat Stream
    let currentAiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: currentAiMsgId,
      role: 'model',
      text: '',
      timestamp: new Date().toISOString(),
      isStreaming: true
    }]);

    let accumulatedChat = '';

    streamChatResponse(
      newHistory,
      systemPromptChat,
      baseKnowledge,
      (textChunk) => {
        accumulatedChat += textChunk;
        setMessages(prev => prev.map(m => 
          m.id === currentAiMsgId ? { ...m, text: accumulatedChat } : m
        ));
      }
    ).finally(() => {
      setIsChatStreaming(false);
      setMessages(prev => prev.map(m => 
        m.id === currentAiMsgId ? { ...m, isStreaming: false } : m
      ));
    });

    // 2. HTML Stream
    let accumulatedHtml = '';
    
    streamHtmlResponse(
      userText,
      systemPromptHtml,
      baseKnowledge,
      (htmlChunk) => {
        accumulatedHtml += htmlChunk;
        if (accumulatedHtml.trim().length > 10) { 
           setHtmlContent(accumulatedHtml);
           if (isMobile) setActiveTab('content'); 
        }
      }
    ).finally(() => {
      setIsHtmlStreaming(false);
    });
  };

  const handleReset = () => {
    setMessages([]);
    setHtmlContent('');
    setInputValue('');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans relative">
      
      {/* Background Shapes for Glassmorphism */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-300 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-300 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
      
      {/* Main Container */}
      <div className="z-10 w-full h-full flex flex-col md:flex-row">
        
        {/* Mobile Tab Switcher */}
        {isMobile && (
          <div className="flex shrink-0 h-12 bg-white/40 border-b border-white/30 backdrop-blur-md">
             <button 
               className={`flex-1 font-semibold text-sm transition-colors ${activeTab === 'chat' ? 'text-primary bg-white/50' : 'text-gray-500'}`}
               onClick={() => setActiveTab('chat')}
             >
               Чат
             </button>
             <button 
               className={`flex-1 font-semibold text-sm transition-colors ${activeTab === 'content' ? 'text-primary bg-white/50' : 'text-gray-500'}`}
               onClick={() => setActiveTab('content')}
             >
               Контент
             </button>
          </div>
        )}

        {/* Left Panel (Chat) */}
        <div className={`
          ${isMobile ? (activeTab === 'chat' ? 'flex' : 'hidden') : 'flex'}
          md:w-[35%] lg:w-[30%] h-full transition-all duration-300
        `}>
          <ChatPanel 
            messages={messages}
            isStreaming={isChatStreaming}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSend={handleSend}
            onReset={handleReset}
          />
        </div>

        {/* Right Panel (Content) */}
        <div className={`
          ${isMobile ? (activeTab === 'content' ? 'flex' : 'hidden') : 'flex'}
          flex-1 h-full
        `}>
          <ContentPanel 
            htmlContent={htmlContent}
            isStreaming={isHtmlStreaming}
            isEmpty={!htmlContent}
          />
        </div>

      </div>
    </div>
  );
}

export default App;