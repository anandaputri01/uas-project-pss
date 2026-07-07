import ServiceCard from '../components/ServiceCard';
import { useCatalog } from '../context/AppContext';

export default function Services() {
  const { services, loading } = useCatalog();

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Memuat layanan...</div>;
  }

  return (
    <div className="container mx-auto px-4 mb-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-brand-900 mb-4">Pilihan Paket</h2>
        <p className="text-gray-500 text-lg">Pilih paket yang sesuai, lanjutkan ke pemesanan</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
