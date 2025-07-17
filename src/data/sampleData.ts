
import { Project } from '@/types/project';

export const sampleProjects: Project[] = [
  {
    id: '1',
    name: '230151 Green Office Tower',
    typology: 'office',
    location: 'London, UK',
    completionDate: '2023-06-15',
    gia: 9800,
    projectType: 'new-build',
    ribaStage: 'stage-7',
    
    // Embodied Carbon
    upfrontCarbon: 450,
    totalEmbodiedCarbon: 650,
    refrigerants: 15,
    
    // Operational Energy
    operationalEnergy: 75,
    gasUsage: 25,
    spaceHeatingDemand: 30,
    renewableEnergyGeneration: 20,
    existingBuildingEnergy: 0,
    
    // Water Use
    operationalWaterUse: 45,
    
    // Accreditations
    breeam: 'Excellent',
    leed: 'Gold',
    well: 'Silver',
    nabers: '5 Star',
    passivhaus: true,
    
    // Social Value
    socialValue: 1.2,
    
    // Wellbeing
    pmv: 0.2,
    ppd: 8,
    daylightFactor: 2.5,
    
    // Biodiversity
    biodiversityNetGain: 15,
    habitatUnits: 12,
    urbanGreeningFactor: 0.4,
    
    // Embodied Impacts
    ozoneDepletion: 0.001,
    
    // Circular Economy
    reusedRecycledMaterial: 25,
    
    // Legacy fields
    carbonIntensity: 110,
    eui: 75,
    shd: 30,
    wlc: 650,
    
    certifications: ['UKNZCBS - Net Zero']
  },
  {
    id: '2', 
    name: '230152 Eco Housing Development',
    typology: 'residential',
    location: 'Manchester, UK',
    completionDate: '2022-11-30',
    gia: 12500,
    projectType: 'new-build',
    ribaStage: 'stage-7',
    
    // Embodied Carbon
    upfrontCarbon: 520,
    totalEmbodiedCarbon: 720,
    refrigerants: 18,
    
    // Operational Energy
    operationalEnergy: 90,
    gasUsage: 35,
    spaceHeatingDemand: 40,
    renewableEnergyGeneration: 15,
    existingBuildingEnergy: 0,
    
    // Water Use
    operationalWaterUse: 50,
    
    // Accreditations
    breeam: 'Very Good',
    leed: 'Silver',
    well: 'Bronze',
    nabers: '4 Star',
    passivhaus: false,
    
    // Social Value
    socialValue: 1.1,
    
    // Wellbeing
    pmv: 0.3,
    ppd: 12,
    daylightFactor: 2.2,
    
    // Biodiversity
    biodiversityNetGain: 10,
    habitatUnits: 8,
    urbanGreeningFactor: 0.3,
    
    // Embodied Impacts
    ozoneDepletion: 0.0012,
    
    // Circular Economy
    reusedRecycledMaterial: 20,
    
    // Legacy fields
    carbonIntensity: 130,
    eui: 90,
    shd: 40,
    wlc: 720,
    
    certifications: ['EnerPHit']
  },
  {
    id: '3',
    name: '230153 Sustainable School Campus',
    typology: 'educational', 
    location: 'Birmingham, UK',
    completionDate: '2023-01-20',
    gia: 15200,
    projectType: 'new-build',
    ribaStage: 'stage-7',
    
    // Embodied Carbon
    upfrontCarbon: 380,
    totalEmbodiedCarbon: 580,
    refrigerants: 12,
    
    // Operational Energy
    operationalEnergy: 65,
    gasUsage: 20,
    spaceHeatingDemand: 25,
    renewableEnergyGeneration: 25,
    existingBuildingEnergy: 0,
    
    // Water Use
    operationalWaterUse: 40,
    
    // Accreditations
    breeam: 'Outstanding',
    leed: 'Platinum',
    well: 'Gold',
    nabers: '6 Star',
    passivhaus: true,
    
    // Social Value
    socialValue: 1.4,
    
    // Wellbeing
    pmv: 0.1,
    ppd: 6,
    daylightFactor: 3.0,
    
    // Biodiversity
    biodiversityNetGain: 20,
    habitatUnits: 15,
    urbanGreeningFactor: 0.5,
    
    // Embodied Impacts
    ozoneDepletion: 0.0008,
    
    // Circular Economy
    reusedRecycledMaterial: 30,
    
    // Legacy fields
    carbonIntensity: 100,
    eui: 65,
    shd: 25,
    wlc: 580,
    
    certifications: ['UKNZCBS - Near Zero']
  },
  {
    id: '4',
    name: '230154 Modern Hospital Wing',
    typology: 'healthcare',
    location: 'Leeds, UK', 
    completionDate: '2021-08-10',
    gia: 18900,
    projectType: 'retrofit',
    ribaStage: 'stage-7',
    
    // Embodied Carbon
    upfrontCarbon: 600,
    totalEmbodiedCarbon: 800,
    refrigerants: 25,
    
    // Operational Energy
    operationalEnergy: 110,
    gasUsage: 45,
    spaceHeatingDemand: 50,
    renewableEnergyGeneration: 10,
    existingBuildingEnergy: 180,
    
    // Water Use
    operationalWaterUse: 60,
    
    // Accreditations
    breeam: 'Good',
    leed: 'Certified',
    well: 'N/A',
    nabers: '3 Star',
    passivhaus: false,
    
    // Social Value
    socialValue: 0.9,
    
    // Wellbeing
    pmv: 0.4,
    ppd: 15,
    daylightFactor: 1.8,
    
    // Biodiversity
    biodiversityNetGain: 5,
    habitatUnits: 4,
    urbanGreeningFactor: 0.2,
    
    // Embodied Impacts
    ozoneDepletion: 0.0015,
    
    // Circular Economy
    reusedRecycledMaterial: 15,
    
    // Legacy fields
    carbonIntensity: 150,
    eui: 110,
    shd: 50,
    wlc: 800,
    
    certifications: []
  },
  {
    id: '5',
    name: '230155 Retail Innovation Hub',
    typology: 'retail',
    location: 'Bristol, UK',
    completionDate: '2022-03-25',
    gia: 8500,
    projectType: 'new-build',
    ribaStage: 'stage-7',
    
    // Embodied Carbon
    upfrontCarbon: 480,
    totalEmbodiedCarbon: 700,
    refrigerants: 20,
    
    // Operational Energy
    operationalEnergy: 80,
    gasUsage: 30,
    spaceHeatingDemand: 35,
    renewableEnergyGeneration: 18,
    existingBuildingEnergy: 0,
    
    // Water Use
    operationalWaterUse: 48,
    
    // Accreditations
    breeam: 'Very Good',
    leed: 'Gold',
    well: 'Silver',
    nabers: '5 Star',
    passivhaus: false,
    
    // Social Value
    socialValue: 1.0,
    
    // Wellbeing
    pmv: 0.25,
    ppd: 10,
    daylightFactor: 2.3,
    
    // Biodiversity
    biodiversityNetGain: 12,
    habitatUnits: 9,
    urbanGreeningFactor: 0.35,
    
    // Embodied Impacts
    ozoneDepletion: 0.0011,
    
    // Circular Economy
    reusedRecycledMaterial: 22,
    
    // Legacy fields
    carbonIntensity: 120,
    eui: 80,
    shd: 35,
    wlc: 700,
    
    certifications: ['EnerPHit']
  },
  {
    id: '6',
    name: '230156 Mixed Use Development',
    typology: 'mixed-use',
    location: 'Edinburgh, UK',
    completionDate: '2023-09-05',
    gia: 22000,
    projectType: 'new-build',
    ribaStage: 'stage-7',
    
    // Embodied Carbon
    upfrontCarbon: 400,
    totalEmbodiedCarbon: 600,
    refrigerants: 14,
    
    // Operational Energy
    operationalEnergy: 70,
    gasUsage: 22,
    spaceHeatingDemand: 28,
    renewableEnergyGeneration: 22,
    existingBuildingEnergy: 0,
    
    // Water Use
    operationalWaterUse: 42,
    
    // Accreditations
    breeam: 'Excellent',
    leed: 'Platinum',
    well: 'Gold',
    nabers: '6 Star',
    passivhaus: true,
    
    // Social Value
    socialValue: 1.3,
    
    // Wellbeing
    pmv: 0.15,
    ppd: 7,
    daylightFactor: 2.8,
    
    // Biodiversity
    biodiversityNetGain: 18,
    habitatUnits: 14,
    urbanGreeningFactor: 0.45,
    
    // Embodied Impacts
    ozoneDepletion: 0.0009,
    
    // Circular Economy
    reusedRecycledMaterial: 28,
    
    // Legacy fields
    carbonIntensity: 105,
    eui: 70,
    shd: 28,
    wlc: 600,
    
    certifications: ['UKNZCBS - Low Carbon']
  }
];
