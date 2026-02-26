import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import PolarizationChart from './components/PolarizationChart';
import KineticsChart from './components/KineticsChart';
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      {/* 顶部专业标题栏 */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200">e⁻</div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">ORR Kinetics Simulator</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">Multiphysics Electrochemical Modeling</p>
          </div>
        </div>
      </header>

      {/* 主交互界面：三栏全景布局 */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">

        {/* 1. 左侧控制面板 (1/4 宽度) */}
        <aside className="w-[360px] bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col overflow-y-auto">
          <ControlPanel
            isUnlocked={isUnlocked}
            onRequestAccess={() => setShowModal(true)}
          />
        </aside>

        {/* 2. 中间与右侧图表区 (3/4 宽度) */}
        <main className="flex-1 grid grid-cols-2 gap-6 overflow-y-auto">

          {/* 动力学面板 */}
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
               <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
               Intrinsic Kinetics <span className="text-[10px] font-normal text-slate-400 italic ml-2">Log Scale Analysis</span>
            </h3>
            <div className="flex-1">
              <KineticsChart />
            </div>
          </section>

          {/* 极化曲线面板 */}
          <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col">
             <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
               <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
               RDE Polarization <span className="text-[10px] font-normal text-slate-400 italic ml-2">Transport Corrected</span>
            </h3>
            <div className="flex-1">
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