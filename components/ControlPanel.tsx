import React from 'react';

const ControlPanel = ({ isUnlocked, onRequestAccess }) => {
  return (
    <div className="p-6 space-y-8">
      {/* 1. RDE & ENVIRONMENT (完全开放，游客可调节并看曲线变化) */}
      <section className="space-y-4">
        <h2 className="text-xs font-black text-blue-600 uppercase">1. Transport & Environment</h2>
        {/* 这里放置你的基础参数输入组件，游客直接操作 */}
      </section>

      {/* 2. MICROKINETICS & DFT (全景可见，但交互受限) */}
      <section className="relative pt-6 border-t border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-black text-slate-400 uppercase">2. Kinetics & Site Distribution</h2>
          {!isUnlocked && <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded">🔒 Locked</span>}
        </div>

        {/* 核心机理内容：视觉清晰，方便展示你的研究深度 */}
        <div className="space-y-4">
           {/* 这里是你的核心机理参数输入组件 */}
        </div>

        {/* 【行为拦截器】未解锁时，点击此区域弹出申请框 */}
        {!isUnlocked && (
          <div
            onClick={onRequestAccess}
            className="absolute inset-0 cursor-pointer hover:bg-slate-50/10 z-20"
            title="Click to apply for access to advanced parameters"
          ></div>
        )}
      </section>
    </div>
  );
};

export default ControlPanel;