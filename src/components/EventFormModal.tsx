import React, { useState, useCallback } from 'react';
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
    setTouched({
      title: true,
      date: true,
      startTime: true,
      endTime: true,
    });
    
    if (validate()) {
      onSubmit(formData);
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
  }, [onClose, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060e20]/80 backdrop-blur-sm">
      <div className="w-full max-w-xl glass-morphism rounded-[2rem] shadow-[0_32px_64px_rgba(128,131,255,0.12)] border border-[#464554]/15 p-10 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="absolute top-6 right-6">
          <button
            onClick={handleCancel}
            className="text-[#908fa0] hover:text-[#dae2fd] transition-colors"
            aria-label="Kapat"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-[#dae2fd]">
            {editingEvent ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Oluştur'}
          </h2>
          <p className="text-[#c7c4d7] font-medium mt-1">
            Takviminize yeni bir editoryal an ekleyin.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
              Başlık
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              placeholder="Etkinlik başlığı..."
              className="w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] placeholder:text-[#908fa0]/50 focus:ring-2 focus:ring-[#c0c1ff] transition-all"
            />
            {errors.title && touched.title && (
              <p className="text-[#ffb4ab] text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
                Tarih
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  onBlur={() => handleBlur('date')}
                  className="w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] focus:ring-2 focus:ring-[#c0c1ff] appearance-none"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#908fa0] pointer-events-none">
                  calendar_month
                </span>
              </div>
              {errors.date && touched.date && (
                <p className="text-[#ffb4ab] text-xs mt-1">{errors.date}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
                  Başlangıç
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  onBlur={() => handleBlur('startTime')}
                  className="w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] focus:ring-2 focus:ring-[#c0c1ff]"
                />
                {errors.startTime && touched.startTime && (
                  <p className="text-[#ffb4ab] text-xs mt-1">{errors.startTime}</p>
                )}
              </div>
              <div>
                <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
                  Bitiş
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  onBlur={() => handleBlur('endTime')}
                  className="w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] focus:ring-2 focus:ring-[#c0c1ff]"
                />
                {errors.endTime && touched.endTime && (
                  <p className="text-[#ffb4ab] text-xs mt-1">{errors.endTime}</p>
                )}
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-3">
              Renk Paleti
            </label>
            <div className="flex flex-wrap gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleChange('color', color.value)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    formData.color === color.value
                      ? 'ring-2 ring-offset-4 ring-offset-[#222a3d] ring-[#c0c1ff] scale-110'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.label}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detaylar buraya..."
              rows={3}
              className="w-full bg-[#2d3449] border-none rounded-xl px-4 py-3 text-[#dae2fd] placeholder:text-[#908fa0]/50 focus:ring-2 focus:ring-[#c0c1ff] transition-all resize-none"
            />
          </div>

          {/* Reminder */}
          <div>
            <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
              Hatırlatıcı Tipi
            </label>
            <div className="relative">
              <select
                value={formData.reminder}
                onChange={(e) => handleChange('reminder', e.target.value)}
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

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-4 rounded-xl font-bold text-[#c0c1ff] hover:bg-white/5 transition-all text-sm"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-[2] bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0d0096] px-6 py-4 rounded-xl font-bold shadow-xl shadow-[#8083ff]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
              {editingEvent ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
