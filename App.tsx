import React, { useState, useEffect } from 'react';
// 假设你的组件都在根目录或 components 文件夹
import { ControlPanel } from './components/ControlPanel';
import { PolarizationChart } from './components/PolarizationChart';
import AccessModal from './AccessModal';

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 检查本会话是否已解锁
    if (sessionStorage.getItem('lab_unlocked') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* 左侧：控制面板 */}
      <aside className="w-[400px] bg-white shadow-2xl z-10 overflow-y-auto flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-slate-800">ORR Simulator v2.0</h1>
          <p className="text-xs text-slate-400 mt-1">Motif-to-Ensemble Framework</p>
        </div>

        <div className="flex-1 p-6 space-y-8">
          {/* 1. 开放区域：基础参数 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">1. Basic (Unlocked)</h2>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Free Access</span>
            </div>
            {/* 放置 RDE & TRANSPORT 组件 */}
            <div className="space-y-4 opacity-100">
               {/* 你的基础参数输入组件内容 */}
            </div>
          </section>

          {/* 2. 锁定区域：核心机理 */}
          <section className="relative pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">2. Advanced (Locked)</h2>
              {!isUnlocked && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Restricted</span>}
            </div>

            {/* 模糊效果遮罩层 */}
            <div className={`space-y-4 transition-all duration-500 ${!isUnlocked ? 'filter blur-md select-none pointer-events-none opacity-40' : 'opacity-100'}`}>
               {/* 放置 MICROKINETICS & DFT DISTRIBUTION 组件 */}
            </div>

            {/* 锁定提示按钮 */}
            {!isUnlocked && (
              <div className="absolute inset-0 top-12 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[1px] rounded-xl border border-dashed border-slate-200">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-xl flex items-center gap-2"
                >
                  <span>🔒 申请解锁核心参数</span>
                  <span className="text-[10px] font-normal opacity-70">Apply for Access</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </aside>

      {/* 右侧：图表区 - 始终可见 */}
      <main className="flex-1 p-8 overflow-y-auto bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 min-h-[500px]">
            {/* 极化曲线图表组件 */}
            <PolarizationChart />
          </div>
        </div>
      </main>

      {/* 弹窗组件 */}
      {showModal && (
        <AccessModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setIsUnlocked(true); sessionStorage.setItem('lab_unlocked', 'true'); }}
        />
      )}
    </div>
  );
};

export default App;