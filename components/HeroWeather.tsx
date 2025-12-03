"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  weatherCode: number;
}

interface WeatherInfo {
  icon: string;
  label: string;
}

const LOCATIONS = {
  pyeongchang: {
    name: "Pyeongchang",
    nameVi: "Pyeongchang",
    lat: 37.6548,
    lon: 128.6706,
  },
  seoul: {
    name: "Seoul",
    nameVi: "Seoul",
    lat: 37.5665,
    lon: 126.9780,
  },
};

function getWeatherInfo(code: number): WeatherInfo {
  // WMO Weather Code Mapping
  if (code === 0) {
    return { icon: "☀️", label: "Trời quang" };
  }
  if (code >= 1 && code <= 3) {
    return { icon: "☁️", label: "Nhiều mây" };
  }
  if (code === 45 || code === 48) {
    return { icon: "🌫️", label: "Có sương mù" };
  }
  if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65)) {
    return { icon: "🌧️", label: "Có mưa" };
  }
  if (code >= 71 && code <= 77) {
    return { icon: "❄️", label: "Có tuyết" };
  }
  if (code >= 80 && code <= 99) {
    return { icon: "⛈️", label: "Bão" };
  }
  return { icon: "☁️", label: "Không xác định" };
}

export function HeroWeather() {
  const [selectedCity, setSelectedCity] = useState<keyof typeof LOCATIONS>("pyeongchang");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const location = LOCATIONS[selectedCity];

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCity, location.lat, location.lon]);

  const weatherInfo = weather ? getWeatherInfo(weather.weatherCode) : null;

  return (
    <div className="flex items-center gap-3 text-white">
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-xs opacity-80">Đang tải...</span>
        </div>
      ) : weather && weatherInfo ? (
        <>
          <span className="text-2xl sm:text-3xl">{weatherInfo.icon}</span>
          <div className="flex flex-col">
            <div className="text-lg sm:text-xl font-bold">
              {weather.temperature}°C
            </div>
            <div className="text-[10px] sm:text-xs opacity-90">
              {location.nameVi}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedCity(selectedCity === "pyeongchang" ? "seoul" : "pyeongchang")}
            className="ml-1 px-2 py-1 text-[10px] bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
            title="Chuyển đổi thành phố"
          >
            <i className="fas fa-sync-alt" />
          </button>
        </>
      ) : (
        <div className="text-xs opacity-80">Không có dữ liệu</div>
      )}
    </div>
  );
}

