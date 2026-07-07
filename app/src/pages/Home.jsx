import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { useCatalog } from '../context/AppContext';

export default function Home() {
  const navigate = useNavigate();
  const { services, loading } = useCatalog();

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Memuat layanan...</div>;
  }

  return (
    <>
      <div className="relative bg-brand-900 text-white overflow-hidden rounded-b-[3rem] shadow-2xl mb-16">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center" />
        <div className="relative container mx-auto px-6 py-24 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-700 text-brand-100 text-sm font-semibold mb-4 animate-bounce">
            Promo Spesial: Diskon 10% Juli!
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Helm Bersih,
            <br />
            <span className="text-brand-400">Pikiran Jernih</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
            Solusi cuci helm berbasis teknologi pertama dengan standar sterilisasi medis UV-C & Ozone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => navigate('/order')}
              className="bg-brand-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-brand-400 hover:scale-105 transition transform shadow-lg ring-4 ring-brand-500/30"
            >
              Cuci Helm Sekarang <i className="fas fa-arrow-right ml-2" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/track')}
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-brand-900 transition transform hover:-translate-y-1"
            >
              Lacak Order
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-brand-900 mb-4">Pilihan Paket Hemat</h2>
          <p className="text-gray-500 text-lg">Transparan. Tanpa Biaya Tersembunyi.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((s, idx) => (
            <ServiceCard key={s.id} service={s} highlight={idx === 2} />
          ))}
        </div>
      </div>

      <div className="bg-brand-900 text-white rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Tahukah Anda?</h2>
            <p className="text-brand-100 text-lg mb-6">
              Helm yang tidak dicuci selama 6 bulan dapat mengandung bakteri 5x lebih banyak daripada dudukan toilet umum.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="bg-brand-700 p-2 rounded-lg mr-4"><i className="fas fa-bacteria text-yellow-400" /></span>
                <span>Penyebab jerawat & ketombe parah</span>
              </li>
              <li className="flex items-center">
                <span className="bg-brand-700 p-2 rounded-lg mr-4"><i className="fas fa-wind text-blue-300" /></span>
                <span>Bau apek mengganggu konsentrasi</span>
              </li>
            </ul>
          </div>
          <div className="hidden md:block text-center">
            <i className="fas fa-shield-virus text-9xl text-brand-700 opacity-50" />
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Lokasi Outlet Kami</h2>
        <p className="text-gray-500 mb-6">Kunjungi outlet terdekat atau gunakan layanan Pick-up</p>
        <button
          type="button"
          onClick={() => navigate('/locations')}
          className="text-brand-600 font-bold hover:underline"
        >
          Lihat Peta Lengkap <i className="fas fa-arrow-right ml-1" />
        </button>
      </div>
    </>
  );
}
