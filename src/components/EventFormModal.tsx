import { useState, useCallback } from 'react';
import type { EventFormData, CalendarEvent } from '../types';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
  editingEvent?: CalendarEvent | null;
}

const COLOR_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '#c0c1ff', label: 'İndigo' },
  { value: '#ffb783', label: 'Turuncu' },
  { value: '#ffb4ab', label: 'Kırmızı' },
  { value: '#8083ff', label: 'Mor' },
  { value: '#31394d', label: 'Gri' },
  { value: '#d97721', label: 'Amber' },
  { value: '#10b981', label: 'Yeşil' },
  { value: '#14b8a6', label: 'Turkuaz' },
];

const REMINDER_OPTIONS = [
  { value: 'none', label: 'Hatırlatıcı yok' },
  { value: '15 dakika önce', label: '15 dakika önce' },
  { value: '30 dakika önce', label: '30 dakika önce' },
  { value: '1 saat önce', label: '1 saat önce' },
  { value: '1 gün önce', label: '1 gün önce' },
];

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0] ?? '';
};

export function EventFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  editingEvent,
}: EventFormModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title ?? '',
    date: initialData?.date ?? getTodayString(),
    startTime: initialData?.startTime ?? '09:00',
    endTime: initialData?.endTime ?? '10:00',
    description: initialData?.description ?? '',
    color: initialData?.color ?? COLOR_OPTIONS[0]?.value ?? '#c0c1ff',
    reminder: initialData?.reminder ?? 'none',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof EventFormData, boolean>>>({});

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Başlık gerekli';
    }
    
    if (!formData.date) {
      newErrors.date = 'Tarih gerekli';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Başlangıç saati gerekli';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'Bitiş saati gerekli';
    }
    
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Bitiş saati başlangıç saatinden sonra olmalı';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validate();
    }
  }, [touched, validate]);

  const handleBlur = useCallback((field: keyof EventFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  }, [validate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  }, [formData, onSubmit, onClose, validate]);

  const handleClose = useCallback(() => {
    setErrors({});
    setTouched({});
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-surface)]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-morphism rounded-2xl shadow-[0_32px_64px_rgba(128,131,255,0.12)] border border-[var(--color-outline-variant)]/15 p-8 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header */}
        <h2 className="font-headline text-2xl font-bold text-[var(--color-on-surface)] mb-6">
          {editingEvent ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-2">
              Başlık
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              placeholder="Etkinlik başlığı..."
              className={`
                w-full bg-[var(--color-surface-container-highest)] border rounded-xl px-4 py-3 
                text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50
                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200
                ${errors.title ? 'border-[var(--color-error)]' : 'border-transparent'}
              `}
            />
            {errors.title && <p className="mt-1 text-sm text-[var(--color-error)]">{errors.title}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-2">
              Tarih
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              onBlur={() => handleBlur('date')}
              className={`
                w-full bg-[var(--color-surface-container-highest)] border rounded-xl px-4 py-3 
                text-[var(--color-on-surface)]
                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200
                ${errors.date ? 'border-[var(--color-error)]' : 'border-transparent'}
              `}
            />
            {errors.date && <p className="mt-1 text-sm text-[var(--color-error)]">{errors.date}</p>}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-2">
                Başlangıç Saati
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                onBlur={() => handleBlur('startTime')}
                className={`
                  w-full bg-[var(--color-surface-container-highest)] border rounded-xl px-4 py-3 
                  text-[var(--color-on-surface)]
                  focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                  transition-all duration-200
                  ${errors.startTime ? 'border-[var(--color-error)]' : 'border-transparent'}
                `}
              />
              {errors.startTime && <p className="mt-1 text-sm text-[var(--color-error)]">{errors.startTime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-2">
                Bitiş Saati
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                onBlur={() => handleBlur('endTime')}
                className={`
                  w-full bg-[var(--color-surface-container-highest)] border rounded-xl px-4 py-3 
                  text-[var(--color-on-surface)]
                  focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                  transition-all duration-200
                  ${errors.endTime ? 'border-[var(--color-error)]' : 'border-transparent'}
                `}
              />
              {errors.endTime && <p className="mt-1 text-sm text-[var(--color-error)]">{errors.endTime}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detaylar buraya..."
              rows={3}
              className="w-full bg-[var(--color-surface-container-highest)] border border-transparent rounded-xl px-4 py-3 
                text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50
                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200 resize-none"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-2">
              Renk
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleChange('color', color.value)}
                  className={`
                    w-10 h-10 rounded-lg border-2 transition-all duration-200
                    ${formData.color === color.value 
                      ? 'border-[var(--color-on-surface)] scale-110' 
                      : 'border-transparent hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)] mb-2">
              Hatırlatıcı
            </label>
            <select
              value={formData.reminder}
              onChange={(e) => handleChange('reminder', e.target.value)}
              className="w-full bg-[var(--color-surface-container-highest)] border border-transparent rounded-xl px-4 py-3 
                text-[var(--color-on-surface)]
                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200 appearance-none cursor-pointer"
            >
              {REMINDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-4 rounded-xl font-bold text-[var(--color-primary)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200 text-sm"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-[2] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] 
                text-[var(--color-on-primary)] px-6 py-4 rounded-xl font-bold 
                shadow-xl shadow-[var(--color-primary)]/20 
                hover:scale-[1.02] active:scale-95 transition-all duration-200 text-sm"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
