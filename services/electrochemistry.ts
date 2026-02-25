import { SimulationParams, DataPoint, SCENARIOS } from '../types';

// ==========================================
// Constants & DFT Input
// ==========================================
const F = 96485.0;
const R = 8.314;
const J_LIM_REF_1600 = 5.8; // mA/cm2 Reference limiting current at 1600 RPM

// DFT Energies (V vs RHE)
const energies_2e: Record<string, number[]> = {
  "O4": [4.92, 2.59, 3.52], "S1O3": [4.92, 2.28, 3.52],
  "S2O2": [4.92, 4.14, 3.52], "S3O1": [4.92, 4.12, 3.52], "S4": [4.92, 4.09, 3.52],
};
const energies_4e: Record<string, number[]> = {
  "O4": [4.92, 2.59, 3.48, 1.71, 0.00], "S1O3": [4.92, 2.28, 0.29, 1.37, 0.00],
  "S2O2": [4.92, 4.14, 0.40, 1.42, 0.00], "S3O1": [4.92, 4.12, 3.69, 1.48, 0.00],
  "S4": [4.92, 4.09, 3.73, 1.50, 0.00],
};

// Kinetic Parameters (Base)
const params_2e = { j0: 15.0, b_low: 0.060, b_high: 0.120, E_sw: 0.75, w: 0.05 };
const params_4e = { j0: 80.0, b_low: 0.060, b_high: 0.120, E_sw: 0.85, w: 0.05 };

// ==========================================
// Helper Functions
// ==========================================

function get_UL(states: number[], ne: number[]): number {
  const dGs: number[] = [];
  for (let i = 0; i < states.length - 1; i++) {
    dGs.push(states[i+1] - states[i]);
  }
  let maxVal = -Infinity;
  for (let i = 0; i < dGs.length; i++) {
    const val = dGs[i] / ne[i];
    if (val > maxVal) maxVal = val;
  }
  return -maxVal;
}

const site_keys = Object.keys(energies_2e);
const UL2: Record<string, number> = {};
const UL4: Record<string, number> = {};

site_keys.forEach(s => {
  UL2[s] = get_UL(energies_2e[s], [1, 1]);
  UL4[s] = get_UL(energies_4e[s], [1, 1, 1, 1]);
});

function logistic_switch(E: number, E_switch: number, width: number): number {
  return 1.0 / (1.0 + Math.exp((E - E_switch) / width));
}

function get_OH_coverage(E: number, K0: number, a_OH: number, gamma: number): number {
  // Frumkin/Langmuir Isotherm with lateral interaction parameter gamma
  return 1.0 / (1.0 + (1.0/(K0 * a_OH)) * Math.exp(-gamma * (E - 0.80)));
}

// ==========================================
// Main Simulation Loop
// ==========================================
export function runSimulation(params: SimulationParams): DataPoint[] {
  const steps = 200;
  const data: DataPoint[] = [];

  // Calculate Levich Scaling Factor
  // J_lim ~ n * F * A * D^(2/3) * w^(1/2) * v^(-1/6) * C
  // We assume parameters are relative to the reference state (1600 RPM, std conc/diff)
  const levich_factor = params.oxygen_concentration * 
                        Math.pow(params.diffusion_coefficient, 0.666) * 
                        Math.sqrt(params.rotation_speed / 1600.0);

  for (let i = 0; i <= steps; i++) {
    const E_rhe = params.scan_start + (params.scan_end - params.scan_start) * (i / steps);
    const point: any = { E_rhe };

    // Loop through scenarios (pH 1, 7, 13)
    [1, 7, 13].forEach(ph => {
      const cfg = SCENARIOS[ph];
      const a_OH = Math.pow(10, ph - 14);

      // 1. Physical Limiting Current with Levich constraints
      // Incorporating pH-specific transport corrections (diff_corr) and user overrides
      const J_lim_4e_real = J_LIM_REF_1600 * cfg.diff_corr * levich_factor;
      const J_lim_2e_real = J_lim_4e_real / 2.0;

      let jk_2e_tot = 0;
      let jk_4e_tot = 0;

      // 2. Kinetic Current Calculation
      site_keys.forEach(s => {
        // @ts-ignore
        const w_site = params.site_distribution[s];
        
        // Effective Gamma: Base scenario gamma * user scaling
        const gamma_eff = cfg.gamma * params.gamma_scaling;
        
        const theta = get_OH_coverage(E_rhe, cfg.K_ads, a_OH, gamma_eff);
        const site_avail = 1.0 - theta;

        // Apply global kinetic scaling (e.g. catalyst loading / roughness)
        const j0_scale_eff = cfg.j0_scale * params.j0_scaling;

        // 2e Path
        const eta_2 = UL2[s] - E_rhe;
        const sw_2 = logistic_switch(E_rhe, params_2e.E_sw, params_2e.w);
        const b_2 = sw_2 * params_2e.b_low + (1 - sw_2) * params_2e.b_high;
        const j_2e_site = j0_scale_eff * params_2e.j0 * Math.exp(2.303 * eta_2 / b_2);
        jk_2e_tot += w_site * site_avail * j_2e_site;

        // 4e Path
        const eta_4 = UL4[s] - E_rhe;
        const sw_4 = logistic_switch(E_rhe, params_4e.E_sw, params_4e.w);
        const b_4 = sw_4 * params_4e.b_low + (1 - sw_4) * params_4e.b_high;
        const j_4e_site = j0_scale_eff * params_4e.j0 * Math.exp(2.303 * eta_4 / b_4);
        jk_4e_tot += w_site * site_avail * j_4e_site;
      });

      // uA -> mA
      const jk_2e_mA = jk_2e_tot / 1000.0;
      const jk_4e_mA = jk_4e_tot / 1000.0;

      // 3. Mass Transport Coupling (Koutecký-Levich)
      const safe_Jlim2 = Math.abs(J_lim_2e_real) < 1e-9 ? 1e-9 : J_lim_2e_real;
      const safe_Jlim4 = Math.abs(J_lim_4e_real) < 1e-9 ? 1e-9 : J_lim_4e_real;

      const flux_demand = (jk_2e_mA / safe_Jlim2) + (jk_4e_mA / safe_Jlim4);
      const mass_transport_factor = 1.0 / (1.0 + flux_demand);

      // 4. Observed Current
      const j_cap = -1.0 * cfg.C_dl_base * params.capacitance_scaling;
      const jobs_2e = -1.0 * jk_2e_mA * mass_transport_factor;
      const jobs_4e = -1.0 * jk_4e_mA * mass_transport_factor;

      // Store in data point
      point[`ph${ph}_jk2`] = jk_2e_mA;
      point[`ph${ph}_jk4`] = jk_4e_mA;
      point[`ph${ph}_jobs2`] = jobs_2e;
      // Add a fraction of capacitance to the 4e trace just for visualization continuity, 
      // or strictly Faradaic. User asked for Cdl contribution, so we add it to the 'observed' 4e line.
      point[`ph${ph}_jobs4`] = jobs_4e + j_cap; 
    });

    data.push(point as DataPoint);
  }
  return data;
}