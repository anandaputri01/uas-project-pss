import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useCatalog } from '../context/AppContext';
import { ORDER_STEPS, getStatusColor } from '../data/constants';
import { api } from '../lib/api';
import { utils } from '../lib/utils';

// ─── Pagination Component ────────────────────────────────────────────────────
function Pagination({ total, pageSize, page, onPage, onPageSize }) {
  const pageSizes = [5, 10, 15, 20, 30, 40, 50];
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = [];

  let start = Math.max(1, page - 2);
  let end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 px-1">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Tampilkan</span>
        <select
          value={pageSize}
          onChange={(e) => { onPageSize(Number(e.target.value)); onPage(1); }}
          className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
        >
          {pageSizes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <span>data per halaman &bull; Total <strong>{total}</strong></span>
      </div>
      <div className="flex items-center gap-1">
        <PagBtn onClick={() => onPage(1)} disabled={page === 1} label="«" />
        <PagBtn onClick={() => onPage(page - 1)} disabled={page === 1} label="‹" />
        {pages.map((p) => (
          <PagBtn key={p} onClick={() => onPage(p)} active={p === page} label={p} />
        ))}
        <PagBtn onClick={() => onPage(page + 1)} disabled={page === totalPages} label="›" />
        <PagBtn onClick={() => onPage(totalPages)} disabled={page === totalPages} label="»" />
      </div>
    </div>
  );
}

function PagBtn({ onClick, disabled, label, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 rounded-lg text-sm font-medium transition
        ${active ? 'bg-brand-600 text-white shadow' : ''}
        ${!active && !disabled ? 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50' : ''}
        ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : ''}
      `}
    >
      {label}
    </button>
  );
}

// ─── Service Form Modal ───────────────────────────────────────────────────────
function ServiceModal({ service, onSave, onClose }) {
  const isNew = !service?.id || service.id.startsWith('__new');
  const [form, setForm] = useState({
    id: service?.id || '',
    name: service?.name || '',
    price: service?.price ?? 0,
    desc: service?.desc || service?.description || '',
    features: (service?.features || []).join('\n'),
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id.trim() || !form.name.trim()) return;
    onSave({
      id: form.id.trim(),
      name: form.name.trim(),
      price: parseInt(form.price || 0, 10),
      desc: form.desc.trim(),
      features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-brand-900 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">
            <i className={`fas ${isNew ? 'fa-plus-circle' : 'fa-edit'} mr-2`} />
            {isNew ? 'Tambah Layanan' : 'Edit Layanan'}
          </h3>
          <button type="button" onClick={onClose} className="hover:text-brand-300 transition">
            <i className="fas fa-times text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">ID / Slug *</label>
              <input
                value={form.id}
                onChange={(e) => set('id', e.target.value)}
                placeholder="misal: fast, steril, deep"
                required
                disabled={!isNew}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Harga (Rp) *</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Nama Layanan *</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="misal: Fast Clean"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Deskripsi</label>
            <input
              value={form.desc}
              onChange={(e) => set('desc', e.target.value)}
              placeholder="Deskripsi singkat layanan"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Fitur <span className="text-gray-400 normal-case font-normal">(satu per baris)</span>
            </label>
            <textarea
              value={form.features}
              onChange={(e) => set('features', e.target.value)}
              rows={4}
              placeholder={"Cuci Shell Luar\nVakum Debu\nPewangi Standar"}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
              Batal
            </button>
            <button type="submit"
              className="px-5 py-2 rounded-lg bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition">
              <i className="fas fa-save mr-2" />Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Addon Form Modal ─────────────────────────────────────────────────────────
function AddonModal({ addon, onSave, onClose }) {
  const isNew = !addon?.id || addon.id.startsWith('__new');
  const [form, setForm] = useState({
    id: addon?.id || '',
    name: addon?.name || '',
    price: addon?.price ?? 0,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id.trim() || !form.name.trim()) return;
    onSave({
      id: form.id.trim(),
      name: form.name.trim(),
      price: parseInt(form.price || 0, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="bg-brand-900 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">
            <i className={`fas ${isNew ? 'fa-plus-circle' : 'fa-edit'} mr-2`} />
            {isNew ? 'Tambah Addon' : 'Edit Addon'}
          </h3>
          <button type="button" onClick={onClose} className="hover:text-brand-300 transition">
            <i className="fas fa-times text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">ID / Slug *</label>
            <input
              value={form.id}
              onChange={(e) => set('id', e.target.value)}
              placeholder="misal: pewangi"
              required
              disabled={!isNew}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Nama Addon *</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="misal: Pewangi Premium"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Harga (Rp) *</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
              Batal
            </button>
            <button type="submit"
              className="px-5 py-2 rounded-lg bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition">
              <i className="fas fa-save mr-2" />Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-exclamation-triangle text-2xl text-red-500" />
        </div>
        <p className="text-gray-700 font-medium mb-6">{message}</p>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition">
            Batal
          </button>
          <button type="button" onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderDetailModal({ order, addons, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-brand-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-lg"><i className="fas fa-receipt mr-2" /> Detail Pesanan {order.id}</h3>
          <button type="button" onClick={onClose} className="hover:text-brand-300 transition">
            <i className="fas fa-times text-xl" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 mb-1">Nama Pelanggan</p>
              <p className="font-semibold text-gray-800">{order.customerName}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Nomor HP</p>
              <p className="font-semibold text-gray-800">{order.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 mb-1">Alamat</p>
              <p className="font-semibold text-gray-800">{order.address || '-'}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-bold text-gray-800 mb-3">Informasi Pembayaran</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 mb-1">Metode Pembayaran</p>
                <p className="font-semibold text-gray-800 uppercase">{order.payment?.method || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Status Pembayaran</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                  order.payment?.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.payment?.status === 'paid' ? 'LUNAS' : (order.payment?.status || 'BELUM DIBAYAR')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-bold text-gray-800 mb-3">Detail Layanan</h4>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">{order.serviceName}</p>
              <p className="font-semibold">{utils.formatCurrency(order.priceBase)}</p>
            </div>
            {order.addons?.length > 0 && order.addons.map(aid => {
              const addon = addons.find(a => a.id === aid);
              if (!addon) return null;
              return (
                <div key={aid} className="flex justify-between items-center mb-2 text-gray-600">
                  <p>+ {addon.name}</p>
                  <p>{utils.formatCurrency(addon.price)}</p>
                </div>
              );
            })}
            {order.deliveryName && (
              <div className="flex justify-between items-center mb-2 text-gray-600">
                <p>Pengiriman: {order.deliveryName}</p>
                <p>{utils.formatCurrency(order.priceDelivery)}</p>
              </div>
            )}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <p className="font-bold text-gray-800 text-base">Total Harga</p>
              <p className="font-bold text-brand-600 text-lg">{utils.formatCurrency(order.totalPrice)}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-bold text-gray-800 mb-3">Riwayat Status</h4>
            <div className="space-y-3">
              {(order.history || []).map((h, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500 mt-1.5" />
                    {i !== order.history.length - 1 && <div className="w-0.5 h-full bg-brand-100 my-1" />}
                  </div>
                  <div className="pb-2">
                    <p className="font-semibold text-gray-800">{h.status}</p>
                    <p className="text-xs text-gray-500">{utils.formatDate(h.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPage() {
  return <AdminDashboard />;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { addons, refreshCatalog, setServicesLocal } = useCatalog();

  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(null); // order id being saved

  // ── Orders filter/pagination state ──
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [orderPage, setOrderPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ── Services pagination state ──
  const [searchService, setSearchService] = useState('');
  const [svcPage, setSvcPage] = useState(1);
  const [svcPageSize, setSvcPageSize] = useState(10);

  // ── Service CRUD modals ──
  const [svcModal, setSvcModal] = useState(null); // null | service obj
  const [deleteConfirm, setDeleteConfirm] = useState(null); // null | service id

  // ── Addons filter/pagination state ──
  const [searchAddon, setSearchAddon] = useState('');
  const [addonPage, setAddonPage] = useState(1);
  const [addonPageSize, setAddonPageSize] = useState(10);
  const [addonModal, setAddonModal] = useState(null);
  const [deleteAddonConfirm, setDeleteAddonConfirm] = useState(null);

  // ── Active Tab ──
  const [activeTab, setActiveTab] = useState('orders');

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, servicesData] = await Promise.all([
        api.getAdminOrders(),
        api.getServices(),
      ]);
      setOrders(ordersData);
      setServices(servicesData);
      setServicesLocal(servicesData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ─── Computed stats ───────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const stats = [
    { label: 'Total Pesanan', value: orders.length, icon: 'fa-list-alt', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Pendapatan', value: utils.formatCurrency(totalRevenue), icon: 'fa-coins', color: 'bg-green-50 text-green-600' },
    { label: 'Selesai', value: orders.filter((o) => o.status === 'Selesai').length, icon: 'fa-check-circle', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Diproses', value: orders.filter((o) => ['Diterima', 'Dicuci'].includes(o.status)).length, icon: 'fa-spinner', color: 'bg-yellow-50 text-yellow-600' },
  ];

  // ─── Orders filtering + pagination ───────────────────────────────────────
  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const matchSearch = !q ||
        o.id?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.phone?.toLowerCase().includes(q);
      const matchStatus = !filterStatus || o.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, search, filterStatus]);

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * orderPageSize;
    return filteredOrders.slice(start, start + orderPageSize);
  }, [filteredOrders, orderPage, orderPageSize]);

  // Reset to page 1 on filter change
  const handleSearch = (v) => { setSearch(v); setOrderPage(1); };
  const handleFilterStatus = (v) => { setFilterStatus(v); setOrderPage(1); };

  // ─── Services pagination ──────────────────────────────────────────────────
  const filteredServices = useMemo(() => {
    const q = searchService.toLowerCase();
    return services.filter((s) => !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
  }, [services, searchService]);

  const paginatedServices = useMemo(() => {
    const start = (svcPage - 1) * svcPageSize;
    return filteredServices.slice(start, start + svcPageSize);
  }, [filteredServices, svcPage, svcPageSize]);

  const handleSearchService = (v) => { setSearchService(v); setSvcPage(1); };

  // ─── Addons pagination ──────────────────────────────────────────────────
  const filteredAddons = useMemo(() => {
    const q = searchAddon.toLowerCase();
    return addons.filter((a) => !q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
  }, [addons, searchAddon]);

  const paginatedAddons = useMemo(() => {
    const start = (addonPage - 1) * addonPageSize;
    return filteredAddons.slice(start, start + addonPageSize);
  }, [filteredAddons, addonPage, addonPageSize]);

  const handleSearchAddon = (v) => { setSearchAddon(v); setAddonPage(1); };

  // ─── Order actions ────────────────────────────────────────────────────────
  const handleUpdateStatus = async (id, newStatus) => {
    if (!newStatus) return;
    setSavingStatus(id);
    try {
      await api.updateOrderStatus(id, newStatus);
      await loadData();
    } finally {
      setSavingStatus(null);
    }
  };

  // ─── Service CRUD ─────────────────────────────────────────────────────────
  const handleSaveService = async (svcData) => {
    const isNew = !svcModal?.id || svcModal.id.startsWith('__new');
    if (isNew) {
      const updated = [...services, svcData];
      await api.syncServices(updated);
      setServices(updated);
      setServicesLocal(updated);
    } else {
      const updated = services.map((s) => s.id === svcData.id ? svcData : s);
      await api.syncServices(updated);
      setServices(updated);
      setServicesLocal(updated);
    }
    await refreshCatalog();
    setSvcModal(null);
  };

  const handleDeleteService = async (id) => {
    const updated = services.filter((s) => s.id !== id);
    await api.syncServices(updated);
    setServices(updated);
    setServicesLocal(updated);
    await refreshCatalog();
    setDeleteConfirm(null);
  };

  // ─── Addon CRUD ─────────────────────────────────────────────────────────
  const handleSaveAddon = async (addonData) => {
    const isNew = !addonModal?.id || addonModal.id.startsWith('__new');
    let updated;
    if (isNew) {
      updated = [...addons, addonData];
    } else {
      updated = addons.map((a) => a.id === addonData.id ? addonData : a);
    }
    await api.syncAddons(updated);
    await refreshCatalog();
    setAddonModal(null);
  };

  const handleDeleteAddon = async (id) => {
    const updated = addons.filter((a) => a.id !== id);
    await api.syncAddons(updated);
    await refreshCatalog();
    setDeleteAddonConfirm(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <i className="fas fa-spinner fa-spin text-4xl mb-4 text-brand-500" />
        <p className="text-sm">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modals */}
      {svcModal !== null && (
        <ServiceModal
          service={svcModal}
          onSave={handleSaveService}
          onClose={() => setSvcModal(null)}
        />
      )}
      {deleteConfirm !== null && (
        <ConfirmDialog
          message="Yakin ingin menghapus layanan ini? Tindakan tidak dapat dibatalkan."
          onConfirm={() => handleDeleteService(deleteConfirm)}
          onClose={() => setDeleteConfirm(null)}
        />
      )}
      {addonModal !== null && (
        <AddonModal
          addon={addonModal}
          onSave={handleSaveAddon}
          onClose={() => setAddonModal(null)}
        />
      )}
      {deleteAddonConfirm !== null && (
        <ConfirmDialog
          message="Yakin ingin menghapus tambahan layanan ini?"
          onConfirm={() => handleDeleteAddon(deleteAddonConfirm)}
          onClose={() => setDeleteAddonConfirm(null)}
        />
      )}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          addons={addons}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Header */}
      <div className="bg-brand-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Admin</h1>
            <p className="text-brand-300 text-sm mt-0.5">
              <i className="fas fa-user-circle mr-1" />
              {user?.name || 'Admin'} &bull; HelmetWash
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-700 hover:bg-brand-600 text-sm font-medium transition"
            >
              <i className="fas fa-chart-line" /> Laporan
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium transition"
            >
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.color}`}>
                <i className={`fas ${s.icon}`} />
              </div>
              <div>
                <div className="font-bold text-gray-800 text-sm leading-tight">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm overflow-x-auto">
          {[
            { id: 'orders', icon: 'fa-list-alt', label: 'Pesanan' },
            { id: 'services', icon: 'fa-concierge-bell', label: 'Layanan' },
            { id: 'addons', icon: 'fa-plus-square', label: 'Tambahan Layanan' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap
                ${activeTab === tab.id ? 'bg-brand-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <i className={`fas ${tab.icon}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: ORDERS ──────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Filter Bar */}
            <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-48">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Cari ID, nama, atau telepon..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => handleFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="">Semua Status</option>
                {ORDER_STEPS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {(search || filterStatus) && (
                <button
                  type="button"
                  onClick={() => { handleSearch(''); handleFilterStatus(''); }}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition"
                >
                  <i className="fas fa-times-circle" /> Reset
                </button>
              )}
              <button
                type="button"
                onClick={loadData}
                className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <i className="fas fa-sync-alt" /> Refresh
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="px-4 py-3">ID & Tanggal</th>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Detail Order</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                    <th className="px-4 py-3 text-center">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-gray-400">
                        <i className="fas fa-inbox text-4xl block mb-3" />
                        {search || filterStatus ? 'Tidak ada pesanan yang cocok.' : 'Belum ada pesanan masuk.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="font-bold text-brand-600 font-mono text-xs">{o.id}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{utils.formatDate(o.date)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-800">{o.customerName}</div>
                          <div className="text-xs text-gray-500">{o.phone}</div>
                          {o.address && o.address !== '-' && (
                            <div className="text-xs text-gray-400 mt-0.5 max-w-[140px] truncate" title={o.address}>
                              <i className="fas fa-map-marker-alt text-red-400 mr-1" />{o.address}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{o.serviceName}</div>
                          {o.addons?.length > 0 && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              + {o.addons.map((aid) => addons.find((a) => a.id === aid)?.name).filter(Boolean).join(', ')}
                            </div>
                          )}
                          {o.deliveryName && (
                            <div className="text-xs text-gray-400 italic mt-0.5">{o.deliveryName}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-700 whitespace-nowrap">
                          {utils.formatCurrency(o.totalPrice)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(o)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            title="Detail"
                          >
                            <i className="fas fa-eye text-sm" />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {savingStatus === o.id ? (
                            <i className="fas fa-spinner fa-spin text-brand-500" />
                          ) : (
                            <select
                              defaultValue=""
                              onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                              className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-brand-500 outline-none w-28"
                            >
                              <option value="" disabled>Ubah ke...</option>
                              {ORDER_STEPS.map((s) => (
                                <option key={s} value={s} disabled={s === o.status}>{s}</option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 pb-4 border-t border-gray-100 pt-3">
              <Pagination
                total={filteredOrders.length}
                page={orderPage}
                pageSize={orderPageSize}
                onPage={setOrderPage}
                onPageSize={setOrderPageSize}
              />
            </div>
          </div>
        )}

        {/* ── TAB: SERVICES ────────────────────────────────────────────────── */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="font-bold text-gray-800">Kelola Layanan & Harga</h3>
                <p className="text-xs text-gray-400 mt-0.5">Tambah, edit, atau hapus layanan yang tersedia</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-48">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={searchService}
                    onChange={(e) => handleSearchService(e.target.value)}
                    placeholder="Cari layanan..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                {searchService && (
                  <button
                    type="button"
                    onClick={() => handleSearchService('')}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition mr-2"
                  >
                    <i className="fas fa-times-circle" /> Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSvcModal({ id: '__new_' + Date.now(), name: '', price: 0, desc: '', features: [] })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition"
                >
                  <i className="fas fa-plus" /> Tambah Layanan
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="px-4 py-3">ID / Slug</th>
                    <th className="px-4 py-3">Nama Layanan</th>
                    <th className="px-4 py-3">Harga</th>
                    <th className="px-4 py-3">Deskripsi</th>
                    <th className="px-4 py-3">Fitur</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedServices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-gray-400">
                        <i className="fas fa-concierge-bell text-4xl block mb-3" />
                        Belum ada layanan. Klik Tambah Layanan untuk mulai.
                      </td>
                    </tr>
                  ) : (
                    paginatedServices.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 transition group">
                        <td className="px-4 py-3">
                          <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{s.id}</code>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{s.name}</td>
                        <td className="px-4 py-3 font-bold text-brand-600 whitespace-nowrap">
                          {utils.formatCurrency(s.price)}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-[200px]">
                          <span className="line-clamp-2 text-xs">{s.desc || s.description || '-'}</span>
                        </td>
                        <td className="px-4 py-3">
                          {(s.features || []).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {(s.features || []).slice(0, 2).map((f, i) => (
                                <span key={i} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{f}</span>
                              ))}
                              {(s.features || []).length > 2 && (
                                <span className="text-xs text-gray-400">+{(s.features || []).length - 2} lagi</span>
                              )}
                            </div>
                          ) : <span className="text-gray-400 text-xs">-</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2 transition">
                            <button
                              type="button"
                              onClick={() => setSvcModal(s)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                              title="Edit"
                            >
                              <i className="fas fa-edit text-sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(s.id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                              title="Hapus"
                            >
                              <i className="fas fa-trash text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 pb-4 border-t border-gray-100 pt-3">
              <Pagination
                total={filteredServices.length}
                page={svcPage}
                pageSize={svcPageSize}
                onPage={setSvcPage}
                onPageSize={setSvcPageSize}
              />
            </div>
          </div>
        )}

        {/* ── TAB: ADDONS ────────────────────────────────────────────────── */}
        {activeTab === 'addons' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="font-bold text-gray-800">Kelola Tambahan Layanan</h3>
                <p className="text-xs text-gray-400 mt-0.5">Tambah, edit, atau hapus tambahan layanan (addons)</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-48">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={searchAddon}
                    onChange={(e) => handleSearchAddon(e.target.value)}
                    placeholder="Cari tambahan layanan..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                {searchAddon && (
                  <button
                    type="button"
                    onClick={() => handleSearchAddon('')}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition mr-2"
                  >
                    <i className="fas fa-times-circle" /> Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAddonModal({ id: '__new_' + Date.now(), name: '', price: 0 })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-bold hover:bg-brand-700 transition"
                >
                  <i className="fas fa-plus" /> Tambah Addon
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                    <th className="px-4 py-3">ID / Slug</th>
                    <th className="px-4 py-3">Nama Tambahan</th>
                    <th className="px-4 py-3">Harga</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedAddons.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-gray-400">
                        <i className="fas fa-plus-square text-4xl block mb-3" />
                        Belum ada tambahan layanan.
                      </td>
                    </tr>
                  ) : (
                    paginatedAddons.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition group">
                        <td className="px-4 py-3">
                          <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{a.id}</code>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{a.name}</td>
                        <td className="px-4 py-3 font-bold text-brand-600 whitespace-nowrap">
                          {utils.formatCurrency(a.price)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2 transition">
                            <button
                              type="button"
                              onClick={() => setAddonModal(a)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                              title="Edit"
                            >
                              <i className="fas fa-edit text-sm" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteAddonConfirm(a.id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                              title="Hapus"
                            >
                              <i className="fas fa-trash text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 pb-4 border-t border-gray-100 pt-3">
              <Pagination
                total={filteredAddons.length}
                page={addonPage}
                pageSize={addonPageSize}
                onPage={setAddonPage}
                onPageSize={setAddonPageSize}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
