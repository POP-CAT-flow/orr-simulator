import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel'; // 确保路径对应
import PolarizationChart from './components/PolarizationChart';
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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* 左侧控制面板：全景展示 */}
      <aside className="w-[420px] bg-white shadow-xl z-10 flex flex-col border-r border-slate-200">
        <div className="p-6 bg-slate-900 text-white">
          <h1 className="text-xl font-bold">ORR Simulator v2.0</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Motif-to-Ensemble Framework</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ControlPanel
            isUnlocked={isUnlocked}
            onRequestAccess={() => setShowModal(true)}
          />
        </div>
      </aside>

      {/* 右侧图表区：全景展示，始终清晰 */}
      <main className="flex-1 p-8 bg-slate-50 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              RDE Polarization Curve / 极化曲线
            </h2>
            <div className="h-[500px] w-full">
              <PolarizationChart />
            </div>
          </section>
        </div>
      </main>

      {/* 弹窗组件：可随时关闭 */}
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