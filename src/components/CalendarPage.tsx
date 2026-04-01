import { useState, useCallback, useEffect, useRef } from 'react'
import { useEventContext } from '../contexts/EventContext'
import { WeeklyView } from './WeeklyView'
import type { Event } from '../types'

interface EventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onSave: (event: Event) => void
  onDelete?: (id: string) => void
  initialDate?: string
  initialTime?: string
}

const COLORS = [
  '#c0c1ff', '#ffb783', '#ffb4ab', '#8083ff',
  '#31394d', '#d97721', '#34d399', '#5eead4',
]

function localDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getInitialDate(initialDate?: string): string {
  if (initialDate) return initialDate
  return localDateString(new Date())
}

function getInitialEndTime(initialTime?: string): string {
  if (!initialTime) return '10:00'
  const [h] = initialTime.split(':').map(Number)
  const nextH = String(((h ?? 9) + 1) % 24).padStart(2, '0')
  return `${nextH}:00`
}

interface FormData {
  title: string
  date: string
  startTime: string
  endTime: string
  description: string
  color: string
  reminder: string
}

function buildFormData(event: Event | null, initialDate?: string, initialTime?: string): FormData {
  if (event) {
    return {
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      description: (event.description as string | undefined) ?? '',
      color: event.color,
      reminder: (event.reminder as string | undefined) ?? '15 dakika önce',
    }
  }
  return {
    title: '',
    date: getInitialDate(initialDate),
    startTime: initialTime ?? '09:00',
    endTime: getInitialEndTime(initialTime),
    description: '',
    color: COLORS[0] ?? '#c0c1ff',
    reminder: '15 dakika önce',
  }
}

function EventModal({ event, isOpen, onClose, onSave, onDelete, initialDate, initialTime }: EventModalProps) {
  const [formData, setFormData] = useState<FormData>(buildFormData(event, initialDate, initialTime))
  const [timeError, setTimeError] = useState<string>('')

  // Sync formData when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setFormData(buildFormData(event, initialDate, initialTime))
      setTimeError('')
    }
  }, [isOpen, event, initialDate, initialTime])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    if (!formData.date || !formData.startTime || !formData.endTime) return
    if (formData.endTime <= formData.startTime) {
      setTimeError('Bitiş saati başlangıç saatinden sonra olmalıdır')
      return
    }
    onSave({
      id: event?.id ?? crypto.randomUUID(),
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description || undefined,
      color: formData.color,
      reminder: formData.reminder
    })
    onClose()
  }

  if (!isOpen) return null

  const isEditing = !!event

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-dim/80 backdrop-blur-sm">
      <div className="w-full max-w-xl glass-morphism rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(192,193,255,0.12)] border border-outline-variant/15 p-10 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-outline hover:text-on-surface transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <header className="mb-8">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
            {isEditing ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Oluştur'}
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">
            {isEditing ? 'Etkinlik detaylarını güncelleyin.' : 'Takviminize yeni bir editoryal an ekleyin.'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="event-title" className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-outline mb-2">
              BAŞLIK
            </label>
            <input
              id="event-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary transition-all"
              placeholder="Etkinlik başlığı..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="event-date" className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-outline mb-2">
                TARİH
              </label>
              <div className="relative">
                <input
                  id="event-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary appearance-none"
                  required
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                  calendar_month
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="event-start" className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-outline mb-2">
                  BAŞLANGIÇ
                </label>
                <input
                  id="event-start"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => {
                    setFormData({ ...formData, startTime: e.target.value })
                    setTimeError('')
                  }}
                  className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="event-end" className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-outline mb-2">
                  BİTİŞ
                </label>
                <input
                  id="event-end"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => {
                    setFormData({ ...formData, endTime: e.target.value })
                    setTimeError('')
                  }}
                  className={`w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary ${timeError ? 'ring-2 ring-error' : ''}`}
                  required
                />
              </div>
            </div>
          </div>

          {timeError && (
            <p className="text-sm text-error -mt-4" role="alert">{timeError}</p>
          )}

          <div>
            <span className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-outline mb-3">
              RENK PALETİ
            </span>
            <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Renk seçin">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={formData.color === color}
                  aria-label={`Renk: ${color}`}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                    formData.color === color
                      ? 'ring-2 ring-offset-4 ring-offset-surface-container-high ring-primary scale-110'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="event-desc" className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-outline mb-2">
              AÇIKLAMA
            </label>
            <textarea
              id="event-desc"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary transition-all resize-none"
              placeholder="Detaylar buraya..."
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="event-reminder" className="block font-label text-[0.6875rem] uppercase tracking-[0.05em] text-outline mb-2">
              HATIRLATICI TİPİ
            </label>
            <div className="relative">
              <select
                id="event-reminder"
                value={formData.reminder}
                onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary appearance-none pr-10"
              >
                <option>15 dakika önce</option>
                <option>30 dakika önce</option>
                <option>1 saat önce</option>
                <option>1 gün önce</option>
                <option>Özel...</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                notifications
              </span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {isEditing && onDelete && event && (
              <button
                type="button"
                onClick={() => {
                  onDelete(event.id)
                  onClose()
                }}
                className="px-6 py-4 rounded-xl font-bold text-error hover:bg-error/10 transition-all text-sm cursor-pointer"
              >
                Sil
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl font-bold text-primary hover:bg-white/5 transition-all text-sm cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-[2] bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-4 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer"
            >
              {isEditing ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface EventDetailModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

function formatDateTurkish(dateStr: string): string {
  // Parse YYYY-MM-DD in local timezone
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y!, m! - 1, d!)
  return date.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function EventDetailModal({ event, isOpen, onClose, onEdit }: EventDetailModalProps) {
  if (!isOpen || !event) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-dim/80 backdrop-blur-sm">
      <div className="w-full max-w-md glass-morphism rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(192,193,255,0.12)] border border-outline-variant/15 p-8 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-outline hover:text-on-surface transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div
          className="w-16 h-1 rounded-full mb-6"
          style={{ backgroundColor: event.color }}
        />

        <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-2">
          {event.title}
        </h2>

        <div className="space-y-3 mt-6">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>{formatDateTurkish(event.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined">schedule</span>
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          {event.description && (
            <div className="flex items-start gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined mt-0.5">description</span>
              <span>{event.description}</span>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-primary hover:bg-white/5 transition-all text-sm cursor-pointer"
          >
            Kapat
          </button>
          <button
            onClick={onEdit}
            className="flex-[2] bg-gradient-to-br from-primary to-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer"
          >
            Düzenle
          </button>
        </div>
      </div>
    </div>
  )
}

export function CalendarPage() {
  const { addEvent, updateEvent, deleteEvent } = useEventContext()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [initialDate, setInitialDate] = useState<string>('')
  const [initialTime, setInitialTime] = useState<string>('')

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event)
    setIsDetailModalOpen(true)
  }, [])

  const handleTimeSlotClick = useCallback((date: string, time: string) => {
    setInitialDate(date)
    setInitialTime(time)
    setSelectedEvent(null)
    setIsCreateModalOpen(true)
  }, [])

  const handleEdit = useCallback(() => {
    setIsDetailModalOpen(false)
    setIsEditModalOpen(true)
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-surface-container-low border-b border-outline-variant/15">
        <div className="text-xl font-bold text-primary tracking-tighter font-headline">
          Chronos Editorial
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#" className="font-headline font-bold text-sm tracking-tight text-slate-400 font-medium hover:text-slate-200 transition-all duration-300">
            Ay
          </a>
          <a href="#" className="font-headline font-bold text-sm tracking-tight text-primary border-b-2 border-primary pb-1">
            Hafta
          </a>
          <a href="#" className="font-headline font-bold text-sm tracking-tight text-slate-400 font-medium hover:text-slate-200 transition-all duration-300">
            Gün
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-primary hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer" aria-label="Ayarlar">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-40 bg-surface-container-low w-72 pt-28 border-r border-outline-variant/15">
        <div className="mb-8 px-4">
          <h2 className="text-lg font-black text-primary font-headline">The Curator</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Premium Plan</p>
        </div>
        <button
          onClick={() => {
            setInitialDate('')
            setInitialTime('')
            setSelectedEvent(null)
            setIsCreateModalOpen(true)
          }}
          className="mb-8 mx-2 bg-gradient-to-br from-primary to-primary-container text-on-primary-container py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined">add</span>
          Yeni Etkinlik
        </button>
        <nav className="flex-1 space-y-2">
          <div className="flex items-center gap-3 bg-primary/10 text-primary rounded-xl px-4 py-3 font-semibold text-sm cursor-pointer">
            <span className="material-symbols-outlined">calendar_today</span>
            Takvimlerim
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm cursor-pointer">
            <span className="material-symbols-outlined">group</span>
            Paylaşılanlar
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm cursor-pointer">
            <span className="material-symbols-outlined">check_circle</span>
            Görevler
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm cursor-pointer">
            <span className="material-symbols-outlined">archive</span>
            Arşiv
          </div>
        </nav>
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm cursor-pointer">
            <span className="material-symbols-outlined">help</span>
            Yardım
          </div>
          <div className="flex items-center gap-3 text-slate-400 px-4 py-3 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors text-sm cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            Çıkış
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 pt-28 px-8 pb-8 min-h-screen">
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface">Haftalık Görünüm</h1>
          <p className="text-primary font-medium mt-2">
            {new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="h-[calc(100vh-220px)]">
          <WeeklyView
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        </div>
      </main>

      {/* Modals */}
      {isCreateModalOpen && (
        <EventModal
          key={`create-${initialDate}-${initialTime}`}
          event={null}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={addEvent}
          initialDate={initialDate || undefined}
          initialTime={initialTime || undefined}
        />
      )}

      {isDetailModalOpen && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={handleEdit}
        />
      )}

      {isEditModalOpen && selectedEvent && (
        <EventModal
          key={`edit-${selectedEvent.id}`}
          event={selectedEvent}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={updateEvent}
          onDelete={deleteEvent}
        />
      )}
    </div>
  )
}
