import React, { useState, useMemo } from 'react';
import { runSimulation } from './services/electrochemistry';
import { ControlPanel } from './components/ControlPanel';
import { KineticsChart } from './components/KineticsChart';
import { PolarizationChart } from './components/PolarizationChart';
import { SimulationParams } from './types';

const App: React.FC = () => {
  // Initial State configured for standard RDE conditions
  const [params, setParams] = useState<SimulationParams>({
    // Hydrodynamics
    rotation_speed: 1600,
    oxygen_concentration: 1.0,
    diffusion_coefficient: 1.0,
    
    // Environment
    temperature: 298.15,
    scan_start: 0.20,
    scan_end: 1.15,
    
    // Kinetics
    j0_scaling: 1.0,
    gamma_scaling: 1.0,
    capacitance_scaling: 1.0,
    
    // Microscopic Sites
    site_distribution: {
      O4: 0.03,
      S1O3: 0.21,
      S2O2: 0.44,
      S3O1: 0.27,
      S4: 0.05
    }
  });

  // Real-time simulation
  const data = useMemo(() => runSimulation(params), [params]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-indigo-200 shadow-lg">
            e⁻
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              ORR Kinetics Simulator
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Multiphysics Electrochemical Modeling
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-[#D62728]"></span> pH 1
          </div>
          <div className="flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-[#1F77B4]"></span> pH 7
          </div>
           <div className="flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-[#9467BD]"></span> pH 13
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 p-6 overflow-hidden">
        <div className="max-w-[1600px] mx-auto h-[calc(100vh-140px)] grid grid-cols-12 gap-6">
          
          {/* Left Panel: Controls */}
          <div className="col-span-12 lg:col-span-3 h-full overflow-hidden">
            <ControlPanel params={params} setParams={setParams} />
          </div>

          {/* Center Panel: Visualization */}
          <div className="col-span-12 lg:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            
            {/* Chart A: Kinetics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[500px] lg:h-full">
              <KineticsChart data={data} />
            </div>

            {/* Chart B: Polarization */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[500px] lg:h-full">
              <PolarizationChart data={data} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;