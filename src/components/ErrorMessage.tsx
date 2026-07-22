import React from 'react';
import { AlertTriangle, RefreshCw, Search } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Unable to Load Weather Data',
  message,
  onRetry,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-slate-900/80 border border-rose-500/30 rounded-3xl text-center space-y-4 shadow-2xl">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto">{message}</p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-sky-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
