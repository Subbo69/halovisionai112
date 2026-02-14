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

type Step = 'calendar' | 'form' | 'confirmation';

export default function BookingModal({ isOpen, onClose, language }: BookingModalProps) {
  const t = translations[language];

  const [step, setStep] = useState<Step>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('UTC+1');

  const [formData, setFormData] = useState<any>(null); // store form data for confirmation

  // animation state
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setVisible(true);
    else {
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

  const handleBackToCalendar = () => setStep('calendar');
  const handleBackToForm = () => setStep('form');

  const handleClose = () => {
    setStep('calendar');
    setSelectedDate(null);
    setSelectedTime('');
    setFormData(null);
    onClose();
  };

  // called from BookingForm
  const handleFormSubmit = (data: any) => {
    setFormData(data);
    setStep('confirmation');
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4
      bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out
      ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <link href="https://fonts.cdnfonts.com/css/anurati" rel="stylesheet" />

      <div className={`relative w-full max-w-6xl max-h-[90vh]
        bg-gradient-to-br from-gray-900 to-black
        rounded-3xl shadow-2xl overflow-hidden
        transform transition-transform transition-opacity duration-300 ease-out
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden">
          {/* LEFT PANEL */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-gray-800 to-gray-900 p-6 md:p-10 flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 mb-4 md:mb-8 pl-2 md:pl-4 flex-shrink-0">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white
                drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] font-bold select-none text-2xl md:text-4xl"
                style={{ fontFamily: 'Anurati, sans-serif', letterSpacing: '0.04em' }}>
                HALOVISION AI
              </span>
            </div>

            {step !== 'calendar' && selectedDate && formData && (
              <div className="mt-auto space-y-2 md:space-y-3 pt-4 md:pt-6 border-t border-gray-700 flex-shrink-0 text-gray-300">
                <InfoRow icon="calendar" label={selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}/>
                <InfoRow icon="clock" label={selectedTime} />
                <InfoRow icon="timer" label="30 Min" />
                <div className="text-xs md:text-sm mt-2 space-y-1">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.countryCode}{formData.phone}</p>
                  <p><strong>Revenue:</strong> {formData.revenueRange}</p>
                  <p><strong>Website:</strong> {formData.website}</p>
                </div>
              </div>
            )}

            <p className="text-gray-400 text-xs md:text-sm mt-auto pt-4 md:pt-6 hidden md:block flex-shrink-0">
              {t.agencyNote}
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full md:w-3/5 bg-gray-900 overflow-y-auto flex-1">
            {step === 'calendar' && <Calendar onSelectDateTime={handleDateTimeSelect} />}

            {step === 'form' && selectedDate && (
              <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedTimezone={selectedTimezone}
                onBack={handleBackToCalendar}
                onSuccess={handleFormSubmit} // now moves to confirmation
                language={language}
              />
            )}

            {step === 'confirmation' && formData && selectedDate && (
              <ConfirmationPage
                date={selectedDate}
                time={selectedTime}
                timezone={selectedTimezone}
                formData={formData}
                onBack={handleBackToForm}
                onConfirm={handleClose} // closes modal after success
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// InfoRow reused from your code
function InfoRow({ icon, label }: { icon: 'calendar' | 'clock' | 'timer'; label: string }) {
  let path = '';
  switch (icon) {
    case 'calendar': path='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'; break;
    case 'clock': path='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'; break;
    case 'timer': path='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'; break;
  }
  return (
    <div className="flex items-center gap-3 text-gray-300 text-sm md:text-base">
      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path}/>
      </svg>
      <span className="text-xs md:text-sm">{label}</span>
    </div>
  );
}

// ConfirmationPage component
function ConfirmationPage({ date, time, timezone, formData, onBack, onConfirm }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const fullPhone = `${formData.countryCode}${formData.phone}`;
      const formBody = new URLSearchParams();
      Object.entries(formData).forEach(([key, val]) => formBody.append(key, val));
      formBody.append('fullPhone', fullPhone);
      formBody.append('date', formattedDate);
      formBody.append('time', time);
      formBody.append('timezone', timezone);

      await fetch('https://n8n.halovisionai.cloud/webhook/halovisionschedule880088', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString(),
        mode: 'no-cors',
      });

      setSuccess(true);
      setTimeout(() => onConfirm(), 1500); // wait a bit for animation
    } catch (err) {
      console.error(err);
      alert('Error submitting booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 flex flex-col gap-4 text-white">
      <h2 className="text-xl font-bold">Confirm Your Booking</h2>

      <p><strong>Date:</strong> {date.toLocaleDateString()}</p>
      <p><strong>Time:</strong> {time}</p>
      <p><strong>Timezone:</strong> {timezone}</p>
      <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
      <p><strong>Email:</strong> {formData.email}</p>
      <p><strong>Phone:</strong> {formData.countryCode}{formData.phone}</p>
      <p><strong>Revenue:</strong> {formData.revenueRange}</p>
      <p><strong>Website:</strong> {formData.website}</p>
      <p><strong>Description:</strong> {formData.businessDescription}</p>
      {formData.reason && <p><strong>Reason:</strong> {formData.reason}</p>}

      {!success ? (
        <div className="flex gap-4 mt-4">
          <button className="bg-gray-700 px-4 py-2 rounded" onClick={onBack}>Back</button>
          <button
            className={`px-4 py-2 rounded bg-green-600 hover:bg-green-700`}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm'}
          </button>
        </div>
      ) : (
        <p className="text-green-400 font-bold text-lg animate-pulse mt-4">Booking Confirmed!</p>
      )}
    </div>
  );
}

