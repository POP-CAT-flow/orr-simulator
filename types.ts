export interface SimulationParams {
  // Hydrodynamics (RDE) & Transport
  rotation_speed: number;       // RPM
  oxygen_concentration: number; // Relative scaling factor (1.0 = standard)
  diffusion_coefficient: number;// Relative scaling factor (1.0 = standard)
  
  // Cell & Environment
  temperature: number;          // Kelvin
  scan_start: number;           // V vs RHE
  scan_end: number;             // V vs RHE

  // Intrinsic Kinetics
  j0_scaling: number;           // Pre-exponential factor scaling
  gamma_scaling: number;        // Lateral interaction parameter scaling
  capacitance_scaling: number;  // Double layer capacitance scaling

  // Microscopic Sites (DFT)
  site_distribution: {
    O4: number;
    S1O3: number;
    S2O2: number;
    S3O1: number;
    S4: number;
  };
}

export interface DataPoint {
  E_rhe: number;
  // pH 1
  ph1_jk2: number;
  ph1_jk4: number;
  ph1_jobs2: number;
  ph1_jobs4: number;
  // pH 7
  ph7_jk2: number;
  ph7_jk4: number;
  ph7_jobs2: number;
  ph7_jobs4: number;
  // pH 13
  ph13_jk2: number;
  ph13_jk4: number;
  ph13_jobs2: number;
  ph13_jobs4: number;
}

export interface ScenarioConfig {
  label: string;
  color: string;
  K_ads: number;
  gamma: number;
  j0_scale: number;
  diff_corr: number;
  C_dl_base: number;
}

export const SCENARIOS: Record<number, ScenarioConfig> = {
  1:  { label: 'pH 1',  color: '#D62728', K_ads: 1e-2, gamma: 15.0, j0_scale: 1.0, diff_corr: 1.00, C_dl_base: 0.02 },
  7:  { label: 'pH 7',  color: '#1F77B4', K_ads: 2.0,  gamma: 12.0, j0_scale: 0.5, diff_corr: 0.96, C_dl_base: 0.02 },
  13: { label: 'pH 13', color: '#9467BD', K_ads: 50.0, gamma: 10.0, j0_scale: 2.0, diff_corr: 0.92, C_dl_base: 0.03 }
};