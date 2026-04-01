
import type { CalendarEvent } from '../types';

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  '#c0c1ff': { bg: 'bg-[#c0c1ff]/10', border: 'border-[#c0c1ff]', text: 'text-[#c0c1ff]' },
  '#ffb783': { bg: 'bg-[#ffb783]/10', border: 'border-[#ffb783]', text: 'text-[#ffb783]' },
  '#ffb4ab': { bg: 'bg-[#ffb4ab]/10', border: 'border-[#ffb4ab]', text: 'text-[#ffb4ab]' },
  '#8083ff': { bg: 'bg-[#8083ff]/10', border: 'border-[#8083ff]', text: 'text-[#8083ff]' },
  '#31394d': { bg: 'bg-[#31394d]/50', border: 'border-[#31394d]', text: 'text-[#dae2fd]' },
  '#d97721': { bg: 'bg-[#d97721]/10', border: 'border-[#d97721]', text: 'text-[#ffb783]' },
  '#10b981': { bg: 'bg-emerald-400/10', border: 'border-emerald-400', text: 'text-emerald-400' },
  '#14b8a6': { bg: 'bg-teal-300/10', border: 'border-teal-300', text: 'text-teal-300' },
};

const getColorClasses = (color: string): { bg: string; border: string; text: string } => {
  return COLOR_MAP[color] ?? { bg: 'bg-[#c0c1ff]/10', border: 'border-[#c0c1ff]', text: 'text-[#c0c1ff]' };
};

const formatTurkishDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const dayOfWeek = days[date.getDay()];
  
  return `${day} ${month} ${year}, ${dayOfWeek}`;
};

export function EventDetailModal({ event, isOpen, onClose, onEdit, onDelete }: EventModalProps) {
  if (!isOpen || !event) return null;

  const colorClasses = getColorClasses(event.color);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060e20]/80 backdrop-blur-sm">
      <div className="w-full max-w-lg glass-morphism rounded-[2rem] shadow-[0_32px_64px_rgba(128,131,255,0.12)] border border-[#464554]/15 p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#908fa0] hover:text-[#dae2fd] transition-colors"
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header */}
        <div className={`${colorClasses.bg} border-l-4 ${colorClasses.border} ${colorClasses.text} rounded-lg p-4 mb-6`}>
          <h2 className="font-headline text-xl font-bold">{event.title}</h2>
          <p className="text-sm opacity-80 mt-1">
            {formatTurkishDate(event.date)} · {event.startTime} - {event.endTime}
          </p>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-[0.05em] text-[#908fa0] mb-2">Açıklama</h3>
            <p className="text-[#dae2fd] text-sm leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Reminder */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-[0.05em] text-[#908fa0] mb-2">Hatırlatıcı</h3>
          <div className="flex items-center gap-2 text-[#dae2fd] text-sm">
            <span className="material-symbols-outlined text-[#c0c1ff]">notifications</span>
            {event.reminder === 'none' ? 'Hatırlatıcı yok' : event.reminder}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-[#464554]/30">
          <button
            onClick={() => onDelete(event.id)}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-[#ffb4ab] hover:bg-[#ffb4ab]/10 transition-all text-sm"
          >
            Sil
          </button>
          <button
            onClick={() => onEdit(event)}
            className="flex-[2] bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#0d0096] px-4 py-3 rounded-xl font-bold shadow-lg shadow-[#8083ff]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
          >
            Düzenle
          </button>
        </div>
      </div>
    </div>
  );
}
