import React from 'react';
import { TemperatureUnit, WeatherData } from '../types';
import { getWeatherInfo } from '../utils/weatherCodes';
import {
  formatTemp,
  formatWindSpeed,
  formatDate,
  formatTime,
  getWindDirectionCardinal,
} from '../utils/weatherHelpers';
import { WeatherIcon } from './WeatherIcon';
import {
  Wind,
  Droplets,
  Gauge,
  Sun,
  Thermometer,
  Calendar,
  Clock,
  Compass,
  MapPin,
  Sunrise,
  Sunset,
  CloudRain,
} from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  const { city, current, daily, timezone } = data;
  const weatherInfo = getWeatherInfo(current.weatherCode);
  const todayDaily = daily[0];

  const locationLabel = [city.name, city.admin1, city.country].filter(Boolean).join(', ');

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Dynamic Background Glow Effect based on weather condition theme */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${weatherInfo.themeClass} pointer-events-none`}
      />

      {/* Main Top Header: Location, Date & Time */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-medium text-sm mb-1">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{locationLabel}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {city.name}
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{formatDate(current.time, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{formatTime(current.time, timezone)}</span>
          </div>
        </div>
      </div>

      {/* Central Temperature & Condition Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
        {/* Left: Temperature & Weather Icon Display */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-xl flex items-center justify-center shrink-0">
            <WeatherIcon
              name={weatherInfo.iconName}
              className={`w-16 h-16 sm:w-20 sm:h-20 ${
                current.isDay ? 'text-amber-400' : 'text-sky-300'
              }`}
            />
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl sm:text-7xl font-extrabold text-white tracking-tighter">
                {formatTemp(current.temperature, unit, false)}
              </span>
              <span className="text-3xl sm:text-4xl font-light text-slate-400">
                °{unit}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                {weatherInfo.label}
              </span>
              {todayDaily && (
                <span className="text-xs text-slate-400">
                  H: <strong className="text-slate-200">{formatTemp(todayDaily.tempMax, unit)}</strong> L:{' '}
                  <strong className="text-slate-200">{formatTemp(todayDaily.tempMin, unit)}</strong>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-2 max-w-sm">
              {weatherInfo.description}
            </p>
          </div>
        </div>

        {/* Right Quick Summary Callouts */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Feels Like</div>
              <div className="text-base font-bold text-slate-100">
                {formatTemp(current.apparentTemperature, unit)}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Humidity</div>
              <div className="text-base font-bold text-slate-100">{current.humidity}%</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Wind Speed</div>
              <div className="text-base font-bold text-slate-100">
                {formatWindSpeed(current.windSpeed, unit)}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Pressure</div>
              <div className="text-base font-bold text-slate-100">{Math.round(current.pressure)} hPa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Extended Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Wind Direction</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">
            {current.windDirection}° ({getWindDirectionCardinal(current.windDirection)})
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>UV Index</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">
            {todayDaily?.uvIndexMax ? `${todayDaily.uvIndexMax.toFixed(1)} Max` : 'Low'}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            <span>Precipitation</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">
            {todayDaily?.precipitationSum !== undefined
              ? `${todayDaily.precipitationSum.toFixed(1)} mm`
              : `${current.precipitation} mm`}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cloud Cover</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">{current.cloudCover}%</div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Sunrise className="w-3.5 h-3.5 text-amber-400" />
            <span>Sunrise</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">
            {todayDaily?.sunrise ? formatTime(todayDaily.sunrise, timezone) : '--'}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Sunset className="w-3.5 h-3.5 text-orange-400" />
            <span>Sunset</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">
            {todayDaily?.sunset ? formatTime(todayDaily.sunset, timezone) : '--'}
          </div>
        </div>
      </div>
    </div>
  );
};
