import React from 'react';

const ControlPanel = ({ isUnlocked, onRequestAccess }) => {
  return (
    <div className="p-5 space-y-6">

      {/* 面板 1: RDE & TRANSPORT (开放) */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-black text-blue-600 uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
          RDE & Transport (Levich)
        </h2>
        {/* 这里是你原来的 Slider 和 Input 组件 */}
      </section>

      {/* 面板 2: ENVIRONMENT (开放) */}
      <section className="space-y-4 pt-4 border-t">
        <h2 className="text-[11px] font-black text-orange-500 uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
          Environment & Scan
        </h2>
        {/* 这里放置温度、电位范围等参数 */}
      </section>

      {/* 面板 3: MICROKINETICS & DFT (受限区域) */}
      <section className="relative pt-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[11px] font-black text-slate-400 uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
            Microkinetics & Mechanism
          </h2>
          {!isUnlocked && <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-1">🔒 Locked</span>}
        </div>

        {/* 虽然未解锁，但参数全景展示，增加吸引力 */}
        <div className="space-y-4">
           {/* 这里放置你的核心机理、活性位点分布等参数输入组件 */}
        </div>

        {/* 透明拦截层：未解锁时点击即弹窗 */}
        {!isUnlocked && (
          <div
            onClick={onRequestAccess}
            className="absolute inset-0 z-20 cursor-pointer hover:bg-slate-50/20 transition-all rounded-lg"
            title="Click to request access for advanced parameters"
          ></div>
        )}
      </section>
    </div>
  );
};

export default ControlPanel;