# ORR Kinetics Simulator

An interactive, browser-based tool for exploring potential-dependent oxygen reduction reaction (ORR) current responses using a parameterized model of competing two-electron (2e−) and four-electron (4e−) pathways.

The application combines motif-resolved kinetic contributions, user-specified motif weights, pH-dependent hydroxyl coverage and a simplified oxygen mass-transport correction. It is intended for examining how predefined coordination-motif contributions and operating conditions affect simulated current–potential curves.

## Model overview

The calculation is implemented in [`services/electrochemistry.ts`](services/electrochemistry.ts), with model inputs and output types defined in [`types.ts`](types.ts).

### 1. Coordination motifs and thermodynamic inputs

The current implementation considers five predefined Cu coordination motifs:

- `O4`
- `S1O3`
- `S2O2`
- `S3O1`
- `S4`

Motif-specific energy-step arrays are hard-coded in the simulator. The code derives a limiting potential for each motif and reaction pathway from the largest stepwise energy change per electron. These values are model inputs; the application does not run DFT calculations or generate new coordination structures.

### 2. Motif-weighted kinetic currents

For each potential, the simulator calculates separate 2e− and 4e− kinetic-current contributions for the five motifs. The contributions are combined using the corresponding values in `site_distribution` supplied through the user interface.

The kinetic expressions are potential-dependent, Tafel-type expressions with a logistic transition between two prescribed slope regimes. The kinetic prefactors and slope parameters are defined in `services/electrochemistry.ts`.

### 3. pH-dependent hydroxyl coverage

Three preset scenarios are evaluated: pH 1, pH 7 and pH 13. Each scenario has predefined adsorption, interaction, kinetic-scaling, transport-correction and double-layer-capacitance parameters in `types.ts`.

A Frumkin/Langmuir-type expression is used to estimate OH coverage. The resulting unoccupied-site fraction is applied to the kinetic contributions of both ORR pathways.

### 4. Oxygen mass-transport correction

The limiting-current scale is referenced to 5.8 mA cm−2 at 1,600 rpm. It is adjusted using relative oxygen-concentration and diffusion-coefficient inputs, together with the square-root dependence on rotation speed used in the Levich scaling. The 2e− limiting-current scale is set to one-half of the 4e− value.

A shared flux-demand correction is then applied to the summed 2e− and 4e− kinetic contributions to obtain the mass-transport-corrected current responses. This is the specific implementation in the current code and should not be interpreted as a general-purpose rotating-disk-electrode solver.

## Interactive controls

The interface allows users to change:

- Rotation speed (rpm)
- Relative oxygen concentration
- Relative diffusion coefficient
- Potential scan start and end values (V vs. RHE)
- Global kinetic-prefactor scaling
- Adsorption-interaction scaling
- Double-layer-capacitance scaling
- The weights assigned to the five predefined coordination motifs

The initial motif weights are included.

**Important:** motif weights are applied as entered and are not automatically normalized. If they are intended to represent relative populations, users should ensure that the values sum to one.

The current interface also displays a temperature control, but temperature is not yet used in the calculation in `runSimulation`; changing this control therefore does not currently change the simulated curves.

## Outputs

For each potential point, the simulator returns pathway-resolved kinetic and mass-transport-corrected current values for the three preset pH scenarios. The potential range is sampled at 201 points.

The interface displays two plots:

1. **Intrinsic kinetics:** potential-dependent 2e− and 4e− kinetic-current curves.
2. **RDE polarization:** mass-transport-corrected current–potential curves.

The current implementation does not directly calculate or report H₂O₂ Faradaic efficiency/selectivity. It reports separate pathway-current traces. In addition, the double-layer-capacitance background term is currently added to the plotted 4e− observed-current trace in the implementation; users should account for this convention when interpreting that trace.

## Scope and limitations

The repository provides the interactive ORR current-simulation layer. It does **not** itself:

- perform molecular-dynamics simulations or generate MD trajectories;
- enumerate or discover coordination motifs from structural databases;
- perform DFT calculations or calculate the hard-coded motif energies;
- derive motif populations from MD or Boltzmann sampling;
- automatically normalize user-entered motif weights;
- calculate H₂O₂ Faradaic efficiency/selectivity as a separate output;
- solve a full elementary-step microkinetic mechanism.

The current model uses five predefined motifs, three preset pH scenarios and parameterized kinetic and transport expressions. The parameters and assumptions should be checked against the intended system before using the outputs for quantitative interpretation.

## Installation and local use

### Requirements

- Node.js 18 or later
- npm

### Install dependencies

```bash
npm ci
```

### Start the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

### Build for deployment

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

The project is a React/TypeScript application built with Vite. The GitHub Actions workflow in `.github/workflows/deploy.yml` is configured to build and deploy the application to GitHub Pages.

**Source check before building:** in the supplied archive, `components/ControlPanel.tsx` imports `SimulationParams` from `./types`, but the type file is located one directory above. Change that import to `../types` before running the build. The build was not verified in this environment because dependency installation did not complete.

## Repository structure

```text
.
├── App.tsx
├── AccessModal.tsx
├── components/
│   ├── ControlPanel.tsx
│   ├── KineticsChart.tsx
│   └── PolarizationChart.tsx
├── services/
│   └── electrochemistry.ts
├── types.ts
├── index.html
├── index.tsx
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── .github/
    └── workflows/
        └── deploy.yml
```

## Reproducibility

The model equations, preset motif energy arrays, scenario parameters and default motif weights are defined in the source files identified above. To reproduce a particular simulation, record the values of all user-adjustable parameters, including the five motif weights, the potential scan range, rotation speed, relative oxygen concentration, relative diffusion coefficient, kinetic scaling, interaction scaling and capacitance scaling.

The repository currently does not include a separate automated test suite or a manuscript-specific command-line workflow. The manuscript's Methods and Supplementary Information should therefore be consulted for the scientific rationale, parameter provenance and interpretation of the model.

## Citation

If this code is used in a publication, please cite the associated research article:

> [Full citation to be added upon publication.]

## License

A license file is not currently included in this repository. Terms for reuse and redistribution should be specified by the repository maintainers before the code is presented as an openly licensed software package.

