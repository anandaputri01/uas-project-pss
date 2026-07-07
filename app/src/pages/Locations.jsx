import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCatalog } from '../context/AppContext';

export default function Locations() {
  const { outlets, loading } = useCatalog();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (loading || !mapRef.current || mapInstance.current || outlets.length === 0) return;

    const map = L.map(mapRef.current).setView([-6.9930, 110.4200], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    outlets.forEach((o) => {
      L.marker([o.lat, o.lng]).addTo(map).bindPopup(`<b>${o.name}</b><br>${o.address}`);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [loading, outlets]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Memuat peta...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-brand-900">Lokasi Outlet</h2>
      <div ref={mapRef} className="w-full h-96 rounded-xl shadow-lg z-0 mb-8" />
      <div className="grid md:grid-cols-2 gap-6">
        {outlets.map((o) => (
          <div key={o.name} className="bg-white p-6 rounded-xl shadow border-l-4 border-brand-500">
            <h3 className="font-bold text-lg mb-2">{o.name}</h3>
            <p className="text-gray-600 mb-4">
              <i className="fas fa-map-marker-alt text-red-500 mr-2" />
              {o.address}
            </p>
            <div className="text-sm text-gray-500">
              <p><i className="far fa-clock mr-2" />Senin - Minggu: 09.00 - 20.00</p>
            </div>
            <div className="mt-4">
              <a
                href={`https://www.google.com/maps?q=${o.lat},${o.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700"
              >
                <i className="fas fa-location-arrow mr-2" /> Navigasi
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
