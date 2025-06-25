
export interface Project {
  id: string;
  name: string;
  typology: 'office' | 'residential' | 'educational' | 'healthcare' | 'retail' | 'mixed-use';
  location: string;
  completionDate: string;
  carbonIntensity: number; // kgCO2e/m²/yr
  operationalEnergy: number; // kWh/m²/yr
  certifications?: string[];
  area?: number; // m²
}
