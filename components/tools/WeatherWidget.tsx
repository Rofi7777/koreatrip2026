"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  feelsLike?: number;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
}

interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

interface WeatherInfo {
  icon: string;
  label: string;
}

const LOCATIONS = {
  seoul: {
    name: "Seoul",
    nameVi: "Seoul",
    nameZh: "首爾",
    nameEn: "Seoul",
    lat: 37.5665,
    lon: 126.9780,
  },
  pyeongchang: {
    name: "Pyeongchang",
    nameVi: "Pyeongchang",
    nameZh: "平昌",
    nameEn: "Pyeongchang",
    lat: 37.6548,
    lon: 128.6706,
  },
};

function getWeatherInfo(code: number, language: string): WeatherInfo {
  // WMO Weather Code Mapping
  if (code === 0) {
    return {
      icon: "☀️",
      label:
        language === "vi"
          ? "Trời quang"
          : language === "zh-TW"
          ? "晴朗"
          : "Clear",
    };
  }
  if (code >= 1 && code <= 3) {
    return {
      icon: "☁️",
      label:
        language === "vi"
          ? "Nhiều mây"
          : language === "zh-TW"
          ? "多雲"
          : "Cloudy",
    };
  }
  if (code === 45 || code === 48) {
    return {
      icon: "🌫️",
      label:
        language === "vi"
          ? "Có sương mù"
          : language === "zh-TW"
          ? "有霧"
          : "Foggy",
    };
  }
  if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65)) {
    return {
      icon: "🌧️",
      label:
        language === "vi"
          ? "Có mưa"
          : language === "zh-TW"
          ? "下雨"
          : "Rainy",
    };
  }
  if (code >= 71 && code <= 77) {
    return {
      icon: "❄️",
      label:
        language === "vi"
          ? "Có tuyết"
          : language === "zh-TW"
          ? "下雪"
          : "Snow",
    };
  }
  if (code >= 80 && code <= 99) {
    return {
      icon: "⛈️",
      label:
        language === "vi"
          ? "Bão"
          : language === "zh-TW"
          ? "暴風雨"
          : "Storm",
    };
  }
  return {
    icon: "☁️",
    label:
      language === "vi"
        ? "Không xác định"
        : language === "zh-TW"
        ? "未知"
        : "Unknown",
  };
}

export function WeatherWidget() {
  const { language, t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<keyof typeof LOCATIONS>("pyeongchang");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = LOCATIONS[selectedCity];
  const cityName =
    language === "vi"
      ? location.nameVi
      : language === "zh-TW"
      ? location.nameZh
      : location.nameEn;

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=5`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        
        const data = await response.json();
        
        // Current weather
        setWeather({
          temperature: data.current.temperature_2m,
          weatherCode: data.current.weather_code,
          feelsLike: data.current.apparent_temperature,
        });

        // Hourly forecast - extract specific times (09:00, 12:00, 15:00, 18:00)
        const hourlyData: HourlyForecast[] = [];
        const targetHours = [9, 12, 15, 18];
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        data.hourly.time.forEach((timeStr: string, index: number) => {
          const time = new Date(timeStr);
          const hour = time.getHours();
          const isToday = time.getTime() >= today.getTime() && time.getTime() < today.getTime() + 24 * 60 * 60 * 1000;
          
          if (isToday && targetHours.includes(hour)) {
            hourlyData.push({
              time: timeStr,
              temperature: data.hourly.temperature_2m[index],
              weatherCode: data.hourly.weather_code[index],
            });
          }
        });
        setHourlyForecast(hourlyData);

        // Daily forecast - next 5 days
        const dailyData: DailyForecast[] = [];
        for (let i = 0; i < 5 && i < data.daily.time.length; i++) {
          dailyData.push({
            date: data.daily.time[i],
            maxTemp: data.daily.temperature_2m_max[i],
            minTemp: data.daily.temperature_2m_min[i],
            weatherCode: data.daily.weather_code[i],
          });
        }
        setDailyForecast(dailyData);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Failed to load weather");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity, location.lat, location.lon]);

  const weatherInfo = weather
    ? getWeatherInfo(weather.weatherCode, language)
    : null;

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <i className="fas fa-cloud-sun text-white" />
          {t("tools_weather_title") || "Weather"}
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value as keyof typeof LOCATIONS)}
          className="text-xs px-2 py-1 rounded-lg border border-white/30 bg-white/20 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 [&>option]:bg-blue-400 [&>option]:text-gray-900"
        >
          <option value="pyeongchang">
            {language === "vi"
              ? LOCATIONS.pyeongchang.nameVi
              : language === "zh-TW"
              ? LOCATIONS.pyeongchang.nameZh
              : LOCATIONS.pyeongchang.nameEn}
          </option>
          <option value="seoul">
            {language === "vi"
              ? LOCATIONS.seoul.nameVi
              : language === "zh-TW"
              ? LOCATIONS.seoul.nameZh
              : LOCATIONS.seoul.nameEn}
          </option>
        </select>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-100 bg-red-500/30 px-2 py-1 rounded-lg">{error}</div>
      )}

      {!loading && !error && weather && weatherInfo && (
        <div className="space-y-4">
          {/* Current Weather */}
          <div className="flex items-center gap-3">
            <span className="text-4xl">{weatherInfo.icon}</span>
            <div>
              <div className="text-2xl font-bold text-white">
                {weather.temperature}°C
              </div>
              <div className="text-xs text-white/90">
                {weather.feelsLike !== undefined && (
                  <span>
                    {language === "vi"
                      ? `Cảm giác như ${Math.round(weather.feelsLike)}°C`
                      : language === "zh-TW"
                      ? `體感 ${Math.round(weather.feelsLike)}°C`
                      : `Feels like ${Math.round(weather.feelsLike)}°C`}
                  </span>
                )}
              </div>
              <div className="text-xs text-white/80 mt-1">
                {weatherInfo.label}
                {selectedCity === "pyeongchang" &&
                  weather.weatherCode >= 71 &&
                  weather.weatherCode <= 77 && (
                    <span className="ml-1 text-white font-semibold">
                      ❄️{" "}
                      {language === "vi"
                        ? "Hoàn hảo cho trượt tuyết!"
                        : language === "zh-TW"
                        ? "完美滑雪天氣！"
                        : "Perfect for skiing!"}
                    </span>
                  )}
              </div>
            </div>
          </div>

          {/* Today's Hourly Forecast */}
          {hourlyForecast.length > 0 && (
            <div className="pt-3 border-t border-white/20">
              <div className="text-xs font-semibold text-white/90 mb-2 uppercase tracking-wide">
                {language === "vi" ? "Hôm nay" : language === "zh-TW" ? "今天" : "Today"}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {hourlyForecast.map((hour, index) => {
                  const hourInfo = getWeatherInfo(hour.weatherCode, language);
                  const hourLabel = new Date(hour.time).getHours();
                  const timeLabel =
                    hourLabel === 9
                      ? language === "vi"
                        ? "Sáng"
                        : language === "zh-TW"
                        ? "上午"
                        : "Morning"
                      : hourLabel === 12
                      ? language === "vi"
                        ? "Trưa"
                        : language === "zh-TW"
                        ? "中午"
                        : "Noon"
                      : hourLabel === 15
                      ? language === "vi"
                        ? "Chiều"
                        : language === "zh-TW"
                        ? "下午"
                        : "Afternoon"
                      : language === "vi"
                      ? "Tối"
                      : language === "zh-TW"
                      ? "晚上"
                      : "Evening";

                  return (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-center"
                    >
                      <div className="text-lg mb-1">{hourInfo.icon}</div>
                      <div className="text-xs text-white/90 font-medium">{timeLabel}</div>
                      <div className="text-xs font-bold text-white">
                        {Math.round(hour.temperature)}°C
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5-Day Forecast */}
          {dailyForecast.length > 0 && (
            <div className="pt-3 border-t border-white/20">
              <div className="text-xs font-semibold text-white/90 mb-2 uppercase tracking-wide">
                {language === "vi"
                  ? "Dự báo 5 ngày"
                  : language === "zh-TW"
                  ? "5天預報"
                  : "5-Day Forecast"}
              </div>
              <div className="space-y-2">
                {dailyForecast.map((day, index) => {
                  const dayInfo = getWeatherInfo(day.weatherCode, language);
                  const date = new Date(day.date);
                  const monthNames =
                    language === "vi"
                      ? ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"]
                      : language === "zh-TW"
                      ? ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
                      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  const dayName =
                    index === 0
                      ? language === "vi"
                        ? "Hôm nay"
                        : language === "zh-TW"
                        ? "今天"
                        : "Today"
                      : index === 1
                      ? language === "vi"
                        ? "Ngày mai"
                        : language === "zh-TW"
                        ? "明天"
                        : "Tomorrow"
                      : `${monthNames[date.getMonth()]} ${date.getDate()}`;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-2"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xl">{dayInfo.icon}</span>
                        <div className="flex flex-col min-w-0">
                          <div className="text-xs font-semibold text-white truncate">
                            {dayName}
                          </div>
                          <div className="text-[10px] text-white/70">
                            {monthNames[date.getMonth()]} {date.getDate()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white font-semibold">
                        <span className="text-white/70">
                          {Math.round(day.minTemp)}°
                        </span>
                        <span>/</span>
                        <span>{Math.round(day.maxTemp)}°</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-xs text-white/70 pt-2 border-t border-white/10 text-center">
            {cityName}
          </div>
        </div>
      )}
    </div>
  );
}

