import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { DataPoint, SCENARIOS } from '../types';

interface Props {
  data: DataPoint[];
}

export const PolarizationChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-2">
        <h3 className="text-lg font-bold text-slate-800">RDE Polarization</h3>
        <p className="text-sm text-slate-500">Observed Current (Mass Transport Corrected)</p>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
            <XAxis 
              dataKey="E_rhe" 
              type="number" 
              domain={[0.2, 1.1]} 
              tickCount={10}
              stroke="#64748b"
              label={{ value: 'Potential (V vs. RHE)', position: 'bottom', offset: 0, fill: '#475569' }}
            />
            <YAxis 
              domain={[-6, 0.5]} 
              stroke="#64748b"
              label={{ value: 'j (mA cm⁻²)', angle: -90, position: 'insideLeft', fill: '#475569' }}
            />
            <Tooltip 
              formatter={(value: number) => value.toFixed(3)}
              labelFormatter={(label: number) => `E = ${label.toFixed(2)} V`}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
            <Legend verticalAlign="top" height={36} iconType="plainline"/>

             {/* pH 1 */}
            <Line type="monotone" dataKey="ph1_jobs4" stroke={SCENARIOS[1].color} strokeWidth={2} dot={false} name="pH 1 (4e⁻)" />
            <Line type="monotone" dataKey="ph1_jobs2" stroke={SCENARIOS[1].color} strokeWidth={2} strokeDasharray="5 5" dot={false} name="pH 1 (2e⁻)" />

            {/* pH 7 */}
            <Line type="monotone" dataKey="ph7_jobs4" stroke={SCENARIOS[7].color} strokeWidth={2} dot={false} name="pH 7 (4e⁻)" />
            <Line type="monotone" dataKey="ph7_jobs2" stroke={SCENARIOS[7].color} strokeWidth={2} strokeDasharray="5 5" dot={false} name="pH 7 (2e⁻)" />

            {/* pH 13 */}
            <Line type="monotone" dataKey="ph13_jobs4" stroke={SCENARIOS[13].color} strokeWidth={2} dot={false} name="pH 13 (4e⁻)" />
            <Line type="monotone" dataKey="ph13_jobs2" stroke={SCENARIOS[13].color} strokeWidth={2} strokeDasharray="5 5" dot={false} name="pH 13 (2e⁻)" />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};