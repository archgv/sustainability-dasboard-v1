// Sector color and shape mapping
export const sectorConfig = {
	'Residential': {
		color: '#FD7B7B',
		benchmarkColor: '#C94F4F',
		shape: 'square',
		name: 'Residential',
	},
	'Education': {
		color: '#88F7FC',
		benchmarkColor: '#3BBCC2',
		shape: 'triangle',
		name: 'Education',
	},
	'Healthcare': {
		color: '#767260',
		benchmarkColor: '#4F4B3F',
		shape: 'star',
		name: 'Healthcare',
	},
	'Infrastructure': {
		color: '#FF8EE5',
		benchmarkColor: '#C75BAF',
		shape: 'circle',
		name: 'Infrastructure',
	},
	'CCC': {
		color: '#253E2C',
		benchmarkColor: '#0F1A14',
		shape: 'diamond',
		name: 'CCC',
	},
	'Workplace': {
		color: '#39FF8D',
		benchmarkColor: '#1E9F5A',
		shape: 'pentagon',
		name: 'Workplace',
	},
};

// Get sector color
export const getSectorColor = (sector: string): string => {
	return sectorConfig[sector as keyof typeof sectorConfig]?.color || sectorConfig.Workplace.color;
};

// Get sector shape
export const getSectorShape = (sector: string): string => {
	return sectorConfig[sector as keyof typeof sectorConfig]?.shape || sectorConfig.Workplace.shape;
};

// Get sector benchmark color
export const getSectorBenchmarkColor = (sector: string): string => {
	return sectorConfig[sector as keyof typeof sectorConfig]?.benchmarkColor || sectorConfig.Workplace.benchmarkColor;
};
