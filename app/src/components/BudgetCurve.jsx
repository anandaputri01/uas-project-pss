import { calcBudgetCurveY } from '../lib/utils';

export default function BudgetCurve({ servicePrice, addonsPrice, deliveryPrice, total }) {
  const max = Math.max(servicePrice, addonsPrice, deliveryPrice, total, 1);
  const y = (v) => calcBudgetCurveY(v, max);

  const points = [
    { x: 10, y: y(servicePrice), label: 'Srv' },
    { x: 110, y: y(addonsPrice), label: 'Add' },
    { x: 210, y: y(deliveryPrice), label: 'Del' },
    { x: 290, y: y(total), label: 'Total' },
  ];

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <svg viewBox="0 0 300 120" className="w-full h-28">
        <polyline fill="none" stroke="#0284c7" strokeWidth="3" points={linePoints} />
        {points.slice(0, 3).map((p) => (
          <circle key={p.label} r="4" fill="#0ea5e9" cx={p.x} cy={p.y} />
        ))}
        <circle r="5" fill="#0c4a6e" cx={290} cy={points[3].y} />
        {points.map((p) => (
          <text key={p.label} x={p.x - 4} y="115" fontSize="10" fill="#64748b">{p.label}</text>
        ))}
      </svg>
    </div>
  );
}
