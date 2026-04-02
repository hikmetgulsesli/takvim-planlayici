import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SettingsPage } from '../pages/SettingsPage';

// Mock hooks
vi.mock('../hooks', () => ({
  useNotifications: () => ({
    permission: 'default',
    requestPermission: vi.fn().mockResolvedValue(true),
  }),
  useEvents: () => ({
    exportEvents: vi.fn().mockReturnValue('[]'),
    importEvents: vi.fn().mockReturnValue(2),
  }),
  showToast: vi.fn(),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders settings page with correct heading', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Ayarlar')).toBeInTheDocument();
  });

  it('displays notification permission status', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Bildirim Tercihleri')).toBeInTheDocument();
    expect(screen.getByText('Bildirim Durumu')).toBeInTheDocument();
  });

  it('displays data management section', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Veri Yönetimi')).toBeInTheDocument();
    expect(screen.getByText('Verileri Dışa Aktar')).toBeInTheDocument();
    expect(screen.getByText('Verileri İçe Aktar')).toBeInTheDocument();
  });

  it('displays app version info', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Uygulama Bilgisi')).toBeInTheDocument();
    expect(screen.getByText('Versiyon')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
  });

  it('has export button', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    const exportButton = screen.getByText('Dışa Aktar');
    expect(exportButton).toBeInTheDocument();
  });

  it('has import button', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    const importButton = screen.getByText('İçe Aktar');
    expect(importButton).toBeInTheDocument();
  });
});
