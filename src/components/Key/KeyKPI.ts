import { Project } from './project';

export interface KPIOption {
	key: keyof Project;
	unit: string;
	totalUnit: string;
	numericOnly?: boolean;
}

export const KPIOptions: KPIOption[] = [
	{
		key: 'Operational Energy Total',
		unit: 'kWh/m²/year',
		totalUnit: 'MWh/yr',
		numericOnly: true,
	},
	{
		key: 'Operational Energy Part L',
		unit: 'kWh/m²/year',
		totalUnit: 'MWh/yr',
		numericOnly: true,
	},
	{
		key: 'Operational Energy Gas',
		unit: 'kWh/m²/year',
		totalUnit: 'MWh/yr',
		numericOnly: true,
	},

	{
		key: 'Space Heating Demand',
		unit: 'kWh/m²/year',
		totalUnit: 'MWh/yr',
		numericOnly: true,
	},
	{
		key: 'Total Renewable Energy Generation',
		unit: 'kWh/m²/year',
		totalUnit: 'MWh/yr',
		numericOnly: true,
	},

	{
		key: 'Upfront Carbon',
		unit: 'kgCO2e/m²',
		totalUnit: 'tCO₂e',
		numericOnly: true,
	},
	{
		key: 'Total Embodied Carbon',
		unit: 'kgCO2e/m²',
		totalUnit: 'tCO₂e',
		numericOnly: true,
	},
	{
		key: 'Biogenic Carbon',
		unit: 'kgCO2e/m²',
		totalUnit: 'MWh/yr',
		numericOnly: true,
	},

	{
		key: 'Biodiversity Net Gain',
		unit: '%',
		totalUnit: '%',
		numericOnly: true,
	},
	{
		key: 'Habitats Units Gained',
		unit: 'units',
		totalUnit: 'units',
		numericOnly: true,
	},
	{
		key: 'Urban Greening Factor',
		unit: '%',
		totalUnit: '%',
		numericOnly: true,
	},
];
