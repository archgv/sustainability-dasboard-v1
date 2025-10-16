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

  "Operational Energy Existing Building"?: number; //ONLY IN PORTFOLIO
  GIA: number; // Gross Internal Area in m²
  "Building Lifespan"?: number; // NOT USED
  "PC Date": string; // DROPDOWN

  "EI Team Scope"?: string; // NOT USED
  "External Consultants"?: string; // NOT USED
  "Sustianability Champion Name"?: string; // NOT USED
  "Mission Statement"?: string; // NOT USED

  // Accreditations
  BREEAM: string;
  LEED: string;
  WELL: string;
  Fitwell: string; //1-5 stars xxx not on the list
  Passivhaus: string; // Unknown, Cetified, Not Targeted xxx doesnt work
  EnerPHit: string; // Unknown, Cetified, Not Targeted xxx doesnt work
  UKNZCBS: string; // Unknown, Cetified + year
  NABERS: string; //1-6 stars
  "Other Cerification"?: string; //? // TEXT

  "Current RIBA Stage": StageKey;

  "RIBA Stage": {
    [K in StageKey]: {
      "Updated GIA"?: number; // mess
      "Method Energy Measurement"?: string; // waiting to be used

      "Operational Energy Total": number;
      "Operational Energy Part L": number;
      "Operational Energy Gas": number;

      "Space Heating Demand": number;

      "Total Renewable Energy Generation": number;
      "Renewable Energy Type"?: string; // tooltip in chart for total renewable energy generation

      "Upfront Carbon": number;
      "Total Embodied Carbon": number;
      "Structural Frame Materials"?: string; // tool tip for upfront carbon and total embodied carbon

      "Biogenic Carbon"?: number;
      "Embodied Carbon Scope Clarifications"?: string;

      "Biodiversity Net Gain": number;
      "Habitats Units Gained": number; // tool tip for biodiversity net gain

      "Urban Greening Factor": number;
      "General Biodiversity Clarification Notes"?: string;
    };
  };
}
