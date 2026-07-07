import { useNavigate } from 'react-router-dom';
import { utils } from '../lib/utils';

export default function ServiceCard({ service, highlight = false }) {
  const navigate = useNavigate();

  return (
    <div className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden flex flex-col">
      {highlight && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-brand-600 to-brand-400 text-white px-6 py-2 rounded-bl-2xl text-sm font-bold shadow-md">
          Best Seller
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-brand-600 transition">{service.name}</h3>
        <p className="text-gray-500 text-sm h-10">{service.desc}</p>
      </div>

      <div className="mb-8">
        <span className="text-5xl font-extrabold text-brand-900 tracking-tight">
          {utils.formatCurrency(service.price).replace(',00', '')}
        </span>
        <span className="text-gray-400 text-sm font-medium">/helm</span>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {(service.features || []).map((f) => (
          <li key={f} className="flex items-start text-gray-600 text-sm">
            <i className="fas fa-check-circle text-green-500 mt-1 mr-3" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => navigate(`/order?service=${service.id}`)}
        className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-brand-600 text-white hover:bg-brand-700 shadow-lg"
      >
        Pilih Paket
      </button>
    </div>
  );
}
