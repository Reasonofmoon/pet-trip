'use client';

import { useEffect, useRef } from 'react';
import { CourseSpot } from '@/types';

// Leaflet CSS is loaded via CDN in this component
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

const TIME_COLORS: Record<string, string> = {
  morning: '#3b82f6',
  afternoon: '#f97316',
  evening: '#8b5cf6',
};

function getTimeOfDay(time: string): 'morning' | 'afternoon' | 'evening' {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

const CATEGORY_MARKER: Record<string, string> = {
  nature: '🌿',
  cafe: '☕',
  restaurant: '🍽️',
  accommodation: '🏨',
  beach: '🏖️',
  culture: '🎭',
  shopping: '🛍️',
  activity: '🎯',
};

interface CourseMapProps {
  spots: CourseSpot[];
  activeSpot: string | null;
  onSpotClick: (contentId: string) => void;
}

export default function CourseMap({ spots, activeSpot, onSpotClick }: CourseMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    // Dynamic import of Leaflet
    const initMap = async () => {
      const L = await import('leaflet');
      const LDefault = L.default || L;

      if (!mapRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Calculate center from spots
      const avgLat = spots.reduce((sum, s) => sum + s.coordinates.mapY, 0) / spots.length || 33.45;
      const avgLng = spots.reduce((sum, s) => sum + s.coordinates.mapX, 0) / spots.length || 126.57;

      const map = LDefault.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([avgLat, avgLng], 11);

      // VWorld Korean WMTS tiles (한국 지도)
      const vworldKey = process.env.NEXT_PUBLIC_VWORLD_KEY;
      if (vworldKey) {
        LDefault.tileLayer(`https://api.vworld.kr/req/wmts/1.0.0/${vworldKey}/Base/{z}/{y}/{x}.png`, {
          attribution: '&copy; <a href="https://www.vworld.kr">VWorld</a> 국토교통부',
          maxZoom: 19,
          minZoom: 5,
        }).addTo(map);
      } else {
        // Fallback to CartoDB Voyager
        LDefault.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        }).addTo(map);
      }

      mapInstanceRef.current = map;

      // Add markers
      const markers: L.Marker[] = [];
      const allLatLngs: [number, number][] = [];

      spots.forEach((spot, idx) => {
        const latLng: [number, number] = [spot.coordinates.mapY, spot.coordinates.mapX];
        allLatLngs.push(latLng);

        const timeColor = TIME_COLORS[getTimeOfDay(spot.arrivalTime)];
        const emoji = CATEGORY_MARKER[spot.category] || '📍';
        const isActive = activeSpot === spot.contentId;

        // Custom HTML icon
        const icon = LDefault.divIcon({
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: ${isActive ? 44 : 36}px;
              height: ${isActive ? 44 : 36}px;
              border-radius: 50%;
              background: ${isActive ? timeColor : '#ffffff'};
              border: 3px solid ${timeColor};
              font-size: ${isActive ? 20 : 16}px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 0 ${isActive ? 12 : 0}px ${timeColor}50;
              transition: all 0.3s ease;
              cursor: pointer;
              position: relative;
            ">
              ${emoji}
              <span style="
                position: absolute;
                top: -8px;
                right: -8px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: linear-gradient(135deg, #f59e0b, #f97316);
                color: white;
                font-size: 10px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Outfit', sans-serif;
              ">${idx + 1}</span>
            </div>
          `,
          className: '',
          iconSize: [isActive ? 44 : 36, isActive ? 44 : 36],
          iconAnchor: [isActive ? 22 : 18, isActive ? 22 : 18],
        });

        const marker = LDefault.marker(latLng, { icon }).addTo(map);

        // Popup
        marker.bindPopup(`
          <div style="font-family: 'Outfit', sans-serif; min-width: 180px;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${spot.title}</div>
            <div style="font-size: 12px; opacity: 0.7; margin-bottom: 4px;">${spot.arrivalTime} · ${spot.duration}분</div>
            ${spot.petPolicy ? `<div style="font-size: 11px; padding: 4px 8px; background: rgba(20,184,166,0.15); border-radius: 6px; margin-top: 4px;">🐾 ${spot.petPolicy.sizeAllowed}</div>` : ''}
          </div>
        `);

        marker.on('click', () => onSpotClick(spot.contentId));
        markers.push(marker);
      });

      markersRef.current = markers;

      // Draw route polylines between spots
      if (allLatLngs.length > 1) {
        // Group by time of day for colored segments
        for (let i = 0; i < allLatLngs.length - 1; i++) {
          const timeColor = TIME_COLORS[getTimeOfDay(spots[i].arrivalTime)];
          LDefault.polyline([allLatLngs[i], allLatLngs[i + 1]], {
            color: timeColor,
            weight: 3,
            opacity: 0.6,
            dashArray: '8, 8',
            smoothFactor: 1,
          }).addTo(map);
        }
      }

      // Fit bounds
      if (allLatLngs.length > 0) {
        map.fitBounds(allLatLngs, { padding: [40, 40] });
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spots, activeSpot, onSpotClick]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-lg)',
      }}
    />
  );
}
