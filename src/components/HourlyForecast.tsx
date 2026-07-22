import React from 'react';
import { TemperatureUnit, WeatherData } from '../types';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp, formatTime } from '../utils/weatherHelpers';
import { WeatherIcon } from './WeatherIcon';
import { Clock, Umbrella } from 'lucide-react';

interface HourlyForecastProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, unit }) => {
  const { hourly, timezone } = data;

  // Extract next 24 hours starting from current hour
  const nowIso = data.current.time;
  let startIndex = hourly.time.findIndex((t) => t >= nowIso.slice(0, 13));
  if (startIndex === -1) startIndex = 0;

  const next24Hours = hourly.time.slice(startIndex, startIndex + 24).map((time, idx) => {
    const i = startIndex + idx;
    return {
      time,
      temp: hourly.temperature[i],
      pop: hourly.precipitationProbability[i] ?? 0,
      code: hourly.weatherCode[i] ?? 0,
    };
  });

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white">24-Hour Forecast</h3>
        </div>
        <span className="text-xs text-slate-400">Hourly Outlook</span>
      </div>

      {/* Horizontal Scroll List */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {next24Hours.map((item, index) => {
          const info = getWeatherInfo(item.code);
          const isNow = index === 0;

          return (
            <div
              key={item.time}
              className={`flex flex-col items-center justify-between p-3.5 rounded-2xl border min-w-[90px] shrink-0 transition-all ${
                isNow
                  ? 'bg-sky-500/20 border-sky-500/40 text-white shadow-lg shadow-sky-500/10'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-200'
              }`}
            >
              <span className="text-xs font-medium text-slate-300">
                {isNow ? 'Now' : formatTime(item.time, timezone)}
              </span>

              <div className="my-2.5">
                <WeatherIcon
                  name={info.iconName}
                  className={`w-7 h-7 ${isNow ? 'text-sky-300 animate-pulse' : 'text-slate-300'}`}
                />
              </div>

              <span className="text-base font-bold tracking-tight">
                {formatTemp(item.temp, unit)}
              </span>

              {item.pop > 10 ? (
                <div className="mt-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-300 flex items-center gap-0.5">
                  💧 {item.pop}%
                </div>
              ) : (
                <div className="mt-1.5 h-4 text-[10px] text-slate-500 font-mono">0%</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
