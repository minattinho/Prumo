"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Fix Leaflet default icon paths broken by Webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type MapProfessional = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  specialty: string;
  rating: number;
};

type MarkerData = {
  lat: number;
  lng: number;
  professionals: MapProfessional[];
};

// Module-level geocode cache — persists across re-renders in the same session
const geocodeCache = new Map<string, { lat: number; lng: number }>();

async function geocodeCitiesBatched(
  entries: Array<{ city: string; state: string }>
): Promise<Map<string, { lat: number; lng: number }>> {
  const results = new Map<string, { lat: number; lng: number }>();

  for (const { city, state } of entries) {
    const key = `${city.toLowerCase()},${state.toLowerCase()}`;

    if (geocodeCache.has(key)) {
      results.set(key, geocodeCache.get(key)!);
      continue;
    }

    try {
      const q = encodeURIComponent(`${city}, ${state}, Brasil`);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=br&accept-language=pt-BR`,
        { headers: { "Accept": "application/json" } }
      );
      const data = await res.json();
      if (data[0]) {
        const coords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        results.set(key, coords);
        geocodeCache.set(key, coords);
      }
    } catch {
      // skip this city silently
    }

    // Respect Nominatim fair-use: max ~5 req/s
    await new Promise((r) => setTimeout(r, 200));
  }

  return results;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildPopupHtml(professionals: MapProfessional[]): string {
  const first = professionals[0];
  const extra = professionals.length - 1;
  return `
    <div style="min-width:190px;font-family:Inter,system-ui,sans-serif;padding:2px">
      <p style="font-weight:700;color:#1A2B4A;margin:0 0 3px;font-size:14px">
        ${escapeHtml(first.name)}
      </p>
      <p style="font-size:11px;color:#555555;margin:0 0 8px">
        ${escapeHtml(first.specialty)} · ${escapeHtml(first.city)}, ${escapeHtml(first.state)}
      </p>
      ${first.rating > 0 ? `
        <div style="display:flex;align-items:center;gap:4px;margin-bottom:10px">
          <span style="color:#FACC15;font-size:14px;line-height:1">★</span>
          <span style="font-size:13px;font-weight:600;color:#1A2B4A">${first.rating.toFixed(1)}</span>
        </div>
      ` : ""}
      <a href="/profissionais/${escapeHtml(first.slug)}"
         style="display:block;text-align:center;background:#1A5DB8;color:white;
                font-size:12px;font-weight:600;padding:7px 12px;border-radius:8px;
                text-decoration:none;cursor:pointer">
        Ver perfil
      </a>
      ${extra > 0 ? `
        <p style="text-align:center;font-size:10px;color:#555;margin:6px 0 0">
          +${extra} profissional${extra > 1 ? "is" : ""} nesta cidade
        </p>
      ` : ""}
    </div>
  `;
}

function createProfessionalIcon(count: number): L.DivIcon {
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -32],
    html: `
      <div style="position:relative;width:28px;height:28px">
        <div style="
          width:24px;height:24px;
          background:#1A5DB8;
          border:2.5px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 8px rgba(0,0,0,0.4);
          margin:2px;
        "></div>
        ${count > 1 ? `<span style="
          position:absolute;top:-4px;right:-4px;
          background:#E8761A;color:white;
          font-size:9px;font-weight:700;
          border-radius:50%;width:14px;height:14px;
          display:flex;align-items:center;justify-content:center;
          border:1.5px solid white;
          font-family:Inter,sans-serif;
          line-height:1;
        ">${count > 9 ? "9+" : count}</span>` : ""}
      </div>
    `,
  });
}

const userLocationIcon = L.divIcon({
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  html: `
    <div style="
      width:20px;height:20px;
      background:#E8761A;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 0 4px rgba(232,118,26,0.25);
    "></div>
  `,
});

const DEFAULT_CENTER = { lat: -23.55, lng: -46.63 }; // São Paulo

export default function HeroMap() {
  const [loadingState, setLoadingState] = useState<"loading" | "ready" | "error">("loading");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [geoGranted, setGeoGranted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // 1. Get user geolocation
      let coords = DEFAULT_CENTER;
      let granted = false;

      if ("geolocation" in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 8000,
              maximumAge: 300000,
            });
          });
          coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          granted = true;
        } catch {
          // denied or unavailable — use default
        }
      }

      if (cancelled) return;
      setUserCoords(coords);
      setGeoGranted(granted);

      // 2. Fetch professionals
      let professionals: MapProfessional[] = [];
      try {
        const res = await fetch("/api/map-professionals");
        if (!res.ok) throw new Error("fetch failed");
        professionals = await res.json();
      } catch {
        if (!cancelled) setLoadingState("error");
        return;
      }

      if (cancelled) return;

      // 3. Deduplicate by city+state (top 30 by count)
      const cityMap = new Map<string, MapProfessional[]>();
      for (const p of professionals) {
        const key = `${p.city.toLowerCase()},${p.state.toLowerCase()}`;
        if (!cityMap.has(key)) cityMap.set(key, []);
        cityMap.get(key)!.push(p);
      }

      const sorted = [...cityMap.entries()]
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 30);

      const toGeocode = sorted.map(([key]) => {
        return {
          city: sorted.find(([k]) => k === key)![1][0].city,
          state: sorted.find(([k]) => k === key)![1][0].state,
        };
      });

      // 4. Geocode cities
      const coordsMap = await geocodeCitiesBatched(toGeocode);

      if (cancelled) return;

      // 5. Build markers
      const built: MarkerData[] = [];
      for (const [key, profs] of sorted) {
        const [city, state] = key.split(",");
        const geocodeKey = `${city},${state}`;
        const c = coordsMap.get(geocodeKey);
        if (c) {
          built.push({ lat: c.lat, lng: c.lng, professionals: profs });
        }
      }

      setMarkers(built);
      setLoadingState("ready");
    }

    init();
    return () => { cancelled = true; };
  }, []);

  if (loadingState === "error") {
    return (
      <div className="absolute inset-0 bg-white/5 flex flex-col items-center justify-center gap-2">
        <MapPin size={28} className="text-blue-400/50" />
        <span className="text-blue-300/60 text-sm">Não foi possível carregar o mapa</span>
      </div>
    );
  }

  if (loadingState === "loading") {
    return (
      <div className="absolute inset-0 bg-gray-100 animate-pulse flex flex-col items-center justify-center gap-2">
        <MapPin size={28} className="text-gray-300" />
        <span className="text-gray-400 text-sm">Carregando mapa...</span>
      </div>
    );
  }

  const zoom = geoGranted ? 13 : 10;

  return (
    <MapContainer
      center={[userCoords.lat, userCoords.lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        eventHandlers={{
          tileload: (event) => {
            const tile = (event as { tile?: HTMLImageElement }).tile;
            if (tile) {
              tile.alt = "";
              tile.setAttribute("aria-hidden", "true");
            }
          },
        }}
      />

      {/* User location marker */}
      {geoGranted && (
        <Marker position={[userCoords.lat, userCoords.lng]} icon={userLocationIcon}>
          <Popup>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1A2B4A" }}>
              Sua localização
            </span>
          </Popup>
        </Marker>
      )}

      {/* Professional markers */}
      {markers.map((m, i) => (
        <Marker
          key={i}
          position={[m.lat, m.lng]}
          icon={createProfessionalIcon(m.professionals.length)}
        >
          <Popup>
            <div dangerouslySetInnerHTML={{ __html: buildPopupHtml(m.professionals) }} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
