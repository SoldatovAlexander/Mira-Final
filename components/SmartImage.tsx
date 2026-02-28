import React, { useState, useEffect } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

// Карта ассетов, соответствующая файлам из Google Drive.
// Позволяет использовать имена файлов, как если бы они были локальными.
export const ASSET_MAP: Record<string, string> = {
  // Основные - Рыжеволосая девушка в синей рубашке
  'avatar_mira.png': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
  'mira_avatar.png': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
  
  // Интерфейсы и списки
  'resume_database.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/resume_database.png',
  'candidate_card.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/candidate_card.png',
  'candidates_list.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/candidates_list.png',
  'vacancies_list.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/vacancies_list.png',
  
  // Статистика и графики
  'job_statistics.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/job_statistics.png',
  'hiring_funnel_stats.jpg': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/hiring_funnel_stats.jpg',
  'economic_efficiency.jpeg': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/economic_efficiency.jpeg',
  'interview_scores_chart.jpg': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/interview_scores_chart.jpg',
  'resume_scores_chart.jpg': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/resume_scores_chart.jpg',
  
  // Анализ
  'skills_analysis.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/skills_analysis.png',
  'skills_analysis_full.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/skills_analysis_full.png',
  'emotion_analysis.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/emotion_analysis.png',
  
  // Процессы
  'start_interview.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/start_interview.png',
  'choosing_time.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/choosing_time.png',
  
  // Формы
  'briefing_form.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/briefing_form.png',
  'briefing_checklist.png': 'https://storage.yandexcloud.net/aiueducation/Vibe-coding/MIRA/briefing_checklist.png',
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