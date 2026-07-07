import { getStatusColor } from '../data/constants';
import { useCatalog } from '../context/AppContext';

export default function TrackResult({ order }) {
  const { addons: catalogAddons, orderSteps } = useCatalog();
  const addonList = catalogAddons;
  const steps = orderSteps.length ? orderSteps : ['Diterima', 'Dicuci', 'Selesai', 'Diantar'];
  const currentIdx = steps.indexOf(order.status);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6 animate-fade-in border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-gray-800">Status Pesanan</h3>
          <p className="text-sm text-gray-500 font-mono">ID: {order.id}</p>
        </div>
        <div className="text-left md:text-right">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)} shadow-sm`}>
            {order.status}
          </span>
          {order.history?.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Update Terakhir: {new Date(order.history[order.history.length - 1].date).toLocaleString('id-ID')}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold">Layanan</p>
          <p className="font-semibold text-gray-800">{order.serviceName}</p>
          {order.addons?.length > 0 && (
            <p className="text-xs text-gray-600">
              + {order.addons.map((aid) => addonList.find((a) => a.id === aid)?.name).join(', ')}
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold">Metode</p>
          <p className="font-semibold text-gray-800">{order.deliveryName}</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 -z-10" />
        <div className="flex justify-between text-center">
          {steps.map((step, idx) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all duration-500 border-4 border-white
                  ${idx <= currentIdx ? 'bg-brand-600 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-400'}`}
              >
                <i className={`fas ${idx <= currentIdx ? 'fa-check' : 'fa-circle'}`} />
              </div>
              <span className={`text-xs font-medium ${idx <= currentIdx ? 'text-brand-600' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
