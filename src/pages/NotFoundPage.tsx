import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Abstract Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-20">
          <img
            alt="abstract space"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMEG_hUOv2LxJ-JzHsvdcgQz5lWTLLEDMr-lhgrYsa5wzoJYiQgeOaZuVfOoRueeOFCeVM97Xd0JGxRiPY0UhpcsdHfD2Gco9QeAbIFL6FZBiu1tXnQqC4j8zy0ol-0dKnB2qILz2o4sIOLXyeXi1et87dnt1des5eLCHfjXl2lU0TFE72oNjb2AHtvp5KbID-v9UZlfi7ThMTcN3XsTtAHDodalYr9L6i7hTjuYte1Iq_R4THsfZ33KIHp424-lgxA_yb9-rvCABN"
          />
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[128px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 blur-[128px] rounded-full"></div>
      </div>

      {/* 404 Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <div className="mb-12">
          <h1 className="font-headline font-extrabold text-2xl text-primary tracking-tighter">Chronos Editorial</h1>
        </div>

        <div className="relative">
          <span className="font-headline font-extrabold text-[12rem] md:text-[18rem] leading-none text-surface-bright/20 select-none tracking-tighter">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card p-12 rounded-[2rem] shadow-[0_32px_64px_rgba(99,102,241,0.12)] border border-outline-variant/15">
              <h2 className="font-headline font-bold text-3xl md:text-4xl text-on-surface mb-4">Aradığınız sayfa bulunamadı</h2>
              <p className="font-body text-on-surface-variant text-lg max-w-md mx-auto leading-relaxed">
                Zaman çizelgesinde bir sapma yaşandı. İstediğiniz sayfa arşivlerde yok veya taşınmış olabilir.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-16 flex flex-col sm:flex-row gap-6 items-center">
          <Link
            to="/"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-br from-primary to-primary-container px-10 py-4 rounded-xl text-on-primary-fixed-variant font-bold text-base shadow-[0_8px_24px_rgba(128,131,255,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">calendar_today</span>
            Takvime Dön
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-primary font-semibold hover:text-on-primary-container transition-colors group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Geri Git
          </button>
        </div>
      </div>

      {/* Decorative Info Cards */}
      <div className="absolute bottom-12 left-12 hidden lg:block">
        <div className="flex flex-col gap-1 border-l-2 border-primary/30 pl-4">
          <span className="font-label text-primary uppercase text-[10px] tracking-widest">Durum Kodu</span>
          <span className="font-headline font-bold text-on-surface">ERROR_NOT_FOUND_04</span>
        </div>
      </div>
      <div className="absolute bottom-12 right-12 hidden lg:block">
        <div className="flex flex-col gap-1 items-end border-r-2 border-tertiary/30 pr-4 text-right">
          <span className="font-label text-tertiary uppercase text-[10px] tracking-widest">Yerel Zaman</span>
          <span className="font-headline font-bold text-on-surface">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} GMT+3</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-8 w-full text-center px-4 md:px-0">
        <p className="font-label text-[10px] text-outline tracking-[0.2em] uppercase">© 2024 The Curator — Premium Editorial Calendar Experience</p>
      </footer>
    </main>
  );
}
