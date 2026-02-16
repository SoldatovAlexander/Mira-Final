import React, { useState, useEffect } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

// Карта ассетов, соответствующая файлам из Google Drive.
// Позволяет использовать имена файлов, как если бы они были локальными.
export const ASSET_MAP: Record<string, string> = {
  // Основные - Рыжеволосая девушка в синей рубашке (обновлено)
  'avatar_mira.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/avatar_mira.png',
  'mira_avatar.png': 'https://images.unsplash.com/photo-1554244933-d877fea46fce?auto=format&fit=crop&w=800&q=80',
  
  // Интерфейсы и списки
  'resume_database.png': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  'candidate_card.png': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
  'candidates_list.png': 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
  'vacancies_list.png': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
  
  // Статистика и графики
  'job_statistics.png': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'hiring_funnel_stats.jpg': 'https://images.unsplash.com/photo-1543286386-713df548e9cc?auto=format&fit=crop&w=800&q=80',
  'economic_efficiency.jpeg': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  'interview_scores_chart.jpg': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'resume_scores_chart.jpg': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  
  // Анализ
  'skills_analysis.png': 'https://images.unsplash.com/photo-1507537297725-24a1c434c67b?auto=format&fit=crop&w=800&q=80',
  'skills_analysis_full.png': 'https://images.unsplash.com/photo-1507537297725-24a1c434c67b?auto=format&fit=crop&w=800&q=80',
  'emotion_analysis.png': 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80',
  
  // Процессы
  'start_interview.png': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  'choosing_time.png': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
  
  // Формы
  'briefing_form.png': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  'briefing_checklist.png': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
};

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({ src, className, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if src is already a URL
    if (src.startsWith('http')) {
      setImgSrc(src);
      return;
    }

    const filename = src.split('/').pop() || src;
    const mapped = ASSET_MAP[filename];

    if (mapped) {
      setImgSrc(mapped);
    } else {
      // If not in map, assume it's a local path relative to public
      setImgSrc(src);
    }
  }, [src]);

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4 rounded-lg border-2 border-dashed border-gray-200 ${className}`}>
        <ImageOff className="w-6 h-6 mb-2 opacity-50" />
        <span className="text-[10px] text-center leading-tight">{alt || 'Image not found'}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      )}
      <img
        {...props}
        src={imgSrc || src} // Fallback to src if imgSrc is not yet set
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};