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
}

export interface KPIOption {
  key: keyof Project;
  label: string;
  unit: string;
  category: 'embodied-carbon' | 'operational-energy' | 'water' | 'accreditation' | 'social' | 'wellbeing' | 'biodiversity' | 'circular' | 'legacy';
  numericOnly?: boolean;
}

export const availableKPIs: KPIOption[] = [
  // Project level fields
  { key: 'gia', label: 'GIA', unit: 'm²', category: 'operational-energy', numericOnly: true },
  { key: 'operationalEnergyEB', label: 'Existing Building Energy', unit: 'kWh/m²/year', category: 'operational-energy', numericOnly: true },
  { key: 'buildingLifespan', label: 'Building Lifespan', unit: 'years', category: 'operational-energy', numericOnly: true },
];
