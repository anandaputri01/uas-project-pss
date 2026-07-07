import { useState } from 'react';
import TrackResult from '../components/TrackResult';
import { api } from '../lib/api';

export default function Track() {
  const [trackInput, setTrackInput] = useState('');
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    const id = trackInput.trim().toUpperCase();
    if (!id) return;

    setLoading(true);
    try {
      const found = await api.getOrder(id);
      setNotFound(null);
      setOrder(found);
    } catch {
      setOrder(null);
      setNotFound(id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-brand-900">Lacak Status Helm</h2>
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-2">Masukkan Kode Transaksi</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={trackInput}
            onChange={(e) => setTrackInput(e.target.value)}
            placeholder="Contoh: ORD-12345"
            className="flex-grow border p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none uppercase font-mono"
          />
          <button
            type="button"
            onClick={handleTrack}
            disabled={loading}
            className="bg-brand-600 text-white px-6 rounded-lg font-bold hover:bg-brand-700 transition disabled:opacity-60"
          >
            {loading ? '...' : 'Cari'}
          </button>
        </div>
      </div>

      {notFound && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mt-6 text-center animate-fade-in">
          <i className="fas fa-exclamation-circle mr-2" />
          Pesanan dengan ID <b>{notFound}</b> tidak ditemukan.
        </div>
      )}

      {order && <TrackResult order={order} />}
    </div>
  );
}
