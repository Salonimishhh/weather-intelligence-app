export type TemperatureUnit = 'C' | 'F';

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number; // °C
  humidity: number; // %
  apparentTemperature: number; // °C
  isDay: boolean;
  precipitation: number; // mm
  rain: number; // mm
  showers: number; // mm
  snowfall: number; // cm
  weatherCode: number;
  cloudCover: number; // %
  pressure: number; // hPa
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windGusts: number; // km/h
}

export interface HourlyForecastData {
  time: string[];
  temperature: number[];
  humidity: number[];
  precipitationProbability: number[];
  weatherCode: number[];
  windSpeed: number[];
  uvIndex: number[];
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
}

export interface WeatherData {
  city: GeocodingResult;
  current: CurrentWeatherData;
  hourly: HourlyForecastData;
  daily: DailyForecastItem[];
  timezone: string;
}

export interface WeatherRecommendation {
  id: string;
  category: 'clothing' | 'umbrella' | 'sun' | 'activity' | 'wind' | 'health';
  title: string;
  description: string;
  iconName: string;
  type: 'info' | 'warning' | 'alert' | 'success';
}
