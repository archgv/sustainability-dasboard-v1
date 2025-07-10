
import { Project } from '@/types/project';

export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'UCLUnlockingBloomsbury',
    typology: 'office',
    location: 'London, UK',
    completionDate: '2023-05-15',
    projectType: 'new-build',
    ribaStage: 'stage-4',
    
    // Embodied Carbon
    upfrontCarbon: 650,
    totalEmbodiedCarbon: 750,
    refrigerants: 15,
    
    // Operational Energy
    operationalEnergy: 65,
    gasUsage: 25,
    spaceHeatingDemand: 35,
    renewableEnergyGeneration: 20,
    existingBuildingEnergy: 0,
    
    // Water Use
    operationalWaterUse: 120,
    
    // Accreditations
    breeam: 'Excellent',
    leed: 'N/A',
    well: 'N/A',
    nabers: 'N/A',
    passivhaus: false,
    
    // Social Value
    socialValue: 0.15,
    
    // Wellbeing
    pmv: 0.2,
    ppd: 8,
    daylightFactor: 2.5,
    
    // Biodiversity
    biodiversityNetGain: 15,
    habitatUnits: 25,
    urbanGreeningFactor: 0.4,
    
    // Embodied Impacts
    ozoneDepletion: 0.002,
    
    // Circular Economy
    reusedRecycledMaterial: 25,
    
    // Legacy fields
    carbonIntensity: 25,
    eui: 68,
    shd: 15,
    wlc: 1250,
    
    certifications: ['BREEAM Excellent'],
    
    embodiedCarbonBreakdown: {
      byLifeCycleStage: {
        a1a3: 280,
        a4: 20,
        a5: 35,
        b1b7: 95,
        c1c4: 15,
        d: -5
      },
      byBuildingElement: {
        substructure: 85,
        superstructure: 180,
        finishes: 65,
        fittings: 45,
        services: 55,
        external: 20
      }
    }
  },
  {
    id: '2',
    name: 'UHNElectiveSurgicalHub',
    typology: 'healthcare',
    location: 'Manchester, UK',
    completionDate: '2022-11-20',
    projectType: 'new-build',
    ribaStage: 'stage-7',
    
    // Embodied Carbon
    upfrontCarbon: 620,
    totalEmbodiedCarbon: 680,
    refrigerants: 8,
    
    // Operational Energy
    operationalEnergy: 45,
    gasUsage: 15,
    spaceHeatingDemand: 25,
    renewableEnergyGeneration: 35,
    existingBuildingEnergy: 0,
    
    // Water Use
    operationalWaterUse: 95,
    
    // Accreditations
    breeam: 'N/A',
    leed: 'N/A',
    well: 'Silver',
    nabers: 'N/A',
    passivhaus: true,
    
    // Social Value
    socialValue: 0.12,
    
    // Wellbeing
    pmv: 0.1,
    ppd: 5,
    daylightFactor: 3.2,
    
    // Biodiversity
    biodiversityNetGain: 22,
    habitatUnits: 35,
    urbanGreeningFactor: 0.5,
    
    // Embodied Impacts
    ozoneDepletion: 0.001,
    
    // Circular Economy
    reusedRecycledMaterial: 35,
    
    // Legacy fields
    carbonIntensity: 18,
    eui: 42,
    shd: 12,
    wlc: 950,
    
    certifications: ['Passivhaus', 'WELL Silver']
  },
  {
    id: '3',
    name: 'TTTrongate',
    typology: 'mixed-use',
    location: 'Glasgow, UK',
    completionDate: '2023-08-30',
    projectType: 'new-build',
    ribaStage: 'stage-5',
    
    // Embodied Carbon
    upfrontCarbon: 780,
    totalEmbodiedCarbon: 820,
    refrigerants: 25,
    
    // Operational Energy
    operationalEnergy: 85,
    gasUsage: 35,
    spaceHeatingDemand: 45,
    renewableEnergyGeneration: 15,
    existingBuildingEnergy: 0,
    
    // Water Use
    operationalWaterUse: 150,
    
    // Accreditations
    breeam: 'Outstanding',
    leed: 'Platinum',
    well: 'N/A',
    nabers: 'N/A',
    passivhaus: false,
    
    // Social Value
    socialValue: 0.18,
    
    // Wellbeing
    pmv: 0.3,
    ppd: 12,
    daylightFactor: 2.8,
    
    // Biodiversity
    biodiversityNetGain: 18,
    habitatUnits: 28,
    urbanGreeningFactor: 0.35,
    
    // Embodied Impacts
    ozoneDepletion: 0.003,
    
    // Circular Economy
    reusedRecycledMaterial: 18,
    
    // Legacy fields
    carbonIntensity: 35,
    eui: 88,
    shd: 22,
    wlc: 1680,
    
    certifications: ['BREEAM Outstanding', 'LEED Platinum']
  },
  {
    id: '4',
    name: 'HSEAcuteCorkKerryFwk',
    typology: 'healthcare',
    location: 'Cork, Ireland',
    completionDate: '2021-09-12',
    projectType: 'retrofit',
    ribaStage: 'stage-7',
    
    // Embodied Carbon
    upfrontCarbon: 850,
    totalEmbodiedCarbon: 900,
    refrigerants: 35,
    
    // Operational Energy
    operationalEnergy: 95,
    gasUsage: 45,
    spaceHeatingDemand: 55,
    renewableEnergyGeneration: 10,
    existingBuildingEnergy: 120,
    
    // Water Use
    operationalWaterUse: 180,
    
    // Accreditations
    breeam: 'Very Good',
    leed: 'N/A',
    well: 'Gold',
    nabers: 'N/A',
    passivhaus: false,
    
    // Social Value
    socialValue: 0.22,
    
    // Wellbeing
    pmv: 0.0,
    ppd: 6,
    daylightFactor: 2.1,
    
    // Biodiversity
    biodiversityNetGain: 8,
    habitatUnits: 12,
    urbanGreeningFactor: 0.25,
    
    // Embodied Impacts
    ozoneDepletion: 0.004,
    
    // Circular Economy
    reusedRecycledMaterial: 45,
    
    // Legacy fields
    carbonIntensity: 42,
    eui: 98,
    shd: 25,
    wlc: 1950,
    
    certifications: ['BREEAM Very Good', 'WELL Gold']
  },
  {
    id: '5',
    name: 'OUStCrossBuilding',
    typology: 'educational',
    location: 'Oxford, UK',
    completionDate: '2020-03-18',
    projectType: 'new-build',
    ribaStage: 'stage-7',
    
    // Embodied Carbon
    upfrontCarbon: 720,
    totalEmbodiedCarbon: 780,
    refrigerants: 28,
    
    // Operational Energy
    operationalEnergy: 120,
    gasUsage: 50,
    spaceHeatingDemand: 65,
    renewableEnergyGeneration: 8,
    existingBuildingEnergy: 0,
    
    // Water Use
    operationalWaterUse: 200,
    
    // Accreditations
    breeam: 'Good',
    leed: 'Gold',
    well: 'N/A',
    nabers: 'N/A',
    passivhaus: false,
    
    // Social Value
    socialValue: 0.08,
    
    // Wellbeing
    pmv: 0.4,
    ppd: 15,
    daylightFactor: 1.8,
    
    // Biodiversity
    biodiversityNetGain: 5,
    habitatUnits: 8,
    urbanGreeningFactor: 0.2,
    
    // Embodied Impacts
    ozoneDepletion: 0.005,
    
    // Circular Economy
    reusedRecycledMaterial: 12,
    
    // Legacy fields
    carbonIntensity: 55,
    eui: 125,
    shd: 35,
    wlc: 2200,
    
    certifications: ['BREEAM Good', 'LEED Gold']
  }
];
