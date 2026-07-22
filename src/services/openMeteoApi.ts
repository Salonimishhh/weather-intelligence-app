import { DailyForecastItem, GeocodingResult, WeatherData } from '../types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search cities by name using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = new URL(GEOCODING_BASE_URL);
  url.searchParams.set('name', trimmed);
  url.searchParams.set('count', '8');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Geocoding search failed (${response.status})`);
  }

  const data = await response.json();
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }

  return data.results;
}

/**
 * Fetch detailed weather data for a given latitude and longitude
 */
export async function fetchWeatherData(
  city: GeocodingResult
): Promise<WeatherData> {
  const url = new URL(FORECAST_BASE_URL);
  url.searchParams.set('latitude', city.latitude.toString());
  url.searchParams.set('longitude', city.longitude.toString());
  url.searchParams.set(
    'current',
    'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m'
  );
  url.searchParams.set(
    'hourly',
    'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index'
  );
  url.searchParams.set(
    'daily',
    'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max'
  );
  url.searchParams.set('timezone', city.timezone || 'auto');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Weather service unavailable (${response.status})`);
  }

  const raw = await response.json();

  if (!raw.current || !raw.daily || !raw.hourly) {
    throw new Error('Incomplete weather forecast data received');
  }

  // Parse daily forecast array
  const dailyList: DailyForecastItem[] = [];
  const dailyTimes: string[] = raw.daily.time || [];

  for (let i = 0; i < dailyTimes.length; i++) {
    dailyList.push({
      date: dailyTimes[i],
      weatherCode: raw.daily.weather_code[i] ?? 0,
      tempMax: raw.daily.temperature_2m_max[i] ?? 0,
      tempMin: raw.daily.temperature_2m_min[i] ?? 0,
      apparentTempMax: raw.daily.apparent_temperature_max?.[i] ?? raw.daily.temperature_2m_max[i],
      apparentTempMin: raw.daily.apparent_temperature_min?.[i] ?? raw.daily.temperature_2m_min[i],
      sunrise: raw.daily.sunrise?.[i] || '',
      sunset: raw.daily.sunset?.[i] || '',
      uvIndexMax: raw.daily.uv_index_max?.[i] ?? 0,
      precipitationSum: raw.daily.precipitation_sum?.[i] ?? 0,
      precipitationProbabilityMax: raw.daily.precipitation_probability_max?.[i] ?? 0,
      windSpeedMax: raw.daily.wind_speed_10m_max?.[i] ?? 0,
    });
  }

  return {
    city,
    current: {
      time: raw.current.time,
      temperature: raw.current.temperature_2m,
      humidity: raw.current.relative_humidity_2m,
      apparentTemperature: raw.current.apparent_temperature,
      isDay: Boolean(raw.current.is_day),
      precipitation: raw.current.precipitation ?? 0,
      rain: raw.current.rain ?? 0,
      showers: raw.current.showers ?? 0,
      snowfall: raw.current.snowfall ?? 0,
      weatherCode: raw.current.weather_code,
      cloudCover: raw.current.cloud_cover ?? 0,
      pressure: raw.current.pressure_msl ?? 1013,
      windSpeed: raw.current.wind_speed_10m ?? 0,
      windDirection: raw.current.wind_direction_10m ?? 0,
      windGusts: raw.current.wind_gusts_10m ?? 0,
    },
    hourly: {
      time: raw.hourly.time || [],
      temperature: raw.hourly.temperature_2m || [],
      humidity: raw.hourly.relative_humidity_2m || [],
      precipitationProbability: raw.hourly.precipitation_probability || [],
      weatherCode: raw.hourly.weather_code || [],
      windSpeed: raw.hourly.wind_speed_10m || [],
      uvIndex: raw.hourly.uv_index || [],
    },
    daily: dailyList,
    timezone: raw.timezone || city.timezone || 'UTC',
  };
}

/**
 * Fallback to reverse geocode lat/lng to city object
 */
export async function getCityFromCoordinates(
  lat: number,
  lng: number
): Promise<GeocodingResult> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (res.ok) {
      const info = await res.json();
      const cityName = info.city || info.locality || info.principalSubdivision || 'Current Location';
      return {
        id: Math.floor(lat * 1000 + lng),
        name: cityName,
        latitude: lat,
        longitude: lng,
        country: info.countryName || '',
        admin1: info.principalSubdivision || '',
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
  }

  return {
    id: Math.floor(lat * 1000 + lng),
    name: 'Current Location',
    latitude: lat,
    longitude: lng,
    country: '',
  };
}
