import { TemperatureUnit, WeatherData, WeatherRecommendation } from '../types';
import { getWeatherInfo } from './weatherCodes';

export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TemperatureUnit, showUnit = true): string {
  const converted = convertTemp(celsius, unit);
  return `${converted}°${showUnit ? unit : ''}`;
}

export function formatWindSpeed(kmh: number, unit: TemperatureUnit): string {
  if (unit === 'F') {
    // Convert km/h to mph
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function getWindDirectionCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
}

export function formatTime(timeString: string, timezone?: string): string {
  const date = new Date(timeString);
  if (isNaN(date.getTime())) return timeString;

  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || undefined,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }
}

export function getDayName(dateString: string, isToday = false): string {
  if (isToday) return 'Today';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
}

export function generateRecommendations(
  data: WeatherData,
  unit: TemperatureUnit
): WeatherRecommendation[] {
  const recs: WeatherRecommendation[] = [];
  const current = data.current;
  const todayDaily = data.daily[0];
  const maxTempC = todayDaily ? todayDaily.tempMax : current.temperature;
  const minTempC = todayDaily ? todayDaily.tempMin : current.temperature;
  const rainProb = todayDaily ? todayDaily.precipitationProbabilityMax : 0;
  const precipSum = todayDaily ? todayDaily.precipitationSum : current.precipitation;
  const uvMax = todayDaily ? todayDaily.uvIndexMax : 0;
  const windMax = todayDaily ? todayDaily.windSpeedMax : current.windSpeed;
  const weatherInfo = getWeatherInfo(current.weatherCode);

  // 1. Umbrella / Rain Recommendation
  if (rainProb >= 40 || precipSum > 1.0 || weatherInfo.category === 'rain' || weatherInfo.category === 'drizzle' || weatherInfo.category === 'thunderstorm') {
    recs.push({
      id: 'umbrella',
      category: 'umbrella',
      title: 'Carry an Umbrella',
      description: `Rain or showers expected (${rainProb}% max probability, ${precipSum.toFixed(1)} mm total precipitation). Keep an umbrella or raincoat handy.`,
      iconName: 'Umbrella',
      type: rainProb > 70 ? 'alert' : 'warning',
    });
  }

  // 2. Clothing Advice based on High / Low Temp
  if (maxTempC >= 28) {
    recs.push({
      id: 'clothing-hot',
      category: 'clothing',
      title: 'Wear Light & Breathable Clothes',
      description: `Highs will reach ${formatTemp(maxTempC, unit)}. Choose lightweight cotton/linen garments, sunglasses, and open footwear.`,
      iconName: 'Shirt',
      type: 'info',
    });
  } else if (maxTempC <= 12 || minTempC <= 8) {
    recs.push({
      id: 'clothing-cold',
      category: 'clothing',
      title: 'Wear Warm Layers / Jacket',
      description: `Cool temperatures ahead (low of ${formatTemp(minTempC, unit)}). Dress in warm thermal layers, a coat, and a scarf.`,
      iconName: 'Jacket',
      type: 'info',
    });
  } else if (maxTempC <= 19) {
    recs.push({
      id: 'clothing-mild',
      category: 'clothing',
      title: 'Light Sweater or Windbreaker',
      description: `Mild weather expected (${formatTemp(minTempC, unit)} to ${formatTemp(maxTempC, unit)}). A light sweater or cardigan is recommended.`,
      iconName: 'Shirt',
      type: 'info',
    });
  } else {
    recs.push({
      id: 'clothing-comfortable',
      category: 'clothing',
      title: 'Comfortable Daily Attire',
      description: `Pleasant thermal conditions (${formatTemp(maxTempC, unit)}). Casual shirts, pants, or dresses will be comfortable.`,
      iconName: 'Shirt',
      type: 'success',
    });
  }

  // 3. Hydration & Heat Warning
  if (current.temperature >= 27 || maxTempC >= 30) {
    recs.push({
      id: 'hydration',
      category: 'health',
      title: 'Stay Hydrated',
      description: `Warm temperatures increase sweat loss. Drink at least 2.5-3 liters of water throughout the day and seek shade during peak hours.`,
      iconName: 'Droplets',
      type: maxTempC >= 33 ? 'alert' : 'warning',
    });
  }

  // 4. Sun & UV Protection
  if (uvMax >= 6 || (current.isDay && weatherInfo.category === 'clear' && maxTempC >= 22)) {
    const level = uvMax >= 8 ? 'Very High' : uvMax >= 6 ? 'High' : 'Moderate';
    recs.push({
      id: 'sunscreen',
      category: 'sun',
      title: `Apply Sunscreen (${level} UV)`,
      description: `UV Index reaches ${uvMax.toFixed(1)}. Apply SPF 30+ sunscreen, wear UV-blocking sunglasses, and wear a hat if outdoors.`,
      iconName: 'Sun',
      type: uvMax >= 8 ? 'alert' : 'warning',
    });
  }

  // 5. Wind Warning
  if (windMax >= 30 || current.windSpeed >= 25) {
    recs.push({
      id: 'wind',
      category: 'wind',
      title: 'Gusty Wind Advisory',
      description: `Wind gusts reaching ${formatWindSpeed(windMax, unit)}. Secure loose outdoor belongings and take extra care when driving high-profile vehicles.`,
      iconName: 'Wind',
      type: 'warning',
    });
  }

  // 6. Outdoor Activity Advisor
  if (weatherInfo.category === 'thunderstorm' || rainProb > 75) {
    recs.push({
      id: 'activity-indoor',
      category: 'activity',
      title: 'Indoor Activities Recommended',
      description: `Inclement weather conditions forecasted. Plan gym workouts, indoor gaming, or museum visits instead of outdoor events.`,
      iconName: 'Home',
      type: 'warning',
    });
  } else if (weatherInfo.category === 'clear' || weatherInfo.category === 'cloudy') {
    if (current.temperature >= 15 && current.temperature <= 26 && rainProb < 20) {
      recs.push({
        id: 'activity-outdoor',
        category: 'activity',
        title: 'Ideal for Outdoor Activities',
        description: `Great conditions for jogging, cycling, hiking, or picnics with friends in local parks!`,
        iconName: 'Footprints',
        type: 'success',
      });
    }
  }

  return recs;
}
