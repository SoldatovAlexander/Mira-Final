import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import HeroBlock from './HeroBlock';
import { Loader2 } from 'lucide-react';
import { ASSET_MAP } from './SmartImage';

interface ContentPanelProps {
  htmlContent: string;
  isStreaming: boolean;
  isEmpty: boolean;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ htmlContent, isStreaming, isEmpty }) => {
  const [sanitizedHtml, setSanitizedHtml] = useState('');
  
  // Buffer and throttle updates
  useEffect(() => {
    if (!htmlContent) {
      setSanitizedHtml('');
      return;
    }

    const timer = setTimeout(() => {
      // 1. Sanitize
      let clean = DOMPurify.sanitize(htmlContent, {
        ADD_TAGS: ['div', 'span', 'h1', 'h2', 'h3', 'p', 'ul', 'li', 'table', 'tr', 'td', 'th', 'button', 'a', 'br', 'hr', 'strong', 'em', 'img'],
        ADD_ATTR: ['class', 'style', 'width', 'height', 'src', 'alt'],
      });

      // 2. Asset Injection (Replace filenames with mapped URLs)
      // This regex looks for src="something.png" and checks if it's in our map
      clean = clean.replace(/src="([^"]+)"/g, (match, srcValue) => {
        const filename = srcValue.split('/').pop();
        if (filename && ASSET_MAP[filename]) {
          return `src="${ASSET_MAP[filename]}"`;
        }
        return match;
      });

      // 3. Cleanup dangerous styles
      clean = clean.replace(/style="[^"]*"/g, (match) => {
        return match
          .replace(/backdrop-filter:[^;]*;/g, '')
          .replace(/blur:[^;]*;/g, '')
          .replace(/-webkit-backdrop-filter:[^;]*;/g, '');
      });

      setSanitizedHtml(clean);
    }, 250);

    return () => clearTimeout(timer);
  }, [htmlContent]);

  if (isEmpty) {
    return (
      <div className="h-full w-full relative">
         <HeroBlock />
         {isStreaming && (
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm text-xs font-medium text-primary animate-pulse z-50">
              <Loader2 className="w-3 h-3 animate-spin" />
              Генерация интерфейса...
            </div>
         )}
      </div>
    );
  }

  return (
    <div className="h-full w-full relative bg-white/20">
      
      {/* Streaming Indicator */}
      {isStreaming && (
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm text-xs font-medium text-primary z-50">
          <Loader2 className="w-3 h-3 animate-spin" />
          Обновление...
        </div>
      )}

      {/* Dynamic Content Area */}
      <div 
        className="h-full w-full overflow-y-auto p-6 md:p-10 animate-fade-in custom-html-content"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
      
      <style>{`
        /* Scrollbar styles for the content area */
        .custom-html-content::-webkit-scrollbar {
          width: 6px;
        }
        .custom-html-content::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        /* Image styles within dynamic content */
        .custom-html-content img {
          max-width: 100%;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-top: 1rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ContentPanel;