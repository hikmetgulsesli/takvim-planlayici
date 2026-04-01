import React, { useState, useCallback } from 'react';
import type { CalendarEvent, EventFormData, ReminderType } from '../types';
import { REMINDER_OPTIONS, COLOR_OPTIONS } from '../types';

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, data: Partial<EventFormData>) => void;
  onDelete: (id: string) => void;
}

type ModalMode = 'view' | 'edit' | 'delete-confirm';

interface FormErrors {
  title?: string;
  time?: string;
}

const formatDateTurkish = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });
};

const getReminderLabel = (reminder: ReminderType): string => {
  const option = REMINDER_OPTIONS.find((opt) => opt.value === reminder);
  return option?.label ?? 'Yok';
};

export function EventDetailModal({
  event,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: EventDetailModalProps) {
  const [mode, setMode] = useState<ModalMode>('view');
  const [formData, setFormData] = useState<Partial<EventFormData>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (event && isOpen) {
      setFormData({
        title: event.title,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description ?? '',
        color: event.color,
        reminder: event.reminder,
      });
      setMode('view');
      setErrors({});
      setTouched({});
    }
  }, [event, isOpen]);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title?.trim()) {
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

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (field === 'startTime' || field === 'endTime') {
      setErrors((prev) => ({ ...prev, time: undefined }));
    }
  }, [errors]);

  const handleEditClick = useCallback(() => {
    setMode('edit');
  }, []);

  const handleDeleteClick = useCallback(() => {
    setMode('delete-confirm');
  }, []);

  const handleCancelDelete = useCallback(() => {
    setMode('view');
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (event) {
      onDelete(event.id);
      onClose();
    }
  }, [event, onDelete, onClose]);

  const handleSaveEdit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      setTouched({
        title: true,
        date: true,
        startTime: true,
        endTime: true,
        description: true,
        color: true,
        reminder: true,
      });

      if (validate() && event) {
        onEdit(event.id, formData);
        onClose();
      }
    },
    [formData, event, onEdit, onClose, validate]
  );

  const handleCancelEdit = useCallback(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description ?? '',
        color: event.color,
        reminder: event.reminder,
      });
    }
    setMode('view');
    setErrors({});
    setTouched({});
  }, [event]);

  const handleClose = useCallback(() => {
    onClose();
    setMode('view');
  }, [onClose]);

  if (!isOpen || !event) return null;

  // Delete Confirmation View
  if (mode === 'delete-confirm') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-sm">
        <div className="w-full max-w-md glass-morphism rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(192,193,255,0.12)] border border-[#464554]/15 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <button
              type="button"
              onClick={handleCancelDelete}
              className="text-[#908fa0] hover:text-[#dae2fd] transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#93000a]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[#ffb4ab]">delete_forever</span>
            </div>
            <h2 className="font-headline text-2xl font-bold tracking-tight text-[#dae2fd]">
              Etkinliği Sil
            </h2>
            <p className="text-[#c7c4d7] font-medium mt-2">
              Bu etkinliği silmek istediğinize emin misiniz?
            </p>
            <p className="text-[#908fa0] text-sm mt-1">{event.title}</p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancelDelete}
              className="flex-1 px-6 py-4 rounded-xl font-bold text-[#c0c1ff] hover:bg-white/5 transition-all text-sm cursor-pointer"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="flex-1 bg-gradient-to-br from-[#ffb4ab] to-[#93000a] text-[#ffdad6] px-6 py-4 rounded-xl font-bold shadow-xl shadow-[#ffb4ab]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer"
            >
              Evet
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode
  if (mode === 'edit') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-sm">
        <div className="w-full max-w-xl glass-morphism rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(192,193,255,0.12)] border border-[#464554]/15 p-10 relative overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="absolute top-0 right-0 p-8">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-[#908fa0] hover:text-[#dae2fd] transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <header className="mb-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-[#dae2fd]">
              Etkinliği Düzenle
            </h2>
            <p className="text-[#c7c4d7] font-medium mt-1">
              Etkinlik bilgilerini güncelleyin.
            </p>
          </header>

          <form onSubmit={handleSaveEdit} className="space-y-6">
            <div>
              <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
                BAŞLIK
              </label>
              <input
                type="text"
                value={formData.title ?? ''}
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
                    value={formData.date ?? ''}
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
                    value={formData.startTime ?? ''}
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
                    value={formData.endTime ?? ''}
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
                value={formData.description ?? ''}
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
                  value={formData.reminder ?? 'none'}
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
                onClick={handleCancelEdit}
                className="flex-1 px-6 py-4 rounded-xl font-bold text-[#c0c1ff] hover:bg-white/5 transition-all text-sm cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="flex-[2] bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0d0096] px-6 py-4 rounded-xl font-bold shadow-xl shadow-[#c0c1ff]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // View Mode (Default)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-sm">
      <div className="w-full max-w-xl glass-morphism rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(192,193,255,0.12)] border border-[#464554]/15 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <button
            type="button"
            onClick={handleClose}
            className="text-[#908fa0] hover:text-[#dae2fd] transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            <span className="text-[#908fa0] text-sm font-medium">
              Etkinlik Detayı
            </span>
          </div>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-[#dae2fd]">
            {event.title}
          </h2>
        </header>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#171f33] rounded-xl p-4">
              <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-1">
                TARİH
              </label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">calendar_month</span>
                <span className="text-[#dae2fd] font-medium">
                  {formatDateTurkish(event.date)}
                </span>
              </div>
            </div>
            <div className="bg-[#171f33] rounded-xl p-4">
              <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-1">
                SAAT ARALIĞI
              </label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">schedule</span>
                <span className="text-[#dae2fd] font-medium">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="bg-[#171f33] rounded-xl p-4">
              <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-2">
                AÇIKLAMA
              </label>
              <p className="text-[#dae2fd] leading-relaxed">{event.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#171f33] rounded-xl p-4">
              <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-1">
                RENK
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border border-[#464554]"
                  style={{ backgroundColor: event.color }}
                />
                <span className="text-[#dae2fd] font-medium text-sm">
                  {COLOR_OPTIONS.find((c) => c.value === event.color)?.name ?? 'Özel'}
                </span>
              </div>
            </div>
            <div className="bg-[#171f33] rounded-xl p-4">
              <label className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-[#908fa0] mb-1">
                HATIRLATICI
              </label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff]">notifications</span>
                <span className="text-[#dae2fd] font-medium text-sm">
                  {getReminderLabel(event.reminder)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-8 mt-8 border-t border-[#464554]/30">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-6 py-4 rounded-xl font-bold text-[#c0c1ff] hover:bg-white/5 transition-all text-sm cursor-pointer"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="px-6 py-4 rounded-xl font-bold text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all text-sm cursor-pointer"
          >
            Sil
          </button>
          <button
            type="button"
            onClick={handleEditClick}
            className="flex-[2] bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0d0096] px-6 py-4 rounded-xl font-bold shadow-xl shadow-[#c0c1ff]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer"
          >
            Düzenle
          </button>
        </div>
      </div>
    </div>
  );
}
