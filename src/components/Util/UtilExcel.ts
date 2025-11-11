import * as XLSX from 'xlsx';
import { Project } from '../Key/project';
import { StageKeys } from '../Key/KeyStage';

export const exportToExcel = (projects: Project[]) => {
  // Define basic project fields (columns A to AB)
  const basicFields = [
    'id',
    'Project Name',
    'Project Location',
    'Primary Sector',
    'Sub Sector',
    'Project Type',
    'Heritage Project',
    'Studio Discipline',
    'Neighbourhood',
    'Operational Energy Existing Building',
    'GIA',
    'Building Lifespan',
    'PC Year',
    'Construction Start Year',
    'EI Team Scope',
    'External Consultants',
    'Project Lead',
    'Mission Statement',
    'BREEAM',
    'LEED',
    'WELL',
    'Fitwell',
    'Passivhaus',
    'EnerPHit',
    'UKNZCBS',
    'NABERS',
    'Other Cerification',
    'Current RIBA stage',
  ];

  // Define RIBA stage fields that repeat for each stage
  const stageFields = [
    'Updated GIA',
    'Method Energy Measurement',
    'Operational Energy Total',
    'Operational Energy Part L',
    'Operational Energy Gas',
    'Space Heating Demand',
    'Renewable Energy Type',
    'Total Renewable Energy Generation',
    'EPC Rating',
    'Embodied Carbon Measurement Method',
    'Structural Frame Materials',
    'Upfront Carbon',
    'Total Embodied Carbon',
    'Biogenic Carbon',
    'Embodied Carbon Scope Clarifications',
    'Biodiversity Net Gain',
    'Habitats Units Gained',
    'Urban Greening Factor',
    'General Biodiversity Clarification Notes',
  ];

  // Create Row 1: Stage numbers
  const row1: any[] = new Array(basicFields.length).fill('');
  StageKeys.forEach((stage) => {
    row1.push(...new Array(stageFields.length).fill(stage));
  });

  // Create Row 2: Field names
  const row2: any[] = [...basicFields];
  StageKeys.forEach(() => {
    row2.push(...stageFields);
  });

  // Create data rows
  const dataRows = projects.map((project) => {
    const row: any[] = [];
    
    // Add basic project fields
    basicFields.forEach((field) => {
      row.push(project[field as keyof Project] ?? '');
    });

    // Add RIBA stage data for each stage
    StageKeys.forEach((stage) => {
      const stageData = project['RIBA Stage'][stage];
      
      // Map the field names from stageFields to actual keys in the project data
      const fieldMapping: Record<string, string> = {
        'Updated GIA': 'Updated GIA',
        'Method Energy Measurement': 'Energy Measurement Method',
        'Operational Energy Total': 'Operational Energy',
        'Operational Energy Part L': 'Operational Energy Part L',
        'Operational Energy Gas': 'Operational Energy Gas',
        'Space Heating Demand': 'Space Heating Demand',
        'Renewable Energy Type': 'Renewable Energy Type',
        'Total Renewable Energy Generation': 'Renewable Energy Generation',
        'EPC Rating': 'EPC Rating',
        'Embodied Carbon Measurement Method': 'Embodied Carbon Measurement Method',
        'Structural Frame Materials': 'Structural Frame Materials',
        'Upfront Carbon': 'Upfront Carbon',
        'Total Embodied Carbon': 'Embodied Carbon',
        'Biogenic Carbon': 'Biogenic Carbon',
        'Embodied Carbon Scope Clarifications': 'Embodied Carbon Scope Clarifications',
        'Biodiversity Net Gain': 'Biodiversity Net Gain',
        'Habitats Units Gained': 'Habitats Units Gained',
        'Urban Greening Factor': 'Urban Greening Factor',
        'General Biodiversity Clarification Notes': 'General Biodiversity Clarification Notes',
      };

      stageFields.forEach((field) => {
        const actualKey = fieldMapping[field];
        row.push(stageData?.[actualKey as keyof typeof stageData] ?? '');
      });
    });

    return row;
  });

  // Combine all rows
  const allData = [row1, row2, ...dataRows];

  // Create worksheet and workbook
  const ws = XLSX.utils.aoa_to_sheet(allData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Projects');

  // Generate and download file
  XLSX.writeFile(wb, `project-data-export-${Date.now()}.xlsx`);
};
