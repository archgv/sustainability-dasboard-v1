import { StageKey } from './KeyStage';
import { Project } from './project';

type StageKPIKeys = keyof Project['RIBA Stage'][StageKey];

export interface KPIOption {
	key: StageKPIKeys;
	label: string;
	unit: string;
	totalUnit: string;
}

const kWhm2yr = 'kWh/m²/yr';
const MWhyr = 'MWh/yr';
const kgCO2em2 = 'kgCO₂e/m²';
const tCO2e = 'tCO₂e';

export const KPIOptions: KPIOption[] = [
	{
		key: 'Operational Energy Total',
		label: 'Operational energy: reg & unreg',
		unit: kWhm2yr,
		totalUnit: MWhyr,
	},
	{
		key: 'Operational Energy Part L',
		label: 'Operational energy: Part L',
		unit: kWhm2yr,
		totalUnit: MWhyr,
	},
	{
		key: 'Operational Energy Gas',
		label: 'Operational energy (gas)',
		unit: kWhm2yr,
		totalUnit: MWhyr,
	},

	{
		key: 'Space Heating Demand',
		label: 'Space heating demand',
		unit: kWhm2yr,
		totalUnit: MWhyr,
	},
	{
		key: 'Total Renewable Energy Generation',
		label: 'Renewable energy generation',
		unit: kWhm2yr,
		totalUnit: MWhyr,
	},

	{
		key: 'Upfront Carbon',
		label: 'Upfront carbon (A1-A5)',
		unit: kgCO2em2,
		totalUnit: tCO2e,
	},
	{
		key: 'Total Embodied Carbon',
		label: 'Embodied carbon (A-C)',
		unit: kgCO2em2,
		totalUnit: tCO2e,
	},
	{
		key: 'Biogenic Carbon',
		label: 'Biogenic carbon',
		unit: kgCO2em2,
		totalUnit: tCO2e,
	},

	{
		key: 'Biodiversity Net Gain',
		label: 'Biodiversity net gain',
		unit: '%',
		totalUnit: '%',
	},
	{
		key: 'Habitats Units Gained',
		label: '',
		unit: '',
		totalUnit: '',
	},
	{
		key: 'Urban Greening Factor',
		label: 'Urban greening factor',
		unit: '',
		totalUnit: '',
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
