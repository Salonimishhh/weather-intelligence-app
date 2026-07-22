import React, { useState, useEffect, useRef } from 'react';
import { GeocodingResult } from '../types';
import { searchCities } from '../services/openMeteoApi';
import { Search, MapPin, X, Loader2, AlertCircle } from 'lucide-react';

interface SearchBarProps {
  onSelectCity: (city: GeocodingResult) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const cities = await searchCities(query);
        setResults(cities);
        if (cities.length === 0) {
          setSearchError(`No cities found matching "${query}"`);
        } else {
          setSearchError(null);
        }
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
        setSearchError('Unable to fetch city suggestions. Check network connection.');
        setResults([]);
        setIsOpen(true);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeocodingResult) => {
    onSelectCity(city);
    setQuery(`${city.name}${city.country ? `, ${city.country}` : ''}`);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSearchError(null);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input Container */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-400 transition-colors">
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0 || searchError) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search any city worldwide (e.g. London, Tokyo, Paris, Sydney)..."
          className="w-full pl-11 pr-10 py-3.5 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 text-slate-100 placeholder-slate-400 rounded-2xl border border-slate-700/80 focus:border-sky-500/80 focus:ring-4 focus:ring-sky-500/10 text-sm sm:text-base font-medium shadow-xl shadow-slate-950/20 transition-all outline-none"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4 bg-slate-700 hover:bg-slate-600 rounded-full p-0.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-150">
          {searchError ? (
            <div className="px-4 py-3.5 flex items-center gap-2.5 text-xs sm:text-sm text-amber-400/90">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{searchError}</span>
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              const locationSubtext = [item.admin1, item.country].filter(Boolean).join(', ');

              return (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-200 border-l-4 border-sky-400'
                      : 'hover:bg-slate-700/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-700/50 text-sky-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-slate-100">
                        {item.name}
                      </div>
                      {locationSubtext && (
                        <div className="text-xs text-slate-400 font-normal">
                          {locationSubtext}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.latitude && item.longitude && (
                    <span className="text-[10px] tracking-wider text-slate-500 font-mono hidden sm:inline">
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
