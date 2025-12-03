"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LOCATIONS_KO, type KoreanLocation } from "@/lib/korean-addresses";
import { X } from "lucide-react";

export function TaxiCardModal() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<KoreanLocation | null>(
    LOCATIONS_KO[0]
  );

  const handleOpen = () => {
    setIsOpen(true);
    if (!selectedLocation) {
      setSelectedLocation(LOCATIONS_KO[0]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="p-4 md:p-6">
        <button
          type="button"
          onClick={handleOpen}
          className="w-full inline-flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/30 px-6 py-8 hover:bg-white/30 hover:border-white/50 transition-all transform hover:scale-105 active:scale-95"
        >
          <span className="text-4xl">🚕</span>
          <div className="text-center">
            <div className="text-sm font-bold text-white mb-1">
              {language === "vi"
                ? "Thẻ Taxi"
                : language === "zh-TW"
                ? "計程車卡"
                : "Taxi Card"}
            </div>
            <div className="text-xs text-white/80">
              {language === "vi"
                ? "Đưa cho tài xế"
                : language === "zh-TW"
                ? "給司機看"
                : "Show to driver"}
            </div>
          </div>
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {language === "vi"
                  ? "Chọn điểm đến"
                  : language === "zh-TW"
                  ? "選擇目的地"
                  : "Choose Destination"}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-white hover:text-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Location Selector */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LOCATIONS_KO.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => setSelectedLocation(location)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedLocation?.id === location.id
                        ? "bg-yellow-400 text-gray-900 shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            </div>

            {/* THE CARD - Large Korean Address Display */}
            {selectedLocation && (
              <div className="p-8 bg-white">
                <div className="bg-white border-4 border-gray-800 rounded-2xl p-8 shadow-lg">
                  {/* Destination Name (Korean) - Extremely Large */}
                  <div className="text-center mb-6">
                    <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
                      {selectedLocation.nameKo}
                    </h1>
                  </div>

                  {/* Full Address (Korean) - Large */}
                  <div className="text-center mb-6">
                    <p className="text-2xl md:text-3xl font-semibold text-black leading-relaxed">
                      {selectedLocation.address}
                    </p>
                  </div>

                  {/* Polite Request */}
                  <div className="text-center pt-6 border-t-2 border-gray-300">
                    <p className="text-xl md:text-2xl font-medium text-gray-700">
                      {selectedLocation.message}
                    </p>
                  </div>

                  {/* QR Code Placeholder (Optional) */}
                  <div className="mt-6 text-center">
                    <div className="inline-block p-4 bg-gray-100 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">
                        {language === "vi"
                          ? "Quét mã để xem trên Google Maps"
                          : language === "zh-TW"
                          ? "掃描以在Google地圖上查看"
                          : "Scan to view on Google Maps"}
                      </p>
                      <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded flex items-center justify-center mx-auto">
                        <span className="text-gray-400 text-xs">QR Code</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md"
              >
                {language === "vi"
                  ? "Đóng"
                  : language === "zh-TW"
                  ? "關閉"
                  : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

