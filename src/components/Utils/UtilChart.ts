import { KPIOptions } from './project';

export type ChartType = 'Compare Two' | 'Single Project' | 'Single Time';
export type ValueType = 'total' | 'average';

// Define the 10 specific KPIs for charts
export const chartKPIs = [
	'Operational Energy Total',
	'Operational Energy Part L',
	'Operational Energy Gas',
	'Space Heating Demand',
	'Total Renewable Energy Generation',
	'Upfront Carbon',
	'Total Embodied Carbon',
	'Biogenic Carbon',
	'Biodiversity Net Gain',
	'Urban Greening Factor',
];

// Filter KPIOptions to only include the chart KPIs
export const filteredKPIs = KPIOptions.filter((kpi) => chartKPIs.includes(kpi.key));

// KPI compatibility matrix
export const kpiCompatibilityMatrix: Record<string, string[]> = {
	'Operational Energy Total': [
		'Operational Energy Part L',
		'Operational Energy Gas',
		'Space Heating Demand',
		'Total Renewable Energy Generation',
		'Upfront Carbon',
		'Total Embodied Carbon',
		'Biogenic Carbon',
	],
	'Operational Energy Part L': [
		'Operational Energy Total',
		'Operational Energy Gas',
		'Space Heating Demand',
		'Total Renewable Energy Generation',
		'Upfront Carbon',
		'Total Embodied Carbon',
		'Biogenic Carbon',
	],
	'Operational Energy Gas': [
		'Operational Energy Total',
		'Operational Energy Part L',
		'Space Heating Demand',
		'Total Renewable Energy Generation',
		'Upfront Carbon',
		'Total Embodied Carbon',
		'Biogenic Carbon',
	],
	'Space Heating Demand': [
		'Operational Energy Total',
		'Operational Energy Part L',
		'Operational Energy Gas',
		'Total Renewable Energy Generation',
		'Upfront Carbon',
		'Total Embodied Carbon',
		'Biogenic Carbon',
	],
	'Total Renewable Energy Generation': [
		'Operational Energy Total',
		'Operational Energy Part L',
		'Operational Energy Gas',
		'Space Heating Demand',
		'Upfront Carbon',
		'Total Embodied Carbon',
		'Biogenic Carbon',
	],
	'Upfront Carbon': [
		'Operational Energy Total',
		'Operational Energy Part L',
		'Operational Energy Gas',
		'Space Heating Demand',
		'Total Renewable Energy Generation',
		'Total Embodied Carbon',
		'Biogenic Carbon',
	],
	'Total Embodied Carbon': [
		'Operational Energy Total',
		'Operational Energy Part L',
		'Operational Energy Gas',
		'Space Heating Demand',
		'Total Renewable Energy Generation',
		'Upfront Carbon',
		'Biogenic Carbon',
	],
	'Biogenic Carbon': [
		'Operational Energy Total',
		'Operational Energy Part L',
		'Operational Energy Gas',
		'Space Heating Demand',
		'Total Renewable Energy Generation',
		'Upfront Carbon',
		'Total Embodied Carbon',
	],
	'Biodiversity Net Gain': ['Urban Greening Factor'],
	'Urban Greening Factor': ['Biodiversity Net Gain'],
};

// Mock building area data for demonstration
export const getProjectArea = (projectId: string): number => {
	const areas: Record<string, number> = {
		'1': 15000, // Green Office Tower
		'2': 8500, // Sustainable Housing Complex
		'3': 22000, // Innovation Campus
		'4': 12000, // Community Health Center
		'5': 18000, // Urban Retail Hub
	};
	return areas[projectId] || 10000;
};
