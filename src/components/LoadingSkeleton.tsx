import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Hero card skeleton */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-800 rounded-lg" />
            <div className="h-8 w-48 bg-slate-800 rounded-xl" />
          </div>
          <div className="h-8 w-36 bg-slate-800 rounded-xl" />
        </div>

        <div className="flex items-center gap-6 my-8">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl shrink-0" />
          <div className="space-y-3">
            <div className="h-12 w-32 bg-slate-800 rounded-xl" />
            <div className="h-5 w-40 bg-slate-800 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-800/60 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Hourly forecast skeleton */}
      <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="h-6 w-40 bg-slate-800 rounded-lg mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 w-24 bg-slate-800/60 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-slate-900/60 border border-slate-800 rounded-3xl p-6" />
        <div className="h-80 bg-slate-900/60 border border-slate-800 rounded-3xl p-6" />
      </div>
    </div>
  );
};
