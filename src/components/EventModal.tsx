import React, { useState, useCallback } from 'react';
import type { EventFormData, ReminderType } from '../types';
import { REMINDER_OPTIONS, COLOR_OPTIONS } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialDate?: string;
}

interface FormErrors {
  title?: string;
  time?: string;
}

const getTodayString = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function EventModal({ isOpen, onClose, onSubmit, initialDate }: EventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: initialDate ?? getTodayString(),
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    color: COLOR_OPTIONS[0]?.value ?? '#c0c1ff',
    reminder: 'none',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Başlık zorunludur';
    }

    if (formData.startTime && formData.endTime) {
      if (formData.endTime <= formData.startTime) {
        newErrors.time = 'Bitiş saati başlangıç saatinden sonra olmalıdır';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (field === 'startTime' || field === 'endTime') {
      setErrors((prev) => ({ ...prev, time: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      title: true,
      date: true,
      startTime: true,
      endTime: true,
      description: true,
      color: true,
      reminder: true,
    });

    if (validate()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        title: '',
        date: getTodayString(),
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        color: COLOR_OPTIONS[0]?.value ?? '#c0c1ff',
        reminder: 'none',
      });
      setErrors({});
      setTouched({});
    }
  }, [formData, onSubmit, validate]);

  const handleCancel = useCallback(() => {
    onClose();
    // Reset form state
    setFormData({
      title: '',
      date: initialDate ?? getTodayString(),
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      color: COLOR_OPTIONS[0]?.value ?? '#c0c1ff',
      reminder: 'none',
    });
    setErrors({});
    setTouched({});
  }, [onClose, initialDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-sm">
      <div className="w-full max-w-xl glass-morphism rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(192,193,255,0.12)] border border-[#464554]/15 p-10 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 right-0 p-8">
          <button
            type="button"
            onClick={handleCancel}
            className="text-[#908fa0] hover:text-[#dae2fd] transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <header className="mb-8">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-[#dae2fd]">
            Yeni Etkinlik Oluştur
          </h2>
          <p className="text-[#c7c4d7] font-medium mt-1">
            Takviminize yeni bir editoryal an ekleyin.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
              BAŞLIK
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Etkinlik başlığı..."
              className={`w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] placeholder:text-[#908fa0]/50 focus:ring-2 focus:ring-[#c0c1ff] transition-all ${
                touched.title && errors.title ? 'ring-2 ring-[#ffb4ab]' : ''
              }`}
            />
            {touched.title && errors.title && (
              <p className="mt-1 text-sm text-[#ffb4ab]">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
                TARİH
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] focus:ring-2 focus:ring-[#c0c1ff] appearance-none"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#908fa0] pointer-events-none">
                  calendar_month
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
                  BAŞLANGIÇ
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  className="w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] focus:ring-2 focus:ring-[#c0c1ff]"
                />
              </div>
              <div>
                <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
                  BİTİŞ
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  className={`w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] focus:ring-2 focus:ring-[#c0c1ff] ${
                    touched.endTime && errors.time ? 'ring-2 ring-[#ffb4ab]' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {(touched.startTime || touched.endTime) && errors.time && (
            <p className="text-sm text-[#ffb4ab] -mt-4">{errors.time}</p>
          )}

          <div>
            <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-3">
              RENK PALETİ
            </label>
            <div className="flex flex-wrap gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleChange('color', color.value)}
                  className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                    formData.color === color.value
                      ? 'ring-2 ring-offset-4 ring-offset-[#2a2a2c] ring-[#c0c1ff] scale-110'
                      : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={`Renk: ${color.name}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
              AÇIKLAMA
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detaylar buraya..."
              rows={3}
              className="w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] placeholder:text-[#908fa0]/50 focus:ring-2 focus:ring-[#c0c1ff] transition-all resize-none"
            />
          </div>

          <div>
            <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
              HATIRLATICI TİPİ
            </label>
            <div className="relative">
              <select
                value={formData.reminder}
                onChange={(e) => handleChange('reminder', e.target.value as ReminderType)}
                className="w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] focus:ring-2 focus:ring-[#c0c1ff] appearance-none pr-10"
              >
                {REMINDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#908fa0] pointer-events-none">
                notifications
              </span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-4 rounded-xl font-bold text-[#c0c1ff] hover:bg-white/5 transition-all text-sm cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-[2] bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0d0096] px-6 py-4 rounded-xl font-bold shadow-xl shadow-[#c0c1ff]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer"
            >
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
