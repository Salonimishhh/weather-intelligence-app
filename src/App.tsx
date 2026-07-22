import React, { useState, useEffect, useCallback } from 'react';
import { GeocodingResult, TemperatureUnit, WeatherData } from './types';
import { fetchWeatherData, getCityFromCoordinates } from './services/openMeteoApi';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FavoritesBar, POPULAR_CITIES } from './components/FavoritesBar';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { SevenDayForecast } from './components/SevenDayForecast';
import { TrendChart } from './components/TrendChart';
import { Recommendations } from './components/Recommendations';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { CloudSun, RefreshCw } from 'lucide-react';

const LOCAL_STORAGE_UNIT_KEY = 'weather_app_unit';
const LOCAL_STORAGE_FAVORITES_KEY = 'weather_app_favorites';

export default function App() {
  // Unit state (°C / °F)
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_UNIT_KEY);
    return saved === 'F' ? 'F' : 'C';
  });

  // Favorites state
  const [favorites, setFavorites] = useState<GeocodingResult[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current selected city (Default: London)
  const [currentCity, setCurrentCity] = useState<GeocodingResult>(POPULAR_CITIES[0]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load weather for a given city
  const loadWeather = useCallback(async (city: GeocodingResult) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
      setCurrentCity(city);
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError(
        err.message || 'Unable to load weather forecast data. Please verify your connection.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(currentCity);
  }, []);

  // Persist unit preference
  const handleToggleUnit = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    localStorage.setItem(LOCAL_STORAGE_UNIT_KEY, newUnit);
  };

  // Toggle favorite city
  const handleToggleFavorite = (city: GeocodingResult) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.name.toLowerCase() === city.name.toLowerCase() && f.country === city.country
      );
      let updated: GeocodingResult[];
      if (exists) {
        updated = prev.filter(
          (f) => !(f.name.toLowerCase() === city.name.toLowerCase() && f.country === city.country)
        );
      } else {
        updated = [...prev, city];
      }
      localStorage.setItem(LOCAL_STORAGE_FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Obtain geolocation position
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const cityInfo = await getCityFromCoordinates(lat, lng);
          await loadWeather(cityInfo);
        } catch (err) {
          setError('Failed to resolve current geographic location.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoErr) => {
        setIsLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError('Location permission denied. Please search for your city manually.');
        } else {
          setError('Unable to retrieve location coordinates.');
        }
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white pb-16">
      {/* Top Header */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Search Bar & City Selector Section */}
        <section className="space-y-4">
          <SearchBar onSelectCity={loadWeather} isLoading={isLoading} />
          <FavoritesBar
            currentCity={currentCity}
            onSelectCity={loadWeather}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </section>

        {/* Content Body based on state */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={() => loadWeather(currentCity)}
          />
        ) : weatherData ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Hero Current Weather Section */}
            <CurrentWeather data={weatherData} unit={unit} />

            {/* 2. Personalized Smart Recommendations Panel */}
            <Recommendations data={weatherData} unit={unit} />

            {/* 3. 24-Hour Forecast Slider */}
            <HourlyForecast data={weatherData} unit={unit} />

            {/* 4. 7-Day Forecast & Trend Chart Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <SevenDayForecast daily={weatherData.daily} unit={unit} />
              </div>
              <div className="lg:col-span-6">
                <TrendChart daily={weatherData.daily} unit={unit} />
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 text-center text-xs text-slate-400">
        <p className="flex items-center justify-center gap-1.5">
          <span>Powered by</span>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:underline font-medium"
          >
            Open-Meteo Public Weather API
          </a>
          <span>• Built with React & Vite</span>
        </p>
      </footer>
    </div>
  );
}
