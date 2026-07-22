import React from 'react';
import { TemperatureUnit, WeatherData } from '../types';
import { generateRecommendations } from '../utils/weatherHelpers';
import { WeatherIcon } from './WeatherIcon';
import { Lightbulb, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

interface RecommendationsProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ data, unit }) => {
  const recommendations = generateRecommendations(data, unit);

  const typeStyles = {
    alert: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    info: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
  };

  const iconColor = {
    alert: 'text-rose-400',
    warning: 'text-amber-400',
    info: 'text-sky-400',
    success: 'text-emerald-400',
  };

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Smart Intelligence & Recommendations</h3>
        </div>
        <span className="text-xs text-slate-400">Tailored Guidance</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => {
          return (
            <div
              key={rec.id}
              className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${typeStyles[rec.type]}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl bg-slate-900/80 shrink-0 ${iconColor[rec.type]}`}>
                  <WeatherIcon name={rec.iconName} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100 mb-1 flex items-center gap-1.5">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
