export interface Project {
  id: string;
  name: string;
  typology: 'office' | 'residential' | 'educational' | 'healthcare' | 'retail' | 'mixed-use';
  location: string;
  completionDate: string;
  projectType: 'new-build' | 'retrofit';
  ribaStage: 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4' | 'stage-5' | 'stage-6' | 'stage-7';
  gia?: number; // Gross Internal Area in m²
  
  // Embodied Carbon
  upfrontCarbon: number; // kgCO2e/m²
  totalEmbodiedCarbon: number; // kgCO2e/m²
  biogenicCarbon: number; // kgCO2e/m²
  refrigerants: number; // kgCO2e/m²
  
  // Operational Energy
  operationalEnergyTotal: number; // kWh/m²/year
  operationalEnergyPartL: number; // kWh/m²/year
  operationalEnergyGas: number; // kWh/m²/year
  operationalEnergy: number; // kWh/m²/year
  gasUsage: number; // kWh/m²/year
  spaceHeatingDemand: number; // kWh/m²/year
  renewableEnergyGeneration: number; // kWh/m²/year
  existingBuildingEnergy: number; // kWh/m²/year
  
  // Water Use
  operationalWaterUse: number; // litres/pp/pd
  
  // Accreditations
  breeam: string;
  leed: string;
  well: string;
  nabers: string;
  passivhaus: boolean;
  
  // Social Value
  socialValue: number; // £ per £ construction cost
  
  // Wellbeing
  pmv: number; // PMV index value
  ppd: number; // % dissatisfied
  daylightFactor: number;
  
  // Biodiversity
  biodiversityNetGain: number; // %
  habitatUnits: number; // Number of habitat units
  urbanGreeningFactor: number; // Score (e.g. 0.3)
  
  // Embodied Impacts
  ozoneDepletion: number; // kg CFC-11e per m²
  
  // Circular Economy
  reusedRecycledMaterial: number; // % of total mass
  
  // Legacy fields for compatibility
  carbonIntensity: number; // kgCO2e/m²/yr
  eui: number; // Energy Use Intensity (kWh/m²/yr)
  shd: number; // Solar Heat Demand (kWh/m²/yr)
  wlc: number; // Whole Life Carbon (kgCO2e/m²)
  
  certifications?: string[];
  
  // Embodied carbon breakdown
  embodiedCarbonBreakdown?: {
    byLifeCycleStage: {
      a1a3: number; // Product stage
      a4: number; // Transport
      a5: number; // Construction
      b1b7: number; // Use stage
      c1c4: number; // End of life
      d: number; // Benefits beyond system boundary
    };
    byBuildingElement: {
      substructure: number;
      superstructure: number;
      finishes: number;
      fittings: number;
      services: number;
      external: number;
    };
  };
}

export interface KPIOption {
  key: keyof Project;
  label: string;
  unit: string;
  category: 'embodied-carbon' | 'operational-energy' | 'water' | 'accreditation' | 'social' | 'wellbeing' | 'biodiversity' | 'circular' | 'legacy';
  numericOnly?: boolean;
}

export const availableKPIs: KPIOption[] = [
  // Embodied Carbon
  { key: 'upfrontCarbon', label: 'Upfront Carbon', unit: 'kgCO2e/m²', category: 'embodied-carbon', numericOnly: true },
  { key: 'totalEmbodiedCarbon', label: 'Total Embodied Carbon', unit: 'kgCO2e/m²', category: 'embodied-carbon', numericOnly: true },
  { key: 'biogenicCarbon', label: 'Biogenic carbon', unit: 'kgCO2e/m²', category: 'embodied-carbon', numericOnly: true },
  { key: 'refrigerants', label: 'Refrigerants', unit: 'kgCO2e/m²', category: 'embodied-carbon', numericOnly: true },
  
  // Operational Energy
  { key: 'operationalEnergyTotal', label: 'Operational energy: Total', unit: 'kWh/m²/year', category: 'operational-energy', numericOnly: true },
  { key: 'operationalEnergyPartL', label: 'Operational energy Part L', unit: 'kWh/m²/year', category: 'operational-energy', numericOnly: true },
  { key: 'operationalEnergyGas', label: 'Operational energy: Gas', unit: 'kWh/m²/year', category: 'operational-energy', numericOnly: true },
  { key: 'operationalEnergy', label: 'Operational Energy', unit: 'kWh/m²/year', category: 'operational-energy', numericOnly: true },
  { key: 'gasUsage', label: 'Gas Usage', unit: 'kWh/m²/year', category: 'operational-energy', numericOnly: true },
  { key: 'spaceHeatingDemand', label: 'Space heating demand', unit: 'kWh/m²/year', category: 'operational-energy', numericOnly: true },
  { key: 'renewableEnergyGeneration', label: 'Renewable energy generation', unit: 'kWh/m²/year', category: 'operational-energy', numericOnly: true },
  { key: 'existingBuildingEnergy', label: 'Existing Building Energy', unit: 'kWh/m²/year', category: 'operational-energy', numericOnly: true },
  
  // Water
  { key: 'operationalWaterUse', label: 'Operational Water Use', unit: 'litres/pp/pd', category: 'water', numericOnly: true },
  
  // Wellbeing
  { key: 'pmv', label: 'Predicted Mean Vote (PMV)', unit: '', category: 'wellbeing', numericOnly: true },
  { key: 'ppd', label: 'Percentage People Dissatisfied (PPD)', unit: '%', category: 'wellbeing', numericOnly: true },
  { key: 'daylightFactor', label: 'Daylight Factor', unit: '%', category: 'wellbeing', numericOnly: true },
  
  // Biodiversity
  { key: 'biodiversityNetGain', label: 'Biodiversity Net Gain', unit: '%', category: 'biodiversity', numericOnly: true },
  { key: 'habitatUnits', label: 'Habitat Units Gained', unit: 'units', category: 'biodiversity', numericOnly: true },
  { key: 'urbanGreeningFactor', label: 'Urban Greening Factor', unit: 'score', category: 'biodiversity', numericOnly: true },
  
  // Circular Economy
  { key: 'reusedRecycledMaterial', label: 'Reused/Recycled Material', unit: '% of total mass', category: 'circular', numericOnly: true },
  
  // Legacy KPIs for backward compatibility
  { key: 'carbonIntensity', label: 'Carbon Intensity', unit: 'kgCO2e/m²/yr', category: 'legacy', numericOnly: true },
  { key: 'eui', label: 'Energy Use Intensity (EUI)', unit: 'kWh/m²/yr', category: 'legacy', numericOnly: true },
  { key: 'shd', label: 'Solar Heat Demand (SHD)', unit: 'kWh/m²/yr', category: 'legacy', numericOnly: true },
  { key: 'wlc', label: 'Whole Life Carbon (WLC)', unit: 'kgCO2e/m²', category: 'legacy', numericOnly: true },
];
