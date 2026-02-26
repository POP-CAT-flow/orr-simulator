import React, { useState, useMemo, useEffect } from 'react';
import { runSimulation } from './services/electrochemistry';
import { ControlPanel } from './components/ControlPanel';
import { KineticsChart } from './components/KineticsChart';
import { PolarizationChart } from './components/PolarizationChart';
import { AccessModal } from './AccessModal';
import { SimulationParams } from './types';

const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 初始化检查持久化权限
  useEffect(() => {
    if (localStorage.getItem('lab_access_granted') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const [params, setParams] = useState<SimulationParams>({
    rotation_speed: 1600,
    oxygen_concentration: 1.0,
    diffusion_coefficient: 1.0,
    temperature: 298.15,
    scan_start: 0.20,
    scan_end: 1.15,
    j0_scaling: 1.0,
    gamma_scaling: 1.0,
    capacitance_scaling: 1.0,
    site_distribution: { O4: 0.03, S1O3: 0.21, S2O2: 0.44, S3O1: 0.27, S4: 0.05 }
  });

  const data = useMemo(() => runSimulation(params), [params]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">e⁻</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ORR Kinetics Simulator</h1>
            <p className="text-xs text-slate-500 font-medium italic">Multiphysics Electrochemical Modeling</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3 h-full overflow-hidden">
            <ControlPanel
              params={params} setParams={setParams}
              isUnlocked={isUnlocked}
              onRequestAccess={() => setShowModal(true)}
            />
          </div>
          <div className="col-span-12 lg:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full"><KineticsChart data={data} /></div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full"><PolarizationChart data={data} /></div>
          </div>
        </div>
      </main>

      {showModal && (
        <AccessModal
          onClose={() => setShowModal(false)}
          onSuccess={(remember: boolean) => {
            setIsUnlocked(true);
            if (remember) localStorage.setItem('lab_access_granted', 'true');
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default App;