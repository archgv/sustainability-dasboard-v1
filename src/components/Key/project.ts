import { SectorKey } from "./KeySector";
import { StageKey } from "./KeyStage";

export interface Project {
  id: string;
  "Project Name": string;
  "Project Location": string;
  "Primary Sector": SectorKey;
  "Sub Sector"?: string;
  "Project Type": "New Build" | "Retrofit";
  "Heritage Project"?: string;
  "Studio Discipline"?: string;
  Neighbourhood?: string;

  "Operational Energy Existing Building"?: number;
  GIA: number;
  "Building Lifespan"?: number;
  "PC Date": string;

  "EI Team Scope"?: string;
  "External Consultants"?: string;
  "Sustianability Champion Name"?: string;
  "Mission Statement"?: string;

  BREEAM: string;
  LEED: string;
  WELL: string;
  Fitwell: string;
  Passivhaus: string;
  EnerPHit: string;
  UKNZCBS: string;
  NABERS: string;
  "Other Cerification"?: string;

  "Current RIBA Stage": StageKey;

  "RIBA Stage": {
    [K in StageKey]: {
      "Updated GIA"?: number;
      "Method Energy Measurement"?: string;

      "Operational Energy Total": number;
      "Operational Energy Part L": number;
      "Operational Energy Gas": number;

      "Space Heating Demand": number;

      "Total Renewable Energy Generation": number;
      "Renewable Energy Type"?: string;
      "EPC Rating"?: string;

      "Embodied Carbon Measurement Method"?: string;
      "Upfront Carbon": number;
      "Total Embodied Carbon": number;
      "Structural Frame Materials"?: string;

      "Biogenic Carbon"?: number;
      "Embodied Carbon Scope Clarifications"?: string;

      "Biodiversity Net Gain": number;
      "Habitats Units Gained": number;

      "Urban Greening Factor": number;
      "General Biodiversity Clarification Notes"?: string;
    };
  };
}
