import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(orderId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-8">
          <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-4xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Pembayaran Diterima!</h1>
          <p className="text-green-100 text-sm mt-1">Pesanan kamu sedang diproses</p>
        </div>

        <div className="p-7">
          <p className="text-gray-500 text-sm mb-5">
            Simpan kode di bawah ini — kode ini adalah <strong>nomor pesanan sekaligus kode tracking</strong> kamu.
          </p>

          {/* Order / Tracking Code */}
          <div
            className="relative bg-brand-50 border-2 border-brand-200 p-6 rounded-2xl mb-2 cursor-pointer group transition hover:border-brand-400"
            onClick={copyCode}
            onKeyDown={(e) => e.key === 'Enter' && copyCode()}
            role="button"
            tabIndex={0}
            title="Klik untuk menyalin kode"
          >
            <p className="text-xs text-brand-500 uppercase font-bold tracking-widest mb-2">
              Nomor Pesanan & Kode Tracking
            </p>
            <p className="text-3xl font-mono font-extrabold text-brand-700 tracking-widest break-all">
              {orderId}
            </p>
            <div className={`absolute inset-0 rounded-2xl flex items-center justify-center transition ${
              copied ? 'bg-green-500/90' : 'bg-white/80 opacity-0 group-hover:opacity-100'
            }`}>
              <span className={`font-bold flex items-center gap-2 text-sm ${copied ? 'text-white' : 'text-brand-600'}`}>
                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                {copied ? 'Kode Disalin!' : 'Klik untuk Salin'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            <i className="fas fa-info-circle mr-1" />Gunakan kode ini untuk lacak status helm kamu
          </p>

          {/* Steps Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Proses selanjutnya:</p>
            {[
              { icon: 'fa-box-open', text: 'Tim kami memproses pesananmu', color: 'text-blue-500' },
              { icon: 'fa-soap', text: 'Helm dicuci & disteilirisasi', color: 'text-purple-500' },
              { icon: 'fa-truck', text: 'Helm dikirim balik ke kamu', color: 'text-green-500' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <i className={`fas ${step.icon} w-5 text-center ${step.color}`} />
                {step.text}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate(`/track?code=${orderId}`)}
              className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-search" /> Lacak Pesanan Sekarang
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full text-gray-500 py-2 hover:text-gray-800 transition text-sm"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
