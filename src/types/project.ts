// RIBA Stage-specific data interface
export interface RibaStageData {
  ribaStage: 'stage-0-1' | 'stage-2' | 'stage-3' | 'stage-4' | 'stage-5' | 'stage-6' | 'stage-7';
  updateGIAOnlyDifferent?: number; // m²
  methodEnergyMeasurement?: string;
  operationalEnergyTotal?: number; // kWh/m²/year
  operationalEnergyPartL?: number; // kWh/m²/year
  operationalEnergyGas?: number; // kWh/m²/year
  spaceHeatingDemand?: number; // kWh/m²/year
  renewableEnergyType?: string;
  totalRenewableEnergyGeneration?: number; // kWh/year
  structuralFrameMaterials?: string;
  upfrontCarbon?: number; // kgCO2e/m²
  totalEmbodiedCarbon?: number; // kgCO2e/m²
  biogenicCarbon?: number; // kgCO2e/m²
  embodiedCarbonScopeClarifications?: string;
  biodiversityNetGain?: number; // %
  habitatsUnitsGained?: number;
  urbanGreeningFactor?: number;
  generalClarificationNotes?: string;
}

export interface Project {
  // Project Selection & Basic Info (Screen 1 & 2)
  id: string;
  projectName: string; // Previously 'name'
  projectLocation: string; // Previously 'location'
  primarySector: 'Residential' | 'Education' | 'Healthcare' | 'Infrastructure' | 'CCC' | 'Workplace'; // Previously 'typology'
  subSector?: string;
  projectType: 'New build' | 'Retrofit' | 'Retrofit + extension'; // Previously 'new-build' | 'retrofit'
  heritageProject?: boolean;
  studioDiscipline?: string;
  neighbourhood?: string;
  operationalEnergyEB?: number; // kWh/m²/year - operational energy of existing building
  gia: number; // m² - Gross Internal Area
  buildingLifespan?: number; // years
  pcDate: string; // Practical Completion date - previously 'completionDate'
  eiTeamScope?: string;
  exSustConsultant?: string; // External sustainability consultant
  sustChampionName?: string; // Sustainability champion name
  missionStatement?: string; // Max 250 characters
  
  // Certifications (Project level data only)
  breeam?: string;
  leed?: string;
  well?: string;
  fitwel?: string;
  passivhausOrEnePHit?: string;
  uknzcbs?: string;
  nabers?: string;
  otherCertification?: string;
  
  // RIBA Stage-specific data (Screen 3-9 for each stage)
  ribaStageData: RibaStageData[];
  
  // Legacy fields for backward compatibility
  name?: string; // Maps to projectName
  location?: string; // Maps to projectLocation
  typology?: 'office' | 'residential' | 'educational' | 'healthcare' | 'retail' | 'mixed-use' | 'CCC' | 'infrastructure';
  completionDate?: string; // Maps to pcDate
  ribaStage?: 'stage-1' | 'stage-2' | 'stage-3' | 'stage-4' | 'stage-5' | 'stage-6' | 'stage-7';
  
  // Legacy operational energy (for backward compatibility)
  operationalEnergyTotal?: number;
  operationalEnergyPartL?: number;
  operationalEnergyGas?: number;
  operationalEnergy?: number;
  gasUsage?: number;
  spaceHeatingDemand?: number;
  renewableEnergyGeneration?: number;
  existingBuildingEnergy?: number;
  
  // Legacy embodied carbon (for backward compatibility)
  upfrontCarbon?: number;
  totalEmbodiedCarbon?: number;
  biogenicCarbon?: number;
  refrigerants?: number;
  
  // Legacy other fields (for backward compatibility)
  operationalWaterUse?: number;
  passivhaus?: boolean;
  socialValue?: number;
  pmv?: number;
  ppd?: number;
  daylightFactor?: number;
  biodiversityNetGain?: number;
  habitatUnits?: number;
  urbanGreeningFactor?: number;
  ozoneDepletion?: number;
  reusedRecycledMaterial?: number;
  carbonIntensity?: number;
  eui?: number;
  shd?: number;
  wlc?: number;
  certifications?: string[];
  
  // Embodied carbon breakdown (for backward compatibility)
  embodiedCarbonBreakdown?: {
    byLifeCycleStage: {
      a1a3: number;
      a4: number;
      a5: number;
      b1b7: number;
      c1c4: number;
      d: number;
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
  { key: 'biodiversityNetGain', label: 'Biodiversity net gain', unit: '%', category: 'biodiversity', numericOnly: true },
  { key: 'habitatUnits', label: 'Habitat Units Gained', unit: 'units', category: 'biodiversity', numericOnly: true },
  { key: 'urbanGreeningFactor', label: 'Urban greening factor', unit: '%', category: 'biodiversity', numericOnly: true },
  
  // Circular Economy
  { key: 'reusedRecycledMaterial', label: 'Reused/Recycled Material', unit: '% of total mass', category: 'circular', numericOnly: true },
  
  // Legacy KPIs for backward compatibility
  { key: 'carbonIntensity', label: 'Carbon Intensity', unit: 'kgCO2e/m²/yr', category: 'legacy', numericOnly: true },
  { key: 'eui', label: 'Energy Use Intensity (EUI)', unit: 'kWh/m²/yr', category: 'legacy', numericOnly: true },
  { key: 'shd', label: 'Solar Heat Demand (SHD)', unit: 'kWh/m²/yr', category: 'legacy', numericOnly: true },
  { key: 'wlc', label: 'Whole Life Carbon (WLC)', unit: 'kgCO2e/m²', category: 'legacy', numericOnly: true },
];
