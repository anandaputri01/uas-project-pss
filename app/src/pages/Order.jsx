import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BudgetCurve from '../components/BudgetCurve';
import { useCatalog } from '../context/AppContext';
import { api } from '../lib/api';
import { utils } from '../lib/utils';

export default function Order() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('service') || '';
  const { services, addons, deliveryOptions, loading } = useCatalog();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState(preselectedServiceId || '');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [deliveryId, setDeliveryId] = useState('none');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const servicePrice = serviceId ? (services.find((s) => s.id === serviceId)?.price || 0) : 0;
  const addonsPrice = selectedAddons.reduce((sum, id) => sum + (addons.find((a) => a.id === id)?.price || 0), 0);
  const deliveryPrice = deliveryOptions.find((d) => d.id === deliveryId)?.price || 0;
  const total = servicePrice + addonsPrice + deliveryPrice;
  const showAddress = deliveryId !== 'none';

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const service = services.find((s) => s.id === serviceId);
    const delivery = deliveryOptions.find((d) => d.id === deliveryId);
    if (!service || !delivery) return;

    const orderData = {
      customerName: name,
      phone,
      serviceId,
      addons: selectedAddons,
      deliveryId,
      address: address || '-',
    };

    const orderSummary = {
      customerName: name,
      serviceName: service.name,
      addonsLabel: selectedAddons.map((id) => addons.find((a) => a.id === id)?.name).filter(Boolean).join(', ') || null,
      deliveryName: delivery.name,
      total,
    };

    navigate(`/order/pay/new`, { state: { orderData, orderSummary } });
  };


  if (loading) {
    return <div className="text-center py-20 text-gray-500">Memuat formulir...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-brand-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Formulir Pemesanan</h2>
          <p className="text-brand-100 text-sm mt-1">Lengkapi data untuk estimasi biaya otomatis</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">1. Data Pelanggan</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="08..."
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">2. Pilih Layanan</h3>
            <div className="grid md:grid-cols-1 gap-4">
              {services.map((s) => (
                <label
                  key={s.id}
                  className={`relative flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition ${s.id === serviceId ? 'ring-2 ring-brand-500 bg-brand-50' : ''}`}
                >
                  <input
                    type="radio"
                    name="serviceId"
                    value={s.id}
                    checked={serviceId === s.id}
                    onChange={() => setServiceId(s.id)}
                    required
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                  />
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">{s.name}</span>
                      <span className="font-bold text-brand-600">{utils.formatCurrency(s.price)}</span>
                    </div>
                    <p className="text-sm text-gray-500">{s.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">3. Tambahan (Opsional)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {addons.map((a) => (
                <label key={a.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(a.id)}
                    onChange={() => toggleAddon(a.id)}
                    className="h-4 w-4 text-brand-600 rounded focus:ring-brand-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">{a.name}</span>
                    <span className="block text-xs text-gray-500">+ {utils.formatCurrency(a.price)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">4. Pengiriman</h3>
            <select
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
            >
              {deliveryOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.price > 0 ? `(+ ${utils.formatCurrency(d.price)})` : ''}
                </option>
              ))}
            </select>
            {showAddress && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required={showAddress}
                  rows={2}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="Masukkan alamat penjemputan..."
                />
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal Layanan</span>
              <span className="font-mono">{utils.formatCurrency(servicePrice)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Add-ons</span>
              <span className="font-mono">{utils.formatCurrency(addonsPrice)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Pengiriman</span>
              <span className="font-mono">{utils.formatCurrency(deliveryPrice)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total Bayar</span>
              <span className="text-2xl font-extrabold text-brand-600">{utils.formatCurrency(total)}</span>
            </div>
          </div>

          

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition shadow-lg disabled:opacity-60"
          >
            {submitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
          </button>
        </form>
      </div>
    </div>
  );
}
