import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventModal } from '../components/EventModal';

describe('EventModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const renderModal = (props = {}) => {
    return render(
      <EventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('modal opens with empty form', () => {
    renderModal();
    
    expect(screen.getByText('Yeni Etkinlik Oluştur')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Etkinlik başlığı...')).toHaveValue('');
    expect(screen.getByText('Vazgeç')).toBeInTheDocument();
    expect(screen.getByText('Oluştur')).toBeInTheDocument();
  });

  it('date is pre-filled when opened from day cell click', () => {
    const initialDate = '2024-03-15';
    renderModal({ initialDate });
    
    const dateInput = screen.getByDisplayValue(initialDate);
    expect(dateInput).toBeInTheDocument();
  });

  it('all 8 color options are visually selectable', () => {
    renderModal();
    
    const colorButtons = screen.getAllByRole('button', { name: /Renk:/i });
    expect(colorButtons).toHaveLength(8);
  });

  it('reminder dropdown has all 6 options in Turkish', () => {
    renderModal();
    
    const select = screen.getByRole('combobox');
    fireEvent.click(select);
    
    expect(screen.getByText('Yok')).toBeInTheDocument();
    expect(screen.getByText('5 dakika önce')).toBeInTheDocument();
    expect(screen.getByText('15 dakika önce')).toBeInTheDocument();
    expect(screen.getByText('30 dakika önce')).toBeInTheDocument();
    expect(screen.getByText('1 saat önce')).toBeInTheDocument();
    expect(screen.getByText('1 gün önce')).toBeInTheDocument();
  });

  it('validation prevents empty title submission', async () => {
    renderModal();
    
    const submitButton = screen.getByText('Oluştur');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Başlık zorunludur')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validation prevents end time before start time', async () => {
    renderModal();
    
    const titleInput = screen.getByPlaceholderText('Etkinlik başlığı...');
    await userEvent.type(titleInput, 'Test Etkinliği');
    
    // Set start time to 14:00
    const startTimeInput = screen.getByDisplayValue('09:00');
    fireEvent.change(startTimeInput, { target: { value: '14:00' } });
    
    // Set end time to 13:00 (before start)
    const endTimeInputs = screen.getAllByRole('textbox');
    const endTimeInput = endTimeInputs[endTimeInputs.length - 1];
    fireEvent.change(endTimeInput, { target: { value: '13:00' } });
    
    const submitButton = screen.getByText('Oluştur');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bitiş saati başlangıç saatinden sonra olmalıdır')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('successful create closes modal and calls onSubmit', async () => {
    renderModal();
    
    const titleInput = screen.getByPlaceholderText('Etkinlik başlığı...');
    await userEvent.type(titleInput, 'Toplantı');
    
    const submitButton = screen.getByText('Oluştur');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Toplantı',
        color: '#c0c1ff',
        reminder: 'none',
      }));
    });
  });

  it('cancel closes modal without saving', () => {
    renderModal();
    
    const cancelButton = screen.getByText('Vazgeç');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('close button closes modal without saving', () => {
    renderModal();
    
    const closeButton = screen.getByLabelText('Kapat');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('modal has Oluştur button (not Create)', () => {
    renderModal();
    
    const createButton = screen.getByText('Oluştur');
    expect(createButton).toBeInTheDocument();
    expect(screen.queryByText('Create')).not.toBeInTheDocument();
    expect(screen.queryByText('Kaydet')).not.toBeInTheDocument();
  });
});
