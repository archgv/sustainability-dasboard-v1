import { Project } from './project';

export interface KPIOption {
	key: keyof Project;
	label: string;
	unit: string;
	totalUnit: string;
	unitBracket: string;
	totalUnitBracket: string;
}

const kWhm2yr = 'kWh/m²/yr';
const MWhyr = 'MWh/yr';
const kgCO2em2 = 'kgCO2e/m²';
const tCO2e = 'tCO₂e';
const kWhm2yrBracket = `(${kWhm2yr})`;
const MWhyrBracket = `(${MWhyr})`;
const kgCO2em2Bracket = `(${kgCO2em2})`;
const tCO2eBracket = `(${tCO2e})`;

export const KPIOptions: KPIOption[] = [
	{
		key: 'Operational Energy Total',
		label: 'Operational energy: reg & unreg',
		unit: kWhm2yr,
		totalUnit: MWhyr,
		unitBracket: kWhm2yrBracket,
		totalUnitBracket: MWhyrBracket,
	},
	{
		key: 'Operational Energy Part L',
		label: 'Operational energy: Part L',
		unit: kWhm2yr,
		totalUnit: MWhyr,
		unitBracket: kWhm2yrBracket,
		totalUnitBracket: MWhyrBracket,
	},
	{
		key: 'Operational Energy Gas',
		label: 'Operational energy (gas)',
		unit: kWhm2yr,
		totalUnit: MWhyr,
		unitBracket: kWhm2yrBracket,
		totalUnitBracket: MWhyrBracket,
	},

	{
		key: 'Space Heating Demand',
		label: 'Space heating demand',
		unit: kWhm2yr,
		totalUnit: MWhyr,
		unitBracket: kWhm2yrBracket,
		totalUnitBracket: MWhyrBracket,
	},
	{
		key: 'Total Renewable Energy Generation',
		label: 'Renewable energy generation',
		unit: kWhm2yr,
		totalUnit: MWhyr,
		unitBracket: kWhm2yrBracket,
		totalUnitBracket: MWhyrBracket,
	},

	{
		key: 'Upfront Carbon',
		label: 'Upfront carbon (A1-A5)',
		unit: kgCO2em2,
		totalUnit: tCO2e,
		unitBracket: kgCO2em2Bracket,
		totalUnitBracket: tCO2eBracket,
	},
	{
		key: 'Total Embodied Carbon',
		label: 'Embodied carbon (A-C)',
		unit: kgCO2em2,
		totalUnit: tCO2e,
		unitBracket: kgCO2em2Bracket,
		totalUnitBracket: tCO2eBracket,
	},
	{
		key: 'Biogenic Carbon',
		label: 'Biogenic carbon',
		unit: kgCO2em2,
		totalUnit: tCO2e,
		unitBracket: kgCO2em2Bracket,
		totalUnitBracket: tCO2eBracket,
	},

	{
		key: 'Biodiversity Net Gain',
		label: 'Biodiversity net gain',
		unit: '%',
		totalUnit: '%',
		unitBracket: '(%)',
		totalUnitBracket: '(%)',
	},
	{
		key: 'Habitats Units Gained',
		label: '',
		unit: '',
		totalUnit: '',
		unitBracket: '',
		totalUnitBracket: '',
	},
	{
		key: 'Urban Greening Factor',
		label: 'Urban greening factor',
		unit: '',
		totalUnit: '',
		unitBracket: '',
		totalUnitBracket: '',
	},
];

export const KPIKeysOther = [
	'Operational Energy Total',
	'Operational Energy Part L',
	'Operational Energy Gas',
	'Space Heating Demand',
	'Total Renewable Energy Generation',
	'Upfront Carbon',
	'Total Embodied Carbon',
	'Biodiversity Net Gain',
	'Urban Greening Factor',
];

export const KPIOptionsOther = KPIOptions.filter((kpi) => KPIKeysOther.includes(kpi.key));

export const KPIKeysCompareTwo = [
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

export const KPIOptionsCompareTwo = KPIOptions.filter((kpi) => KPIKeysCompareTwo.includes(kpi.key));

export const KPIMatrix: Record<string, string[]> = {
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
