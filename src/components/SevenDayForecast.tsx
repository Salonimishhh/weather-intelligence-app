import React from 'react';
import { DailyForecastItem, TemperatureUnit } from '../types';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp, getDayName, formatDate } from '../utils/weatherHelpers';
import { WeatherIcon } from './WeatherIcon';
import { Calendar, Droplets, Sun } from 'lucide-react';

interface SevenDayForecastProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
  onSelectDay?: (day: DailyForecastItem) => void;
  selectedDate?: string;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({
  daily,
  unit,
  onSelectDay,
  selectedDate,
}) => {
  // Find global max and min across the 7 days for temperature bar normalization
  const minOfWeek = Math.min(...daily.map((d) => d.tempMin));
  const maxOfWeek = Math.max(...daily.map((d) => d.tempMax));
  const tempRange = Math.max(maxOfWeek - minOfWeek, 1);

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white">7-Day Forecast</h3>
        </div>
        <span className="text-xs text-slate-400">Daily Overview</span>
      </div>

      <div className="space-y-3">
        {daily.slice(0, 7).map((item, index) => {
          const isToday = index === 0;
          const info = getWeatherInfo(item.weatherCode);
          const isSelected = selectedDate === item.date;

          // Calculate percentage position for relative temp bar
          const leftPercent = ((item.tempMin - minOfWeek) / tempRange) * 100;
          const widthPercent = Math.max(((item.tempMax - item.tempMin) / tempRange) * 100, 8);

          return (
            <div
              key={item.date}
              onClick={() => onSelectDay?.(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-500/50 shadow-md ring-1 ring-sky-500/30'
                  : isToday
                  ? 'bg-slate-800/80 hover:bg-slate-800 border-sky-500/30'
                  : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-800/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Day name & Date */}
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="w-10 text-center font-bold text-sm text-slate-100">
                    {getDayName(item.date, isToday)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDate(item.date, { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* Weather Condition Icon & Label */}
                <div className="flex items-center gap-2.5 min-w-[180px]">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 text-sky-400 shrink-0">
                    <WeatherIcon name={info.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{info.label}</div>
                    {item.precipitationProbabilityMax > 20 && (
                      <div className="text-[11px] text-blue-400 font-medium flex items-center gap-1">
                        <Droplets className="w-3 h-3" /> {item.precipitationProbabilityMax}% rain
                      </div>
                    )}
                  </div>
                </div>

                {/* Temperature Range & Bar */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xs justify-end">
                  <span className="text-xs font-semibold text-slate-400 w-10 text-right">
                    {formatTemp(item.tempMin, unit)}
                  </span>

                  {/* Relative temperature progress bar */}
                  <div className="hidden sm:block flex-1 h-2 rounded-full bg-slate-800 relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400"
                      style={{
                        left: `${Math.max(0, Math.min(leftPercent, 90))}%`,
                        width: `${Math.min(widthPercent, 100)}%`,
                      }}
                    />
                  </div>

                  <span className="text-sm font-bold text-slate-100 w-10 text-left">
                    {formatTemp(item.tempMax, unit)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
