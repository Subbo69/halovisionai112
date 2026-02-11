import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Calendar from './Calendar';
import BookingForm from './BookingForm';
import { translations, Language } from '../utils/translations';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export default function BookingModal({ isOpen, onClose, language }: BookingModalProps) {
  const t = translations[language];

  const [step, setStep] = useState<'calendar' | 'form'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('UTC+1');

  // animation state
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      // wait for animation before unmount
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!visible) return null;

  const handleDateTimeSelect = (date: Date, time: string, timezone: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedTimezone(timezone);
    setStep('form');
  };

  const handleBack = () => setStep('calendar');

  const handleClose = () => {
    setStep('calendar');
    setSelectedDate(null);
    setSelectedTime('');
    onClose();
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/70 backdrop-blur-sm
        transition-opacity duration-300 ease-out
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* Custom Font */}
      <link href="https://fonts.cdnfonts.com/css/anurati" rel="stylesheet" />

      <div
        className={`
          relative w-full max-w-6xl max-h-[90vh]
          bg-gradient-to-br from-gray-900 to-black
          rounded-3xl shadow-2xl overflow-hidden
          transform transition-transform transition-opacity duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden">
          {/* LEFT PANEL - Fixed, no scroll */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-10 flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 mb-4 md:mb-8 pl-2 md:pl-4 flex-shrink-0">
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] font-bold select-none text-2xl md:text-4xl"
                style={{ fontFamily: 'Anurati, sans-serif', letterSpacing: '0.04em' }}
              >
                HALOVISION AI
              </span>
            </div>

            <div className="flex-shrink-0">
              <h2 className="text-2m md:text-xl font-bold text-white mb-2 md:mb-4">
                {t.growthMappingCall}
              </h2>
              <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
                {t.growthMappingDesc}
              </p>

              <div className="space-y-2 md:space-y-3 text-gray-300 mb-4 md:mb-8 text-xs md:text-base">
                <p>1. {t.analysisStep}</p>
                <p>2. {t.auditStep}</p>
                <p>3. {t.nextSteps}</p>
              </div>
            </div>

            {step === 'form' && selectedDate && (
              <div className="mt-auto space-y-2 md:space-y-3 pt-4 md:pt-6 border-t border-gray-700 flex-shrink-0">
                <InfoRow
                  icon="calendar"
                  label={selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                />
                <InfoRow icon="clock" label={selectedTime} />
                <InfoRow icon="timer" label="30 Min" />
              </div>
            )}

            <p className="text-gray-400 text-xs md:text-sm mt-auto pt-4 md:pt-6 hidden md:block flex-shrink-0">
              {t.agencyNote}
            </p>
          </div>

          {/* RIGHT PANEL - Scrollable */}
          <div className="w-full md:w-3/5 bg-gray-900 overflow-y-auto flex-1">
            {step === 'calendar' ? (
              <Calendar onSelectDateTime={handleDateTimeSelect} />
            ) : (
              <BookingForm
                selectedDate={selectedDate!}
                selectedTime={selectedTime}
                selectedTimezone={selectedTimezone}
                onBack={handleBack}
                onSuccess={handleClose}
                language={language}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Info Row */
function InfoRow({ icon, label }: { icon: 'calendar' | 'clock' | 'timer'; label: string }) {
  let path = '';

  switch (icon) {
    case 'calendar':
      path =
        'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
      break;
    case 'clock':
      path =
        'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      break;
    case 'timer':
      path =
        'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      break;
  }

  return (
    <div className="flex items-center gap-3 text-gray-300 text-sm md:text-base">
      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
      </svg>
      <span className="text-xs md:text-sm">{label}</span>
    </div>
  );
}
