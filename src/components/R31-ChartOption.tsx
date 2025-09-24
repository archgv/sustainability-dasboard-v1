import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { availableKPIs } from '@/types/project';
export type ChartType = 'compare-bubble' | 'single-bar' | 'single-timeline';
export type ValueType = 'total' | 'per-sqm';
interface ChartOptionProps {
	chartType: ChartType;
	selectedKPI1: string;
	selectedKPI2: string;
	valueType: ValueType;
	onChartTypeChange: (value: ChartType) => void;
	onKPI1Change: (value: string) => void;
	onKPI2Change: (value: string) => void;
	onValueTypeChange: (value: ValueType) => void;
}

// Define the 10 specific KPIs for charts
const chartKPIs = [
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

// Filter availableKPIs to only include the chart KPIs
const filteredKPIs = availableKPIs.filter((kpi) => chartKPIs.includes(kpi.key));

// KPI compatibility matrix based on the provided matrix
const kpiCompatibilityMatrix: Record<string, string[]> = {
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
export const ChartOption = ({ chartType, selectedKPI1, selectedKPI2, valueType, onChartTypeChange, onKPI1Change, onKPI2Change, onValueTypeChange }: ChartOptionProps) => {
	const showKPI2 = chartType === 'compare-bubble';

	// Get compatible KPI2 options based on selected KPI1
	const compatibleKPI2Options = showKPI2 ? filteredKPIs.filter((kpi) => kpiCompatibilityMatrix[selectedKPI1]?.includes(kpi.key)) : [];
	return (
		<Card className="p-4 mb-6">
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div>
					<Label htmlFor="chart-type" className="text-sm font-medium text-gray-700 mb-2 block">
						Chart Type
					</Label>
					<Select value={chartType} onValueChange={onChartTypeChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select chart type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="compare-bubble">Compare two KPIs (bubble)</SelectItem>
							<SelectItem value="single-bar">Single KPI across projects (bar chart)</SelectItem>
							<SelectItem value="single-timeline">Single KPI over time (timeline)</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="value-type" className="text-sm font-medium text-gray-700 mb-2 block">
						Value Type
					</Label>
					<Select value={valueType} onValueChange={onValueTypeChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select value type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="total">Total Values</SelectItem>
							<SelectItem value="per-sqm">Per sqm GIA</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="kpi1" className="text-sm font-medium text-gray-700 mb-2 block">
						KPI 1
					</Label>
					<Select value={selectedKPI1} onValueChange={onKPI1Change}>
						<SelectTrigger>
							<SelectValue placeholder="Select first KPI" />
						</SelectTrigger>
						<SelectContent>
							{filteredKPIs
								.filter((kpi) => {
									// Remove biogenic from single-bar and single-timeline charts
									if ((chartType === 'single-bar' || chartType === 'single-timeline') && kpi.key === 'Biogenic Carbon') {
										return false;
									}
									return true;
								})
								.map((kpi) => (
									<SelectItem key={kpi.key} value={kpi.key}>
										{kpi.label} ({kpi.unit})
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>

				{showKPI2 && (
					<div>
						<Label htmlFor="kpi2" className="text-sm font-medium text-gray-700 mb-2 block">
							KPI 2
						</Label>
						<Select value={selectedKPI2} onValueChange={onKPI2Change}>
							<SelectTrigger>
								<SelectValue placeholder="Select second KPI" />
							</SelectTrigger>
							<SelectContent>
								{compatibleKPI2Options.map((kpi) => (
									<SelectItem key={kpi.key} value={kpi.key}>
										{kpi.label} ({kpi.unit})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
			</div>
		</Card>
	);
};
