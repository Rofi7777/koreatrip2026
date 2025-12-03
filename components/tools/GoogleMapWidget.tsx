"use client";

interface Location {
  name: string;
  url: string;
}

const LOCATIONS: Location[] = [
  {
    name: "InterContinental Alpensia",
    url: "https://www.google.com/maps/search/?api=1&query=InterContinental+Alpensia+Pyeongchang+Resort",
  },
  {
    name: "Myeongdong",
    url: "https://www.google.com/maps/search/?api=1&query=Myeongdong+Shopping+Street",
  },
  {
    name: "Gyeongbokgung",
    url: "https://www.google.com/maps/search/?api=1&query=Gyeongbokgung+Palace",
  },
  {
    name: "Incheon Airport",
    url: "https://www.google.com/maps/search/?api=1&query=Incheon+International+Airport",
  },
];

export function GoogleMapWidget() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
        <i className="fas fa-map-marked-alt text-white" />
        Google Maps Navigation
      </div>
      
      <div className="space-y-2">
        {LOCATIONS.map((location, index) => (
          <a
            key={index}
            href={location.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-lg border border-white/30 bg-white/20 backdrop-blur-md hover:bg-white/30 hover:border-white/50 transition-colors group"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <i className="fas fa-map-marker-alt text-white text-xs flex-shrink-0" />
              <span className="text-xs font-medium text-white truncate">
                {location.name}
              </span>
            </div>
            <span className="text-xs text-white font-medium ml-2 flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
              Open in App ↗
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}


