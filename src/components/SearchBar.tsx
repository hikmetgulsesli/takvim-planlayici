import { useState, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Etkinlik ara...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
        search
      </span>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="w-full bg-surface-container-highest border-none rounded-xl pl-12 pr-10 py-3 text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary transition-all"
        placeholder={placeholder}
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-1 rounded-lg hover:bg-white/5"
          aria-label="Aramayı temizle"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      )}
    </div>
  );
}
