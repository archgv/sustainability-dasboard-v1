export const StageKeys = ['1', '2', '3', '4', '5', '6', '7'] as const;
export type StageKey = (typeof StageKeys)[number];

export interface Project {
	id: string;
	'Project Name': string;
	'Project Location': string;
	'Primary Sector': 'Workplace' | 'Residential' | 'Education' | 'Healthcare' | 'CCC' | 'Infrastructure';
	'Sub Sector'?: string;
	'Project Type': 'New Build' | 'Retrofit';
	'Heritage Project'?: string;
	'Studio Discipline'?: string;
	'Neighbourhood'?: string;

	'Operational Energy Existing Building'?: number; //ONLY IN PORTFOLIO
	'GIA'?: number; // Gross Internal Area in m²   ///NOT OPTIONAL
	'Building Lifespan'?: number; // NOT USED
	'PC Date': string; // DROPDOWN

	'EI Team Scope'?: string; // NOT USED
	'External Consultants'?: string; // NOT USED
	'Sustianability Champion Name'?: string; // NOT USED
	'Mission Statement'?: string; // NOT USED

	// Accreditations
	'BREEAM': string;
	'LEED': string;
	'WELL': string;
	'Fitwell': string; //1-5 stars xxx not on the list
	'Passivhaus': string; // Unknown, Cetified, Not Targeted xxx doesnt work
	'EnerPHit': string; // Unknown, Cetified, Not Targeted xxx doesnt work
	'UKNZCBS': string; // Unknown, Cetified + year
	'NABERS': string; //1-6 stars
	'Other Cerification'?: string; //? // TEXT

	'Current RIBA Stage': StageKey;

	'RIBA Stage': {
		[K in StageKey]: {
			'Updated GIA'?: number; // mess
			'Method Energy Measurement'?: string; // waiting to be used

			'Operational Energy Total': number;
			'Operational Energy Part L': number;
			'Operational Energy Gas': number;

			'Space Heating Demand': number;

			'Total Renewable Energy Generation': number;
			'Renewable Energy Type'?: string; // tooltip in chart for total renewable energy generation

			'Upfront Carbon': number;
			'Total Embodied Carbon': number;
			'Structural Frame Materials'?: string; // tool tip for upfront carbon and total embodied carbon

			'Biogenic Carbon'?: number;
			'Embodied Carbon Scope Clarifications'?: string;

			'Biodiversity Net Gain': number;
			'Habitats Units Gained': number; // tool tip for biodiversity net gain

			'Urban Greening Factor': number;
			'General Biodiversity Clarification Notes'?: string;
		};
	};

	'Updated GIA'?: number; //? // ADD DATA, SECTOR, COMPARE, PORTFOLIO
	'Method Energy Measurement'?: string; //? // NOT USED

	'Operational Energy Total': number;
	'Operational Energy Part L': number;
	'Operational Energy Gas': number;

	'Space Heating Demand': number;
	'Renewable Energy Type'?: string; //? NOT OPTIONAL WITH DROPDOWN, ADD DATA, COMPARE (TOOLTIP)
	'Total Renewable Energy Generation': number;
	'Structural Frame Materials'?: string; //? NOT OPTIONAL WITH DROPDOWN, ADD DATA, COMPARE (TOOLTIP)

	'Upfront Carbon': number;
	'Total Embodied Carbon': number;
	'Biogenic Carbon'?: number;
	'Embodied Carbon Scope Clarifications'?: string; //? NOT USED

	'Biodiversity Net Gain': number;
	'Habitats Units Gained': number;
	'Urban Greening Factor': number;
	'General Biodiversity Clarification Notes'?: string; //? NOT USED
}

export interface KPIOption {
	key: keyof Project;
	label: string;
	unit: string;
	numericOnly?: boolean;
}

export const availableKPIs: KPIOption[] = [
	{
		key: 'Operational Energy Total',
		label: 'Operational energy: Total',
		unit: 'kWh/m²/year',
		numericOnly: true,
	},
	{
		key: 'Operational Energy Part L',
		label: 'Operational energy Part L',
		unit: 'kWh/m²/year',
		numericOnly: true,
	},
	{
		key: 'Operational Energy Gas',
		label: 'Operational energy: Gas',
		unit: 'kWh/m²/year',
		numericOnly: true,
	},

	{
		key: 'Space Heating Demand',
		label: 'Space heating demand',
		unit: 'kWh/m²/year',
		numericOnly: true,
	},
	{
		key: 'Total Renewable Energy Generation',
		label: 'Renewable energy generation',
		unit: 'kWh/m²/year',
		numericOnly: true,
	},

	{
		key: 'Upfront Carbon',
		label: 'Upfront Carbon',
		unit: 'kgCO2e/m²',
		numericOnly: true,
	},
	{
		key: 'Total Embodied Carbon',
		label: 'Total Embodied Carbon',
		unit: 'kgCO2e/m²',
		numericOnly: true,
	},
	{
		key: 'Biogenic Carbon',
		label: 'Biogenic carbon',
		unit: 'kgCO2e/m²',
		numericOnly: true,
	},

	{
		key: 'Biodiversity Net Gain',
		label: 'Biodiversity net gain',
		unit: '%',
		numericOnly: true,
	},
	{
		key: 'Habitats Units Gained',
		label: 'Habitat Units Gained',
		unit: 'units',
		numericOnly: true,
	},
	{
		key: 'Urban Greening Factor',
		label: 'Urban greening factor',
		unit: '%',
		numericOnly: true,
	},
];
