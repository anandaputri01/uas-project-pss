import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const go = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const linkClass = 'hover:text-brand-500 transition';

  return (
    <nav className="bg-brand-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => go('/')}
          onKeyDown={(e) => e.key === 'Enter' && go('/')}
          role="button"
          tabIndex={0}
        >
          <i className="fas fa-helmet-safety text-2xl text-brand-500" />
          <span className="text-xl font-bold tracking-wider">HelmetWash</span>
        </div>

        <button
          type="button"
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars text-xl" />
        </button>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className={linkClass}>Beranda</Link>
          <Link to="/services" className={linkClass}>Layanan</Link>
          <Link to="/order" className={linkClass}>Pesan Sekarang</Link>
          <Link to="/track" className={linkClass}>Lacak Order</Link>
          <Link to="/admin" className="bg-brand-600 px-4 py-1 rounded hover:bg-brand-500 transition">Admin</Link>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-brand-800 px-4 py-2">
          <button type="button" onClick={() => go('/')} className="block w-full text-left py-2 hover:text-brand-500">Beranda</button>
          <button type="button" onClick={() => go('/services')} className="block w-full text-left py-2 hover:text-brand-500">Layanan</button>
          <button type="button" onClick={() => go('/order')} className="block w-full text-left py-2 hover:text-brand-500">Pesan Sekarang</button>
          <button type="button" onClick={() => go('/track')} className="block w-full text-left py-2 hover:text-brand-500">Lacak Order</button>
          <button type="button" onClick={() => go('/admin')} className="block w-full text-left py-2 text-brand-500 font-bold">Admin</button>
        </div>
      )}
    </nav>
  );
}
