import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import PolarizationChart from './components/PolarizationChart'; // 现在这里不会报错了
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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 左侧：全景面板，直接展示所有参数 */}
      <aside className="w-[420px] bg-white shadow-xl z-10 flex flex-col border-r border-slate-200">
        <div className="p-6 bg-slate-900 text-white">
          <h1 className="text-xl font-bold">ORR Simulator v2.0</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase">Motif-to-Ensemble Framework</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* 将解锁状态和请求函数传给面板 */}
          <ControlPanel
            isUnlocked={isUnlocked}
            onRequestAccess={() => setShowModal(true)}
          />
        </div>
      </aside>

      {/* 右侧：图表全景，始终清晰可见 */}
      <main className="flex-1 p-8 bg-slate-50 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Polarization Curve / 极化曲线
            </h2>
            <div className="h-[550px]">
              <PolarizationChart />
            </div>
          </section>
        </div>
      </main>

      {/* 弹窗组件：点击受限区域时弹出 */}
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