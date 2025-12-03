"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface WeatherData {
  temperature: number;
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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code&timezone=auto`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        
        const data = await response.json();
        setWeather({
          temperature: data.current.temperature_2m,
          weatherCode: data.current.weather_code,
        });
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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <i className="fas fa-cloud-sun text-[#6D28D9]" />
          {t("tools_weather_title") || "Weather"}
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value as keyof typeof LOCATIONS)}
          className="text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6D28D9] focus:border-transparent"
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
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6D28D9]"></div>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 py-2">{error}</div>
      )}

      {!loading && !error && weather && weatherInfo && (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{weatherInfo.icon}</span>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {weather.temperature}°C
              </div>
              <div className="text-xs text-gray-600">
                {weatherInfo.label}
                {selectedCity === "pyeongchang" &&
                  weather.weatherCode >= 71 &&
                  weather.weatherCode <= 77 && (
                    <span className="ml-1 text-[#6D28D9] font-semibold">
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
          <div className="text-xs text-gray-500 pt-1 border-t border-gray-100">
            {cityName}
          </div>
        </div>
      )}
    </div>
  );
}

