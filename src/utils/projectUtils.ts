
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

// Map project typology to sector
export const getSector = (typology: string): string => {
  const sectorMap: Record<string, string> = {
    'Office': 'Commercial',
    'office': 'Commercial',
    'Warehouse': 'Commercial',
    'warehouse': 'Commercial',
    'Retail': 'Commercial',
    'retail': 'Commercial',
    'Commercial': 'Commercial',
    'commercial': 'Commercial',
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
  };
  
  return sectorMap[typology] || 'Commercial';
};

// Sector color and shape mapping
export const sectorConfig = {
  'Residential': { 
    color: '#FD7B7B', 
    shape: 'square',
    name: 'Residential'
  },
  'Education': { 
    color: '#88F7FC', 
    shape: 'triangle',
    name: 'Education'
  },
  'Healthcare': { 
    color: '#767260', 
    shape: 'star',
    name: 'Healthcare'
  },
  'Infrastructure': { 
    color: '#FF8EE5', 
    shape: 'circle',
    name: 'Infrastructure'
  },
  'CCC': { 
    color: '#253E2C', 
    shape: 'diamond',
    name: 'CCC'
  },
  'Commercial': { 
    color: '#39FF8D', 
    shape: 'pentagon',
    name: 'Commercial'
  }
};

// Get sector color
export const getSectorColor = (typology: string): string => {
  const sector = getSector(typology);
  return sectorConfig[sector as keyof typeof sectorConfig]?.color || sectorConfig.Commercial.color;
};

// Get sector shape
export const getSectorShape = (typology: string): string => {
  const sector = getSector(typology);
  return sectorConfig[sector as keyof typeof sectorConfig]?.shape || sectorConfig.Commercial.shape;
};
