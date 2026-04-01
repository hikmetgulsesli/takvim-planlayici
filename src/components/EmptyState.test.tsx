import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmptyState } from '../components/EmptyState';

describe('EmptyState', () => {
  const defaultProps = {
    icon: 'calendar_today',
    title: 'Henüz Etkinlik Yok',
    message: 'Henüz etkinlik eklemediniz. Yeni etkinlik eklemek için + butonuna tıklayın.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the icon', () => {
      render(<EmptyState {...defaultProps} />);
      expect(screen.getByText('calendar_today')).toBeInTheDocument();
    });

    it('renders the title', () => {
      render(<EmptyState {...defaultProps} />);
      expect(screen.getByText('Henüz Etkinlik Yok')).toBeInTheDocument();
    });

    it('renders the message', () => {
      render(<EmptyState {...defaultProps} />);
      expect(screen.getByText('Henüz etkinlik eklemediniz. Yeni etkinlik eklemek için + butonuna tıklayın.')).toBeInTheDocument();
    });

    it('renders Turkish text correctly', () => {
      render(<EmptyState {...defaultProps} />);
      const message = screen.getByText(/Henüz etkinlik eklemediniz/);
      expect(message).toBeInTheDocument();
    });
  });

  describe('Action Button', () => {
    it('does not render action button when action prop is not provided', () => {
      render(<EmptyState {...defaultProps} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders action button when action prop is provided', () => {
      const actionProps = {
        ...defaultProps,
        action: {
          label: 'Etkinlik Ekle',
          onClick: vi.fn(),
        },
      };
      render(<EmptyState {...actionProps} />);
      expect(screen.getByRole('button')).toHaveTextContent('Etkinlik Ekle');
    });

    it('calls onClick when action button is clicked', () => {
      const mockClick = vi.fn();
      const actionProps = {
        ...defaultProps,
        action: {
          label: 'Etkinlik Ekle',
          onClick: mockClick,
        },
      };
      render(<EmptyState {...actionProps} />);
      fireEvent.click(screen.getByRole('button'));
      expect(mockClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Animation', () => {
    it('has fade-in animation class', () => {
      render(<EmptyState {...defaultProps} />);
      const container = screen.getByText(defaultProps.title).closest('div')?.parentElement;
      expect(container).toHaveClass('animate-fade-in');
    });
  });
});
