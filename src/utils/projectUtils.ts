
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
    'Warehouse': 'Commercial',
    'Retail': 'Commercial',
    'Commercial': 'Commercial',
    'Residential': 'Residential',
    'Housing': 'Residential',
    'Apartment': 'Residential',
    'School': 'Education',
    'University': 'Education',
    'Education': 'Education',
    'Hospital': 'Healthcare',
    'Healthcare': 'Healthcare',
    'Medical': 'Healthcare',
    'Infrastructure': 'Infrastructure',
    'Transport': 'Infrastructure',
    'Civic': 'CCC',
    'Community': 'CCC',
    'Cultural': 'CCC',
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
    color: '#39F8D0', 
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
