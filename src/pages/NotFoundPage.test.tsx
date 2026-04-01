import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage';

describe('NotFoundPage', () => {
  it('renders 404 page with Turkish message', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Aradığınız sayfa bulunamadı')).toBeInTheDocument();
  });

  it('has link back to calendar', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const calendarLink = screen.getByText('Takvime Dön');
    expect(calendarLink).toBeInTheDocument();
    expect(calendarLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('has go back button', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Geri Git')).toBeInTheDocument();
  });
});
