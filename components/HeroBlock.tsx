import React from 'react';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { SmartImage } from './SmartImage';

const HeroBlock: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 md:p-12 animate-fade-in">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/40 border border-white/40 text-sm font-medium text-secondary mb-6 backdrop-blur-sm shadow-sm w-fit">
          Первый в России
        </div>

        {/* H1 */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark leading-[1.1] mb-6 tracking-tight">
          AI-рекрутер, который <span className="text-primary">сам находит</span> идеальных кандидатов
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
          Mira работает 24/7: ищет резюме, проводит интервью и оценивает навыки. 
          Автоматизируйте рутину и нанимайте лучших в 5 раз быстрее.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <a href="#" className="flex items-center justify-center px-8 py-4 bg-primary hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-0.5">
            Попробовать бесплатно
          </a>
          <a href="#" className="flex items-center justify-center px-8 py-4 bg-white/50 hover:bg-white/80 text-dark font-bold rounded-2xl transition-all border border-white/60 backdrop-blur-sm">
            Запросить демо
          </a>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Работает', value: '24/7' },
            { label: 'Кандидатов', value: '10 000' },
            { label: 'Ускорение', value: 'в 5 раз' },
            { label: 'Компаний', value: '100+' },
          ].map((m, i) => (
            <div key={i} className="bg-white/40 backdrop-blur-md rounded-2xl p-5 border border-white/30 shadow-sm flex flex-col items-center text-center">
              <span className="text-2xl md:text-3xl font-extrabold text-secondary mb-1">{m.value}</span>
              <span className="text-sm text-gray-500 font-medium">{m.label}</span>
            </div>
          ))}
        </div>

        {/* "What Mira can do" Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          <div className="flex-1 bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full shadow-sm bg-white overflow-hidden">
                <SmartImage src="avatar_mira.png" alt="Mira" className="w-full h-full object-cover" />
              </div>
              Что умеет Mira?
            </h3>
            <ul className="space-y-3">
              {[
                'Поиск по базам резюме',
                'Скрининг и скоринг',
                'Проведение видео-интервью',
                'Анализ Soft & Hard skills',
                'Автоматические офферы',
                'Аналитика воронки найма'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/3 bg-secondary/10 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="text-4xl font-bold text-dark mb-2">4.9/5</div>
            <div className="flex gap-1 mb-4 text-orange-400">
              <Star className="fill-current w-5 h-5" />
              <Star className="fill-current w-5 h-5" />
              <Star className="fill-current w-5 h-5" />
              <Star className="fill-current w-5 h-5" />
              <Star className="fill-current w-5 h-5" />
            </div>
            <p className="text-sm text-gray-600">
              Средняя оценка от 500+ компаний, использующих Mira для найма.
            </p>
          </div>

        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <ArrowRight className="w-4 h-4 animate-pulse" />
            Начните диалог слева, чтобы увидеть магию
          </p>
        </div>

      </div>
    </div>
  );
};

export default HeroBlock;