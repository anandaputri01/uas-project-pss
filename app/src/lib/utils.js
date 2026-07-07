export const utils = {
  formatCurrency(num) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  },

  generateId() {
    return 'ORD-' + Math.floor(10000 + Math.random() * 90000);
  },

  formatDate(isoString) {
    return new Date(isoString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  },
};

export function calcBudgetCurveY(value, max, height = 110) {
  return height - Math.round((value / max) * 90);
}
