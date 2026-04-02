import React, { useState, useCallback, useEffect } from 'react';
import type { EventFormData, CalendarEvent } from '../types/index';
import { showToast } from './Toast';

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

  // Reset form when modal opens - use a ref to track previous isOpen state
  const wasOpenRef = React.useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      // Modal just opened - reset form in a microtask to avoid sync setState
      Promise.resolve().then(() => {
        setFormData({
          title: initialData?.title ?? '',
          date: initialData?.date ?? getTodayString(),
          startTime: initialData?.startTime ?? '09:00',
          endTime: initialData?.endTime ?? '10:00',
          description: initialData?.description ?? '',
          color: initialData?.color ?? COLOR_OPTIONS[0]?.value ?? '#c0c1ff',
          reminder: initialData?.reminder ?? 'none',
        });
        setErrors({});
        setTouched({});
      });
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, initialData]);

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
    
    // Mark all fields as touched
    setTouched({
      title: true,
      date: true,
      startTime: true,
      endTime: true,
    });
    
    if (validate()) {
      onSubmit(formData);
      showToast(
        editingEvent ? 'Etkinlik güncellendi' : 'Etkinlik oluşturuldu',
        'success'
      );
    } else {
      showToast('Lütfen gerekli alanları doldurun', 'error');
    }
  }, [formData, validate, onSubmit, editingEvent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-surface)]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-morphism rounded-lg shadow-[0_32px_64px_rgba(128,131,255,0.12)] border border-[var(--color-outline-variant)]/20 p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors duration-200"
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
                w-full bg-[var(--color-surface-container-high)] border rounded-lg px-4 py-3
                text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50
                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200 outline-none
                ${errors.title && touched.title ? 'border-[var(--color-error)]' : 'border-transparent'}
              `}
            />
            {errors.title && touched.title && (
              <p className="mt-1 text-sm text-[var(--color-error)]">{errors.title}</p>
            )}
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
                w-full bg-[var(--color-surface-container-high)] border rounded-lg px-4 py-3
                text-[var(--color-on-surface)]
                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200 outline-none
                ${errors.date && touched.date ? 'border-[var(--color-error)]' : 'border-transparent'}
              `}
            />
            {errors.date && touched.date && (
              <p className="mt-1 text-sm text-[var(--color-error)]">{errors.date}</p>
            )}
          </div>

          {/* Time range */}
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
                  w-full bg-[var(--color-surface-container-high)] border rounded-lg px-4 py-3
                  text-[var(--color-on-surface)]
                  focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                  transition-all duration-200 outline-none
                  ${errors.startTime && touched.startTime ? 'border-[var(--color-error)]' : 'border-transparent'}
                `}
              />
              {errors.startTime && touched.startTime && (
                <p className="mt-1 text-sm text-[var(--color-error)]">{errors.startTime}</p>
              )}
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
                  w-full bg-[var(--color-surface-container-high)] border rounded-lg px-4 py-3
                  text-[var(--color-on-surface)]
                  focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                  transition-all duration-200 outline-none
                  ${errors.endTime && touched.endTime ? 'border-[var(--color-error)]' : 'border-transparent'}
                `}
              />
              {errors.endTime && touched.endTime && (
                <p className="mt-1 text-sm text-[var(--color-error)]">{errors.endTime}</p>
              )}
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
              className="
                w-full bg-[var(--color-surface-container-high)] border border-transparent rounded-lg px-4 py-3
                text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/50
                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200 outline-none resize-none
              "
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
                    w-10 h-10 rounded-lg transition-all duration-200
                    ${formData.color === color.value ? 'ring-2 ring-[var(--color-on-surface)] scale-110' : 'hover:scale-105'}
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                  aria-label={color.label}
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
              className="
                w-full bg-[var(--color-surface-container-high)] border border-transparent rounded-lg px-4 py-3
                text-[var(--color-on-surface)]
                focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
                transition-all duration-200 outline-none appearance-none
                bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23e5e1e4%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center]
              "
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
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-lg font-bold text-[var(--color-primary)] hover:bg-[var(--color-surface-container-high)] transition-all duration-200 text-sm"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-[2] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] text-[var(--color-on-primary)] px-6 py-4 rounded-lg font-bold shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 text-sm"
            >
              {editingEvent ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
