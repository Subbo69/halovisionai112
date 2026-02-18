import { ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { translations, Language } from '../utils/translations';
import { useEffect, useRef, useState } from 'react';

interface HeroProps {
  onBookingClick: () => void;
  onAskAIClick: () => void;
  language: Language;
}

export default function Hero({ onBookingClick, onAskAIClick, language }: HeroProps) {
  const t = translations[language];
  const bgRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  /* 🔁 PARALLAX */
  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      bgRef.current.style.transform = `translateY(${window.scrollY * 0.75}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-36 md:pt-40 pb-16 overflow-hidden">
      
      {/* Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full will-change-transform z-[-1]"
        style={{
          backgroundImage: "url('https://images.hdqwalls.com/wallpapers/neon-half-circle-q7.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 w-full text-center flex flex-col items-center">
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-white mt-10 drop-shadow-lg">
          {t.heroTitle}
        </h1>

        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-14 drop-shadow-md">
          {t.heroSubtitle}
        </p>

        {/* 🎥 VIDEO */}
        <div className="w-full mb-12 mt-6" style={{ maxWidth: '93%' }}>
          <div
            className="relative w-full overflow-hidden rounded-3xl shadow-2xl"
            style={{ paddingBottom: '56.25%' }}
          >
            <iframe
              key={hasStarted ? 'started' : 'idle'}
              src={
                hasStarted
                  ? "https://www.youtube-nocookie.com/embed/Py1ClI35v_k?autoplay=1&mute=0&rel=0&playsinline=1"
                  : "https://www.youtube-nocookie.com/embed/Py1ClI35v_k?rel=0&playsinline=1"
              }
              title="Hero Video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          {!hasStarted && (
            <button
              onClick={() => setHasStarted(true)}
              className="mt-5 px-6 py-3 bg-black/60 backdrop-blur text-white rounded-full flex items-center gap-2 hover:bg-black/80 transition"
            >
              <Volume2 className="w-4 h-4" />
              Play with Sound
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="flex justify-center mb-6 w-full">
          <button
            onClick={onBookingClick}
            className="bg-black/70 text-white px-8 py-4 rounded-full text-lg flex items-center gap-3 shadow-lg hover:bg-black/80 transition-transform hover:scale-[1.06]"
          >
            <span>{t.startJourney}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* AI Button */}
        <button
          onClick={onAskAIClick}
          className="text-white flex items-center gap-2 hover:text-white/70 transition-colors text-[130%] drop-shadow"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.askAI}</span>
        </button>
      </div>
    </section>
  );
}
