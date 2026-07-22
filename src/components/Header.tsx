import React from 'react';
import { TemperatureUnit } from '../types';
import { CloudSun, Sparkles, Navigation } from 'lucide-react';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onUseCurrentLocation,
  isLocating,
}) => {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand logo & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/20">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                Weather<span className="text-sky-400">Intel</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Open-Meteo Precision Weather Dashboard
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Current Location Button */}
          <button
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            title="Use current GPS location"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
          </button>

          {/* C / F Toggle Segmented Control */}
          <div className="bg-slate-800/90 p-1 rounded-lg border border-slate-700/80 flex items-center">
            <button
              onClick={() => onToggleUnit('C')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                unit === 'C'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onToggleUnit('F')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                unit === 'F'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
