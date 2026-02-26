import React from 'react';
import { SimulationParams } from '../types';

interface Props {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}

export const ControlPanel: React.FC<Props> = ({ params, setParams }) => {
  const handleSiteChange = (site: keyof typeof params.site_distribution, value: number) => {
    setParams(prev => ({
      ...prev,
      site_distribution: {
        ...prev.site_distribution,
        [site]: value
      }
    }));
  };

  const handleChange = (field: keyof SimulationParams, value: number) => {
    setParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper component for continuous parameter input (Slider + Number Input)
  const ContinuousInput = ({ label, value, min, max, step, unit, onChange, subLabel }: any) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-medium text-slate-700 leading-tight">
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step / 10} // Allow 10x finer precision in text input than slider
            value={value}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onChange(val);
            }}
            className="w-20 text-right font-mono text-xs border border-slate-300 rounded px-1.5 py-0.5 text-indigo-700 font-bold focus:outline-none focus:border-indigo-500 bg-indigo-50/30"
          />
          <span className="text-xs text-slate-400 w-6">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500"
      />
      {subLabel && <p className="text-[10px] text-slate-400 mt-1">{subLabel}</p>}
    </div>
  );

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto flex flex-col gap-6">
      
      {/* 1. Hydrodynamics (Levich) */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          RDE & Transport (Levich)
        </h3>
        <ContinuousInput 
          label="Rotation Speed (ω)"
          value={params.rotation_speed} min={0} max={10000} step={10} unit="rpm"
          onChange={(v: number) => handleChange('rotation_speed', v)}
          subLabel="Controls diffusion layer thickness (δ)"
        />
        <ContinuousInput 
          label={<span>O<sub>2</sub> Solubility (C*)</span>}
          value={params.oxygen_concentration} min={0.1} max={5.0} step={0.05} unit="×"
          onChange={(v: number) => handleChange('oxygen_concentration', v)}
          subLabel="Electrolyte concentration effect"
        />
        <ContinuousInput 
          label="Diffusion Coeff. (D)"
          value={params.diffusion_coefficient} min={0.1} max={5.0} step={0.05} unit="×"
          onChange={(v: number) => handleChange('diffusion_coefficient', v)}
          subLabel="Viscosity dependent"
        />
      </section>

      <hr className="border-slate-100" />

      {/* 2. Reaction Environment */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
           Environment & Scan
        </h3>
        <ContinuousInput 
          label="Temperature (T)"
          value={params.temperature} min={200} max={400} step={1} unit="K"
          onChange={(v: number) => handleChange('temperature', v)}
        />
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
             <label className="block text-xs font-medium text-slate-600 mb-1">E<sub>start</sub> (V)</label>
             <input 
              type="number" step="0.01"
              value={params.scan_start} 
              onChange={(e) => handleChange('scan_start', parseFloat(e.target.value))}
              className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 font-mono focus:border-indigo-500 outline-none font-bold text-indigo-700 bg-indigo-50/30"
             />
          </div>
          <div className="flex-1">
             <label className="block text-xs font-medium text-slate-600 mb-1">E<sub>end</sub> (V)</label>
             <input 
              type="number" step="0.01"
              value={params.scan_end} 
              onChange={(e) => handleChange('scan_end', parseFloat(e.target.value))}
              className="w-full border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 font-mono focus:border-indigo-500 outline-none font-bold text-indigo-700 bg-indigo-50/30"
             />
          </div>
        </div>
      </section>

      <hr className="border-slate-100" />

      {/* 3. Intrinsic Kinetics */}
      <section>
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
           Microkinetics & Mechanism
        </h3>
        <ContinuousInput 
          label={<span>Pre-factor (j<sub>0</sub> Scale)</span>}
          value={params.j0_scaling} min={0.01} max={20.0} step={0.1} unit="×"
          onChange={(v: number) => handleChange('j0_scaling', v)}
          subLabel="Catalyst loading / Roughness factor"
        />
        <ContinuousInput 
          label="Adsorption Interaction (γ)"
          value={params.gamma_scaling} min={0.1} max={5.0} step={0.1} unit="×"
          onChange={(v: number) => handleChange('gamma_scaling', v)}
          subLabel="Langmuir/Frumkin isotherm shape"
        />
        <ContinuousInput 
          label={<span>DL Capacitance (C<sub>dl</sub>)</span>}
          value={params.capacitance_scaling} min={0.0} max={20.0} step={0.1} unit="×"
          onChange={(v: number) => handleChange('capacitance_scaling', v)}
          subLabel="Non-faradaic background current"
        />
      </section>

      <hr className="border-slate-100" />

      {/* 4. Active Sites */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          Active Site Distribution (DFT)
        </h3>
        {Object.entries(params.site_distribution).map(([site, val]) => (
          <div key={site} className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-slate-700 font-bold text-sm">{site}</span>
               <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={val as number}
                onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if(!isNaN(v)) handleSiteChange(site as any, v);
                }}
                className="w-16 text-right font-mono text-xs border border-slate-300 rounded px-1.5 py-0.5 text-teal-700 font-bold focus:outline-none focus:border-teal-500 bg-teal-50/30"
              />
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={val as number}
              onChange={(e) => handleSiteChange(site as any, parseFloat(e.target.value))}
               className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400"
            />
          </div>
        ))}
      </section>
    </div>
  );
};