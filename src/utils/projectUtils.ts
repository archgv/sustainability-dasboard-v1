
// Generate project numbers starting with 23
export const generateProjectNumber = (index: number): string => {
  const baseNumber = 230150 + index + 1;
  return baseNumber.toString();
};

// Add project numbers to project names
export const addProjectNumberToName = (name: string, index: number): string => {
  const projectNumber = generateProjectNumber(index);
  return `${projectNumber} ${name}`;
};

// Map primary sector to display name
export const getSector = (primarySector: string): string => {
  return primarySector || 'Workplace';
};

// Legacy function for backward compatibility - maps old typology to new primarySector
export const getSectorFromTypology = (typology: string): string => {
  const sectorMap: Record<string, string> = {
    'Office': 'Workplace',
    'office': 'Workplace',
    'Warehouse': 'Workplace',
    'warehouse': 'Workplace',
    'Retail': 'Workplace',
    'retail': 'Workplace',
    'Commercial': 'Workplace',
    'commercial': 'Workplace',
    'Residential': 'Residential',
    'residential': 'Residential',
    'Housing': 'Residential',
    'housing': 'Residential',
    'Apartment': 'Residential',
    'apartment': 'Residential',
    'School': 'Education',
    'school': 'Education',
    'University': 'Education',
    'university': 'Education',
    'Education': 'Education',
    'education': 'Education',
    'Educational': 'Education',
    'educational': 'Education',
    'Hospital': 'Healthcare',
    'hospital': 'Healthcare',
    'Healthcare': 'Healthcare',
    'healthcare': 'Healthcare',
    'Medical': 'Healthcare',
    'medical': 'Healthcare',
    'Infrastructure': 'Infrastructure',
    'infrastructure': 'Infrastructure',
    'Transport': 'Infrastructure',
    'transport': 'Infrastructure',
    'Civic': 'CCC',
    'civic': 'CCC',
    'Community': 'CCC',
    'community': 'CCC',
    'Cultural': 'CCC',
    'cultural': 'CCC',
    'CCC': 'CCC',
    'ccc': 'CCC',
  };
  
  return sectorMap[typology] || 'Workplace';
};

// Sector color and shape mapping
export const sectorConfig = {
  'Residential': { 
    color: '#FD7B7B', 
    benchmarkColor: '#C94F4F',
    shape: 'square',
    name: 'Residential'
  },
  'Education': { 
    color: '#88F7FC', 
    benchmarkColor: '#3BBCC2',
    shape: 'triangle',
    name: 'Education'
  },
  'Healthcare': { 
    color: '#767260', 
    benchmarkColor: '#4F4B3F',
    shape: 'star',
    name: 'Healthcare'
  },
  'Infrastructure': { 
    color: '#FF8EE5', 
    benchmarkColor: '#C75BAF',
    shape: 'circle',
    name: 'Infrastructure'
  },
  'CCC': { 
    color: '#253E2C', 
    benchmarkColor: '#0F1A14',
    shape: 'diamond',
    name: 'CCC'
  },
  'Workplace': { 
    color: '#39FF8D', 
    benchmarkColor: '#1E9F5A',
    shape: 'pentagon',
    name: 'Workplace'
  }
};

// Get sector color from primarySector
export const getSectorColor = (primarySector: string): string => {
  const sector = getSector(primarySector);
  return sectorConfig[sector as keyof typeof sectorConfig]?.color || sectorConfig.Workplace.color;
};

// Get sector shape from primarySector
export const getSectorShape = (primarySector: string): string => {
  const sector = getSector(primarySector);
  return sectorConfig[sector as keyof typeof sectorConfig]?.shape || sectorConfig.Workplace.shape;
};

// Get sector benchmark color from primarySector
export const getSectorBenchmarkColor = (primarySector: string): string => {
  const sector = getSector(primarySector);
  return sectorConfig[sector as keyof typeof sectorConfig]?.benchmarkColor || sectorConfig.Workplace.benchmarkColor;
};
