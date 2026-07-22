import React from 'react';
import { GeocodingResult } from '../types';
import { Star, MapPin } from 'lucide-react';

export const POPULAR_CITIES: GeocodingResult[] = [
  { id: 2643743, name: 'London', latitude: 51.5085, longitude: -0.1257, country: 'United Kingdom' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan' },
  { id: 5128581, name: 'New York', latitude: 40.7143, longitude: -74.006, country: 'United States' },
  { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'France' },
  { id: 2147714, name: 'Sydney', latitude: -33.8678, longitude: 151.2073, country: 'Australia' },
  { id: 1880252, name: 'Singapore', latitude: 1.2897, longitude: 103.8501, country: 'Singapore' },
  { id: 292223, name: 'Dubai', latitude: 25.2582, longitude: 55.3047, country: 'United Arab Emirates' },
];

interface FavoritesBarProps {
  currentCity: GeocodingResult;
  onSelectCity: (city: GeocodingResult) => void;
  favorites: GeocodingResult[];
  onToggleFavorite: (city: GeocodingResult) => void;
}

export const FavoritesBar: React.FC<FavoritesBarProps> = ({
  currentCity,
  onSelectCity,
  favorites,
  onToggleFavorite,
}) => {
  const isCurrentFavorite = favorites.some(
    (f) => f.name.toLowerCase() === currentCity.name.toLowerCase() && f.country === currentCity.country
  );

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Quick City Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none w-full sm:w-auto">
        <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-sky-400" /> Popular:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isActive =
            city.name.toLowerCase() === currentCity.name.toLowerCase();
          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              className={`px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>

      {/* Favorite Bookmark Button */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => onToggleFavorite(currentCity)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            isCurrentFavorite
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800/80 text-slate-300 hover:text-slate-100 border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              isCurrentFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
            }`}
          />
          <span>{isCurrentFavorite ? 'Saved to Favorites' : 'Bookmark City'}</span>
        </button>
      </div>
    </div>
  );
};
