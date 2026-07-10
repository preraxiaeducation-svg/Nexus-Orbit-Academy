"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function StarField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars: Star[] = [];
    const count = 180;

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        radius: Math.random() * 1.5 + 0.3,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.7 + 0.1,
      });
    }

    container.innerHTML = stars
      .map(
        (s) => `
        <div class="star" style="
          left: ${s.x}%;
          top: ${s.y}%;
          width: ${s.radius * 2}px;
          height: ${s.radius * 2}px;
          opacity: ${s.opacity};
          --duration: ${s.duration}s;
          --delay: ${s.delay}s;
        "></div>
      `
      )
      .join("");

    // Add a few shooting stars
    const shootingCount = 3;
    for (let i = 0; i < shootingCount; i++) {
      const el = document.createElement("div");
      el.className = "shooting-star";
      el.style.cssText = `
        top: ${Math.random() * 60}%;
        left: ${Math.random() * 60}%;
        animation-delay: ${Math.random() * 15 + i * 5}s;
        animation-duration: ${Math.random() * 1.5 + 1}s;
        animation-iteration-count: infinite;
      `;
      container.appendChild(el);
    }
  }, []);

  return <div ref={containerRef} className="star-field" aria-hidden="true" />;
}
