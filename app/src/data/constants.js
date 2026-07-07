export const ORDER_STEPS = ['Diterima', 'Dicuci', 'Selesai', 'Diantar'];

export function getStatusColor(status) {
  switch (status) {
    case 'Diterima': return 'bg-gray-100 text-gray-600';
    case 'Dicuci': return 'bg-blue-100 text-blue-700';
    case 'Selesai': return 'bg-green-100 text-green-700';
    case 'Diantar': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}
