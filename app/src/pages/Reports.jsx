import { useEffect, useState } from 'react';
import { useAuth, useCatalog } from '../context/AppContext';
import { api } from '../lib/api';
import { utils } from '../lib/utils';
import Login from './Login';
// Impor komponen dari recharts
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

export default function ReportsPage() {
  const { isAdmin, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        <span className="ml-3 text-gray-500 font-medium">Memuat autentikasi...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Login />;
  }

  return <Reports />;
}

function Reports() {
  const { addons, deliveryOptions } = useCatalog();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReports()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        <span className="ml-3 text-gray-500 font-medium">Memuat data laporan...</span>
      </div>
    );
  }

  const { summary, byService, byDelivery, byStatus, addonUsage, byDate } = data;

  // Custom Tooltip untuk Grafik Pendapatan agar formatnya Rupiah/Mata Uang yang pas
  const CustomTooltipCurrency = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-sm">
          <p className="text-xs text-gray-500 font-medium">{payload[0].payload.date || payload[0].payload.name}</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">
            {utils.formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      
      {/* HEADER & TOP NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Laporan Helmet Wash</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau performa penjualan, layanan, dan metrik operasional harian.</p>
        </div>
        <div>
          <a 
            href="/admin" 
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Admin
          </a>
        </div>
      </div>

      {/* HIGHLIGHT METRICS (KPI CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Pesanan</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{summary.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Pendapatan</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{utils.formatCurrency(summary.totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10m9-.5V11a2 2 0 00-2-2h-2a2 2 0 00-2 2v10m9.5-12V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v12" /></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Rata-rata Transaksi</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{utils.formatCurrency(summary.avgOrder)}</p>
          </div>
        </div>
      </div>

      {/* PRIMARY CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TREN PENDAPATAN (AREA CHART) - MURNI PENDAPATAN PER TANGGAL */}
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
  <div className="flex justify-between items-start mb-2">
    <div>
      <h3 className="text-lg font-bold text-gray-900 flex items-center">
        <span className="w-2 h-4 bg-green-600 rounded mr-2 inline-block"></span>
        Tren Pendapatan Harian
      </h3>
      <p className="text-xs text-gray-400">Grafik total omset yang didapatkan pada tanggal tersebut.</p>
    </div>
  </div>
  
  <div className="w-full h-72 mt-4">
    <ResponsiveContainer width="100%" height="100%">
      {/* Langsung masukkan array byDate tanpa manipulasi penambahan akumulatif */}
      <AreaChart data={byDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF" 
          tickLine={false} 
          style={{ fontSize: '12px' }} 
        />
        {/* YAxis diaktifkan lagi dengan format ringkas (misal 500000 jadi Rp 500k) */}
        <YAxis 
          stroke="#9CA3AF" 
          tickLine={false} 
          style={{ fontSize: '11px' }}
          tickFormatter={(value) => ` ${value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : (value / 1000).toFixed(0) + 'k'}`}
        />
        <Tooltip content={<CustomTooltipCurrency />} />
        {/* dataKey menggunakan "revenue" asli dari objek tanggal tersebut */}
        <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>

        {/* PERFORMA LAYANAN (BAR CHART) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-4 bg-brand-600 rounded mr-2 inline-block"></span>
            Performa Pendapatan per Layanan
          </h3>
          <p className="text-xs text-gray-400 mb-6">Perbandingan nilai kontribusi omset dari tiap varian layanan.</p>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byService} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltipCurrency />} />
                <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* METRICS DETAIL & TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TABEL OPERASIONAL LOGISTIK */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-gray-500 mb-4">Logistik & Pengiriman</h4>
          <div className="space-y-3">
            {byDelivery.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  {deliveryOptions.find((d) => d.id === item.id)?.name || item.id}
                </span>
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100">
                  {item.count} Orders
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* POPULARITAS ADD-ONS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-gray-500 mb-4">Penggunaan Add-ons</h4>
          <div className="space-y-3">
            {addonUsage.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 truncate max-w-[160px]">
                  {addons.find((a) => a.id === item.id)?.name || item.id}
                </span>
                <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {item.count} × digunakan
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* STATUS OPERASIONAL */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-gray-500 mb-4">Status Transaksi</h4>
          <div className="space-y-3">
            {byStatus.map((item) => {
              const isDone = ['done', 'completed', 'selesai'].includes(item.status.toLowerCase());
              return (
                <div key={item.status} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${isDone ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {item.status}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{item.count} Transaksi</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}