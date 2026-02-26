import React from 'react';
import { SimulationParams } from './types';

interface Props {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  isUnlocked: boolean;      // 必须添加：当前的解锁状态
  onRequestAccess: () => void; // 必须添加：触发申请弹窗的函数
}

export const ControlPanel: React.FC<Props> = ({
  params,
  setParams,
  isUnlocked,
  onRequestAccess
}) => {

  // 处理活性位点分布的变化 (Handle DFT site changes)
  const handleSiteChange = (site: keyof typeof params.site_distribution, value: number) => {
    setParams(prev => ({
      ...prev,
      site_distribution: {
        ...prev.site_distribution,
        [site]: value
      }
    }));
  };

  // 处理通用数值参数的变化 (Handle basic parameter changes)
  const handleChange = (field: keyof SimulationParams, value: number) => {
    setParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 科学输入组件：集成滑块与高精度数字输入框
  const ContinuousInput = ({ label, value, min, max, step, unit, onChange, subLabel, enLabel }: any) => (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-sm font-semibold text-slate-700 leading-tight">
          {label} <span className="text-[10px] text-slate-400 font-normal block italic">{enLabel}</span>
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step / 10}
            value={value}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onChange(val);
            }}
            className="w-20 text-right font-mono text-xs border border-slate-200 rounded px-1.5 py-1 text-indigo-700 font-bold focus:outline-none focus:border-indigo-500 bg-indigo-50/30"
          />
          <span className="text-[10px] text-slate-400 w-6">{unit}</span>
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
      {subLabel && <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">{subLabel}</p>}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full overflow-y-auto flex flex-col gap-8 scroll-smooth">

      {/* 第一部分：流体动力学 (始终开放给游客) */}
      <section>
        <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          1. RDE & Transport (Levich)
        </h3>
        <ContinuousInput
          label="旋转速度" enLabel="Rotation Speed (ω)"
          value={params.rotation_speed} min={0} max={10000} step={10} unit="rpm"
          onChange={(v: number) => handleChange('rotation_speed', v)}
          subLabel="控制扩散层厚度 (δ) / Controls diffusion layer thickness"
        />
        <ContinuousInput
          label={<span>O<sub>2</sub> 溶解度</span>} enLabel="O2 Solubility (C*)"
          value={params.oxygen_concentration} min={0.1} max={5.0} step={0.05} unit="×"
          onChange={(v: number) => handleChange('oxygen_concentration', v)}
          subLabel="电解质浓度效应 / Electrolyte concentration effect"
        />
        <ContinuousInput
          label="扩散系数" enLabel="Diffusion Coeff. (D)"
          value={params.diffusion_coefficient} min={0.1} max={5.0} step={0.05} unit="×"
          onChange={(v: number) => handleChange('diffusion_coefficient', v)}
          subLabel="粘度相关参数 / Viscosity dependent"
        />
      </section>

      <hr className="border-slate-100" />

      {/* 第二部分：反应环境 (始终开放给游客) */}
      <section>
        <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-5 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-orange-500"></span>
           2. Environment & Scan
        </h3>
        <ContinuousInput
          label="体系温度" enLabel="Temperature (T)"
          value={params.temperature} min={200} max={400} step={1} unit="K"
          onChange={(v: number) => handleChange('temperature', v)}
        />
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
             <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Scan Start (V)</label>
             <input
              type="number" step="0.01"
              value={params.scan_start}
              onChange={(e) => handleChange('scan_start', parseFloat(e.target.value))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-indigo-700 font-mono font-bold bg-indigo-50/20 outline-none focus:border-indigo-400"
             />
          </div>
          <div>
             <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Scan End (V)</label>
             <input
              type="number" step="0.01"
              value={params.scan_end}
              onChange={(e) => handleChange('scan_end', parseFloat(e.target.value))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs text-indigo-700 font-mono font-bold bg-indigo-50/20 outline-none focus:border-indigo-400"
             />
          </div>
        </div>
      </section>

      {/* 核心机理拦截区域 (Behavioral Interception Area) */}
      <div className="relative pt-2 border-t border-slate-50 mt-2">

        {/* 受限面板内容：未解锁时降低透明度并禁用交互 */}
        <div className={`space-y-8 transition-opacity duration-500 ${!isUnlocked ? "opacity-40 pointer-events-none select-none" : "opacity-100"}`}>

          {/* 第三部分：微观动力学 */}
          <section>
            <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              3. Microkinetics & Mechanism
            </h3>
            <ContinuousInput
              label={<span>指前因子</span>} enLabel="Pre-factor (j0 Scale)"
              value={params.j0_scaling} min={0.01} max={20.0} step={0.1} unit="×"
              onChange={(v: number) => handleChange('j0_scaling', v)}
              subLabel="催化剂负载量/粗糙度因子 / Catalyst loading"
            />
            <ContinuousInput
              label="吸附相互作用" enLabel="Adsorption Interaction (γ)"
              value={params.gamma_scaling} min={0.1} max={5.0} step={0.1} unit="×"
              onChange={(v: number) => handleChange('gamma_scaling', v)}
              subLabel="等温线形状参数 / Isotherm shape"
            />
            <ContinuousInput
              label={<span>双层电容</span>} enLabel="DL Capacitance (Cdl)"
              value={params.capacitance_scaling} min={0.0} max={20.0} step={0.1} unit="×"
              onChange={(v: number) => handleChange('capacitance_scaling', v)}
              subLabel="非法拉第背景电流 / Background current"
            />
          </section>

          {/* 第四部分：活性位点分布 (DFT) */}
          <section className="pb-4">
            <h3 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              4. Active Site Distribution (DFT)
            </h3>
            {Object.entries(params.site_distribution).map(([site, val]) => (
              <div key={site} className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-mono text-slate-700 font-bold text-sm">{site}</span>
                  <input
                    type="number"
                    min="0" max="1" step="0.01"
                    value={val as number}
                    onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if(!isNaN(v)) handleSiteChange(site as any, v);
                    }}
                    className="w-16 text-right font-mono text-xs border border-slate-200 rounded px-1.5 py-1 text-teal-700 font-bold bg-teal-50/30 outline-none"
                  />
                </div>
                <input
                  type="range"
                  min="0" max="1" step="0.01"
                  value={val as number}
                  onChange={(e) => handleSiteChange(site as any, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400"
                />
              </div>
            ))}
          </section>
        </div>

        {/* 【拦截层】：未解锁时覆盖在第3、4板块上方，捕捉点击并触发申请弹窗 */}
        {!isUnlocked && (
          <div
            onClick={onRequestAccess}
            className="absolute inset-0 z-30 cursor-pointer hover:bg-slate-900/5 transition-all rounded-xl flex items-center justify-center group"
            title="Click to apply for access to core kinetic parameters"
          >
            <div className="bg-slate-900/90 text-white px-6 py-3 rounded-2xl text-[11px] font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex flex-col items-center gap-1">
               <span className="text-lg">🔒</span>
               <span>点击申请核心参数调节权限</span>
               <span className="text-[9px] font-normal opacity-60 italic">Click to Unlock Advanced Parameters</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};