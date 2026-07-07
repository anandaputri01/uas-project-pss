import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { utils } from '../lib/utils';
import qrisImage from './qris/image.png';

const PAYMENT_METHODS = [
  {
    id: 'qris',
    label: 'QRIS',
    icon: 'fa-qrcode',
    desc: 'Scan QR dari semua e-wallet & mobile banking',
    color: 'text-purple-600 bg-purple-50',
    ring: 'ring-purple-500',
  },
  {
    id: 'bca',
    label: 'Transfer BCA',
    icon: 'fa-university',
    desc: 'No. Rek: 1234567890 a.n. HelmetWash',
    color: 'text-blue-600 bg-blue-50',
    ring: 'ring-blue-500',
  },
  {
    id: 'dana',
    label: 'DANA',
    icon: 'fa-wallet',
    desc: '081234567890 a.n. HelmetWash',
    color: 'text-sky-600 bg-sky-50',
    ring: 'ring-sky-500',
  },
  {
    id: 'gopay',
    label: 'GoPay',
    icon: 'fa-mobile-alt',
    desc: '081234567890 a.n. HelmetWash',
    color: 'text-green-600 bg-green-50',
    ring: 'ring-green-500',
  },
  
];



export default function Payment() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Order data passed via navigation state
  const orderSummary = location.state?.orderSummary || null;
  const orderData = location.state?.orderData || null;

  const [method, setMethod] = useState('qris');
  const [confirmed, setConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(null); // seconds
  const [createdOrderId, setCreatedOrderId] = useState(null);

  // If no order data, redirect to order page
  useEffect(() => {
    if (!orderData) navigate('/order', { replace: true });
  }, [orderData, navigate]);

  // Countdown timer for "waiting payment" simulation
  useEffect(() => {
    if (countdown === null || !createdOrderId) return;
    if (countdown <= 0) {
      navigate(`/order/success/${createdOrderId}`, { replace: true });
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, createdOrderId, navigate]);

  const handleConfirmPayment = async () => {
    setConfirmed(true);
    try {
      // Call backend to create order now that payment is confirmed
      const result = await api.createOrder({
        ...orderData,
        paymentMethod: method,
      });
      setCreatedOrderId(result.order.id);
      setCountdown(3);
    } catch (error) {
      alert(error.message);
      setConfirmed(false);
    }
  };

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === method);

  if (!orderData) return null;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-100 mb-3">
          <i className="fas fa-credit-card text-2xl text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Selesaikan Pembayaran</h1>
        <p className="text-gray-500 text-sm mt-1">Pilih metode pembayaran dan konfirmasi untuk mendapatkan kode tracking</p>
      </div>

      

      {/* Order Summary */}
      {orderSummary && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-5">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3">Ringkasan Pesanan</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Pelanggan</span>
              <span className="font-semibold text-gray-800">{orderSummary.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Layanan</span>
              <span className="font-semibold text-gray-800">{orderSummary.serviceName}</span>
            </div>
            {orderSummary.addonsLabel && (
              <div className="flex justify-between">
                <span>Tambahan</span>
                <span className="font-semibold text-gray-800">{orderSummary.addonsLabel}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pengiriman</span>
              <span className="font-semibold text-gray-800">{orderSummary.deliveryName}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-xl font-extrabold text-brand-600">{utils.formatCurrency(orderSummary.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="mb-5">
        <h3 className="font-bold text-gray-700 mb-3">Pilih Metode Pembayaran</h3>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                method === m.id
                  ? `border-brand-500 bg-brand-50`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymethod"
                value={m.id}
                checked={method === m.id}
                onChange={() => setMethod(m.id)}
                className="sr-only"
              />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${m.color}`}>
                <i className={`fas ${m.icon}`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{m.label}</p>
                <p className="text-xs text-gray-500">{m.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                method === m.id ? 'border-brand-600 bg-brand-600' : 'border-gray-300'
              }`}>
                {method === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* QRIS Preview */}
{method === 'qris' && (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 text-center shadow-sm">
    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
      Scan QR Code Berikut
    </p>

    <img
      src={qrisImage}
      alt="QRIS Code"
      className="w-52 h-52 mx-auto rounded-xl border border-gray-200 mb-3 object-contain"
    />

    <p className="text-xs text-gray-400">
      Berlaku untuk semua e-wallet & mobile banking
    </p>

    {orderSummary && (
      <p className="text-sm font-bold text-brand-600 mt-2">
        Nominal: {utils.formatCurrency(orderSummary.total)}
      </p>
    )}
  </div>
)}

      {/* Confirm Button */}
      {!confirmed ? (
        <button
          type="button"
          onClick={handleConfirmPayment}
          className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-base hover:bg-brand-700 transition shadow-lg flex items-center justify-center gap-2"
        >
          <i className="fas fa-check-circle" />
          Selesai
        </button>
      ) : (
        <div className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3">
          <i className="fas fa-spinner fa-spin" />
          Memverifikasi pembayaran{countdown !== null ? `... (${countdown}s)` : '...'}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-4">
        <i className="fas fa-shield-alt mr-1 text-green-500" />
        Kode tracking = Nomor pesanan kamu
      </p>
    </div>
  );
}
