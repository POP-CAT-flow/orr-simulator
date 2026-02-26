import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import PolarizationChart from './components/PolarizationChart';
import KineticsChart from './components/KineticsChart'; // 确保你有这个组件
import AccessModal from './AccessModal';

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('lab_unlocked') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fa] flex flex-col font-sans">
      {/* 顶部标题栏 */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">e⁻</div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-none">ORR Kinetics Simulator</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Multiphysics Electrochemical Modeling</p>
          </div>
        </div>
      </header>

      {/* 主交互全景界面 */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">

        {/* 左栏：控制面板 (1/4 宽度) */}
        <aside className="w-[320px] bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-y-auto">
          <ControlPanel
            isUnlocked={isUnlocked}
            onRequestAccess={() => setShowModal(true)}
          />
        </aside>

        {/* 中栏与右栏：图表展示区 (3/4 宽度) */}
        <main className="flex-1 grid grid-cols-2 gap-4 overflow-y-auto">

          {/* 动力学图表面板 */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
               Intrinsic Kinetics <span className="text-[10px] font-normal text-slate-400">Log Scale Current vs. Potential</span>
            </h3>
            <div className="h-[450px]">
              <KineticsChart />
            </div>
          </section>

          {/* 极化曲线面板 */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
               RDE Polarization <span className="text-[10px] font-normal text-slate-400">Observed Current (Mass Transport Corrected)</span>
            </h3>
            <div className="h-[450px]">
              <PolarizationChart />
            </div>
          </section>

        </main>
      </div>

      {showModal && (
        <AccessModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setIsUnlocked(true);
            sessionStorage.setItem('lab_unlocked', 'true');
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default App;