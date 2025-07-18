"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import SearchIcon from '@/components/Icons/SearchIcon';

export default function VideoSearcher() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (pathname.startsWith('/search')) {
      router.replace(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full flex gap-1 md:gap-2 items-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
        className="flex-1 border border-theme bg-surface-secondary text-primary px-3 h-8 md:h-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-tertiary text-sm md:text-base"
        aria-label="Buscar videos o canales"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 h-8 md:h-10 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex items-center justify-center"
      >
        <SearchIcon />
      </button>
    </form>
  );
}
