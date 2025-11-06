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
		key: 'Operational Energy',
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
		key: 'Renewable Energy Generation',
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
		key: 'Embodied Carbon',
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

export const KPIKeysFiltered = [
	'Operational Energy',
	'Operational Energy Part L',
	'Operational Energy Gas',
	'Space Heating Demand',
	'Renewable Energy Generation',
	'Upfront Carbon',
	'Embodied Carbon',
	'Biodiversity Net Gain',
	'Urban Greening Factor',
];

export const KPIOptionsFiltered = KPIOptions.filter((kpi) => KPIKeysFiltered.includes(kpi.key));

export const KPIMatrix: Record<string, string[]> = {
	'Operational Energy': ['Operational Energy Part L', 'Operational Energy Gas', 'Space Heating Demand', 'Renewable Energy Generation', 'Upfront Carbon', 'Embodied Carbon', 'Biogenic Carbon'],
	'Operational Energy Part L': ['Operational Energy', 'Operational Energy Gas', 'Space Heating Demand', 'Renewable Energy Generation', 'Upfront Carbon', 'Embodied Carbon', 'Biogenic Carbon'],
	'Operational Energy Gas': ['Operational Energy', 'Operational Energy Part L', 'Space Heating Demand', 'Renewable Energy Generation', 'Upfront Carbon', 'Embodied Carbon', 'Biogenic Carbon'],
	'Space Heating Demand': ['Operational Energy', 'Operational Energy Part L', 'Operational Energy Gas', 'Renewable Energy Generation', 'Upfront Carbon', 'Embodied Carbon', 'Biogenic Carbon'],
	'Renewable Energy Generation': ['Operational Energy', 'Operational Energy Part L', 'Operational Energy Gas', 'Space Heating Demand', 'Upfront Carbon', 'Embodied Carbon', 'Biogenic Carbon'],
	'Upfront Carbon': ['Operational Energy', 'Operational Energy Part L', 'Operational Energy Gas', 'Space Heating Demand', 'Renewable Energy Generation', 'Embodied Carbon', 'Biogenic Carbon'],
	'Embodied Carbon': ['Operational Energy', 'Operational Energy Part L', 'Operational Energy Gas', 'Space Heating Demand', 'Renewable Energy Generation', 'Upfront Carbon', 'Biogenic Carbon'],
	'Biogenic Carbon': ['Operational Energy', 'Operational Energy Part L', 'Operational Energy Gas', 'Space Heating Demand', 'Renewable Energy Generation', 'Upfront Carbon', 'Embodied Carbon'],
	'Biodiversity Net Gain': ['Urban Greening Factor'],
	'Urban Greening Factor': ['Biodiversity Net Gain'],
};
