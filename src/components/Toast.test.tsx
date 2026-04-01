import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastContainer, showToast, setToastHandler } from '../components/Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('ToastContainer', () => {
    it('renders without toasts initially', () => {
      render(<ToastContainer />);
      expect(screen.queryByRole('button', { name: /Kapat/i })).not.toBeInTheDocument();
    });

    it('displays toast when showToast is called', () => {
      render(<ToastContainer />);
      showToast('Test mesajı', 'info');
      expect(screen.getByText('Test mesajı')).toBeInTheDocument();
    });

    it('displays success toast with correct styling', () => {
      render(<ToastContainer />);
      showToast('Etkinlik oluşturuldu', 'success');
      const toast = screen.getByText('Etkinlik oluşturuldu');
      expect(toast).toBeInTheDocument();
    });

    it('displays error toast with correct styling', () => {
      render(<ToastContainer />);
      showToast('Bir hata oluştu', 'error');
      const toast = screen.getByText('Bir hata oluştu');
      expect(toast).toBeInTheDocument();
    });

    it('auto-dismisses toast after 3 seconds', async () => {
      render(<ToastContainer />);
      showToast('Otomatik kapanacak', 'info');
      
      expect(screen.getByText('Otomatik kapanacak')).toBeInTheDocument();
      
      vi.advanceTimersByTime(3000);
      
      await waitFor(() => {
        expect(screen.queryByText('Otomatik kapanacak')).not.toBeInTheDocument();
      });
    });

    it('closes toast when close button is clicked', () => {
      render(<ToastContainer />);
      showToast('Manuel kapatma', 'info');
      
      const closeButton = screen.getByLabelText('Kapat');
      fireEvent.click(closeButton);
      
      expect(screen.queryByText('Manuel kapatma')).not.toBeInTheDocument();
    });

    it('displays multiple toasts', () => {
      render(<ToastContainer />);
      showToast('Birinci toast', 'info');
      showToast('İkinci toast', 'success');
      
      expect(screen.getByText('Birinci toast')).toBeInTheDocument();
      expect(screen.getByText('İkinci toast')).toBeInTheDocument();
    });
  });

  describe('Turkish Labels', () => {
    it('displays Turkish close button label', () => {
      render(<ToastContainer />);
      showToast('Test', 'info');
      expect(screen.getByLabelText('Kapat')).toBeInTheDocument();
    });
  });
});
