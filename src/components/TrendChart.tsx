import React, { useState } from 'react';
import { DailyForecastItem, TemperatureUnit } from '../types';
import { convertTemp, getDayName } from '../utils/weatherHelpers';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, Thermometer, CloudRain, Sun } from 'lucide-react';

interface TrendChartProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
}

type MetricTab = 'temperature' | 'precipitation' | 'uv';

export const TrendChart: React.FC<TrendChartProps> = ({ daily, unit }) => {
  const [activeTab, setActiveTab] = useState<MetricTab>('temperature');

  // Format data for Recharts
  const chartData = daily.slice(0, 7).map((item, idx) => {
    return {
      day: getDayName(item.date, idx === 0),
      rawDate: item.date,
      tempMax: convertTemp(item.tempMax, unit),
      tempMin: convertTemp(item.tempMin, unit),
      precipProb: item.precipitationProbabilityMax,
      precipSum: item.precipitationSum,
      uvIndex: item.uvIndexMax,
    };
  });

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white">7-Day Weather Trend</h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'temperature'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" /> Temperature
          </button>
          <button
            onClick={() => setActiveTab('precipitation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'precipitation'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Rain
          </button>
          <button
            onClick={() => setActiveTab('uv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'uv'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> UV Index
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temperature' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMaxTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorMinTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit={`°${unit}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                }}
                formatter={(value: any, name: any) => [
                  `${value}°${unit}`,
                  name === 'tempMax' ? 'Max Temperature' : 'Min Temperature',
                ]}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
              <Area
                type="monotone"
                dataKey="tempMax"
                name="Max Temp"
                stroke="#38bdf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorMaxTemp)"
              />
              <Area
                type="monotone"
                dataKey="tempMin"
                name="Min Temp"
                stroke="#818cf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorMinTemp)"
              />
            </AreaChart>
          ) : activeTab === 'precipitation' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                }}
                formatter={(value: any) => [`${value}% chance`, 'Rain Probability']}
              />
              <Area
                type="monotone"
                dataKey="precipProb"
                name="Precipitation Probability (%)"
                stroke="#60a5fa"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPrecip)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[0, 12]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                }}
                formatter={(value: any) => [`${value}`, 'Max UV Index']}
              />
              <Area
                type="monotone"
                dataKey="uvIndex"
                name="Max UV Index"
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
