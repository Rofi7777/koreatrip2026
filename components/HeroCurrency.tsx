"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

type Direction = "krw_to_vnd" | "vnd_to_krw";

export function HeroCurrency() {
  const { language } = useLanguage();
  const [amount, setAmount] = useState<string>("");
  const [direction, setDirection] = useState<Direction>("krw_to_vnd");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://open.er-api.com/v6/latest/KRW");
        
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rate");
        }
        
        const data = await response.json();
        const vndRate = data.rates?.VND;
        
        if (!vndRate) {
          throw new Error("VND rate not found");
        }
        
        setRate(vndRate);
      } catch (err) {
        console.error("Currency fetch error:", err);
        setError("Failed to load rate");
        // Fallback rate (approximate)
        setRate(17.5);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
    // Refresh every hour
    const interval = setInterval(fetchRate, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const toggleDirection = () => {
    setDirection(direction === "krw_to_vnd" ? "vnd_to_krw" : "krw_to_vnd");
    setAmount(""); // Clear amount when switching
  };

  const calculateResult = (): string => {
    if (!amount || !rate) return "0";
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "0";
    
    if (direction === "krw_to_vnd") {
      const result = numAmount * rate;
      return result.toLocaleString("vi-VN", {
        maximumFractionDigits: 0,
      });
    } else {
      const result = numAmount / rate;
      return result.toLocaleString("vi-VN", {
        maximumFractionDigits: 0,
      });
    }
  };

  const getFromCurrency = () => {
    return direction === "krw_to_vnd" ? "KRW" : "VND";
  };

  const getToCurrency = () => {
    return direction === "krw_to_vnd" ? "VND" : "KRW";
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 min-w-[200px]">
      {/* Row 1: Input + Currency Label */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder={
            language === "vi"
              ? "Nhập số..."
              : language === "zh-TW"
              ? "輸入金額..."
              : "Enter amount..."
          }
          className="flex-1 px-2 py-1.5 text-sm bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60"
        />
        <span className="text-xs font-semibold text-white/90 min-w-[40px]">
          {getFromCurrency()}
        </span>
      </div>

      {/* Row 2: Swap Button + Result */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleDirection}
          className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center justify-center"
          title={
            language === "vi"
              ? "Đổi hướng"
              : language === "zh-TW"
              ? "切換方向"
              : "Swap direction"
          }
        >
          <span className="text-white text-sm">⇅</span>
        </button>
        <div className="flex-1 text-right">
          {loading ? (
            <div className="text-xs text-white/70">...</div>
          ) : error ? (
            <div className="text-xs text-white/70">
              {language === "vi"
                ? "Lỗi"
                : language === "zh-TW"
                ? "錯誤"
                : "Error"}
            </div>
          ) : (
            <div className="text-sm font-bold text-white">
              {calculateResult()} {getToCurrency()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

