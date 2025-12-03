"use client";

import { Snowfall } from "react-snowfall";

export function HeroSnowfall() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 1,
      }}
    >
      <Snowfall
        color="#ffffff"
        snowflakeCount={70}
        speed={[0.5, 1.5]}
        wind={[0.5, 2.0]}
        radius={[0.5, 3.0]}
        changeFrequency={200}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

