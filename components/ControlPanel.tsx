import React from 'react';

const ControlPanel = ({ isUnlocked, onRequestAccess }) => {
  return (
    <div className="p-8 space-y-10">

      {/* 开放板块 1: RDE & TRANSPORT */}
      <section className="space-y-6">
        <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
          1. RDE & Transport (Levich)
        </h2>
        {/* 放置你的 Rotation Speed, O2 Solubility 等交互组件 */}
      </section>

      {/* 开放板块 2: ENVIRONMENT */}
      <section className="space-y-6 pt-8 border-t border-slate-50">
        <h2 className="text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          2. Environment & Scan
        </h2>
        {/* 放置 Temperature, pH, Potential Range 等交互组件 */}
      </section>

      {/* 受限板块 3: KINETICS & MECHANISM (行为拦截) */}
      <section className="relative pt-8 border-t border-slate-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
            3. Microkinetics & DFT
          </h2>
          {!isUnlocked && (
            <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-bold border border-indigo-100 flex items-center gap-1">
              🔒 需授权 / Restricted
            </span>
          )}
        </div>

        {/* 虽然点击受阻，但视觉全景展示 */}
        <div className="space-y-6 opacity-60">
           {/* 放置你的 Pre-factor, Adsorption Interaction, Site Distribution 等核心组件 */}
        </div>

        {/* 【关键】行为拦截层：未解锁时，点击任何地方触发弹窗 */}
        {!isUnlocked && (
          <div
            onClick={onRequestAccess}
            className="absolute inset-0 z-30 cursor-pointer hover:bg-slate-50/20 transition-all rounded-2xl group"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold shadow-2xl">
              点击申请调节权限 / Click to Unlock
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ControlPanel;