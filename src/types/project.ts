
export interface Project {
  id: string;
  name: string;
  typology: 'office' | 'residential' | 'educational' | 'healthcare' | 'retail' | 'mixed-use';
  location: string;
  completionDate: string;
  carbonIntensity: number; // kgCO2e/m²/yr
  operationalEnergy: number; // kWh/m²/yr
  eui: number; // Energy Use Intensity (kWh/m²/yr)
  shd: number; // Solar Heat Demand (kWh/m²/yr)
  upfrontEC: number; // Upfront Embodied Carbon (kgCO2e/m²)
  wlc: number; // Whole Life Carbon (kgCO2e/m²)
  pmv: number; // Predicted Mean Vote (thermal comfort index)
  certifications?: string[];
}

export interface KPIOption {
  key: keyof Project;
  label: string;
  unit: string;
  numericOnly?: boolean;
}

export const availableKPIs: KPIOption[] = [
  { key: 'carbonIntensity', label: 'Carbon Intensity', unit: 'kgCO2e/m²/yr', numericOnly: true },
  { key: 'operationalEnergy', label: 'Operational Energy', unit: 'kWh/m²/yr', numericOnly: true },
  { key: 'eui', label: 'Energy Use Intensity (EUI)', unit: 'kWh/m²/yr', numericOnly: true },
  { key: 'shd', label: 'Solar Heat Demand (SHD)', unit: 'kWh/m²/yr', numericOnly: true },
  { key: 'upfrontEC', label: 'Upfront Embodied Carbon', unit: 'kgCO2e/m²', numericOnly: true },
  { key: 'wlc', label: 'Whole Life Carbon (WLC)', unit: 'kgCO2e/m²', numericOnly: true },
  { key: 'pmv', label: 'Predicted Mean Vote (PMV)', unit: '', numericOnly: true },
];
