import React from 'react';

const ControlPanel = ({ isUnlocked, onRequestAccess }) => {
  return (
    <div className="p-6 space-y-8">
      {/* 1. 开放区域：基础参数 (RDE & ENVIRONMENT) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xs font-black text-blue-600 uppercase tracking-tighter">1. Transport & Environment (Unlocked)</h2>
        </div>
        {/* 这里是你原来的 RDE & TRANSPORT (LEVICH) 输入组件 */}
        {/* 游客可以直接操作这些，并看到右侧图表动态变化 */}
      </section>

      {/* 2. 受限区域：核心机理 (MICROKINETICS & DFT) */}
      <section className="relative pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-tighter">2. Kinetics & Site Distribution (Restricted)</h2>
          {!isUnlocked && <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded">🔒 Locked</span>}
        </div>

        {/* 核心机理面板内容：视觉上完全清晰，但不允许交互 */}
        <div className="space-y-4">
           {/* 这里放置你的 MICROKINETICS & ACTIVE SITE DISTRIBUTION 组件内容 */}
        </div>

        {/* 行为拦截器：如果未解锁，覆盖一个透明层捕捉点击 */}
        {!isUnlocked && (
          <div
            onClick={onRequestAccess}
            className="absolute inset-0 cursor-pointer hover:bg-blue-50/5 transition-colors z-20"
            title="Click to apply for advanced parameters access"
          ></div>
        )}
      </section>
    </div>
  );
};

export default ControlPanel;