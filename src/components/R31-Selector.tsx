import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartType, ValueType, filteredKPIs, kpiCompatibilityMatrix } from './Utils/UtilChart';

interface SelectorProps {
	chartType: ChartType;
	setChartType: (value: ChartType) => void;
	selectedKPI1: string;
	setSelectedKPI1: (value: string) => void;
	selectedKPI2: string;
	setSelectedKPI2: (value: string) => void;
	valueType: ValueType;
	setValueType: (value: ValueType) => void;
}

export const Selector = ({ chartType, setChartType, selectedKPI1, setSelectedKPI1, selectedKPI2, setSelectedKPI2, valueType, setValueType }: SelectorProps) => {
	// Get compatible KPI2 options based on selected KPI1
	const showKPI2 = chartType === 'Compare Two';
	const compatibleKPI2Options = showKPI2 ? filteredKPIs.filter((kpi) => kpiCompatibilityMatrix[selectedKPI1]?.includes(kpi.key)) : [];

	return (
		<Card className="p-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<div>
						<Label htmlFor="chart-type" className="text-sm font-medium text-gray-700 mb-4 block pl-6">
							Chart Type
						</Label>
						<Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
							<SelectTrigger>
								<SelectValue placeholder="Select Chart Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Compare Two">Compare Two KPIs</SelectItem>
								<SelectItem value="Single Project">Single KPI Across Projects</SelectItem>
								<SelectItem value="Single Time">Single KPI Over Time</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="w-[120px]">
						<Label htmlFor="value-type" className="text-sm font-medium text-gray-700 mb-4 block pl-6">
							Value Type
						</Label>
						<Select value={valueType} onValueChange={(value) => setValueType(value as ValueType)}>
							<SelectTrigger>
								<SelectValue placeholder="Select Value Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="total">Total</SelectItem>
								<SelectItem value="average">/m² GIA</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<div>
						<Label htmlFor="kpi1" className="text-sm font-medium text-gray-700 mb-4 block pl-6">
							KPI 1
						</Label>
						<Select value={selectedKPI1} onValueChange={setSelectedKPI1}>
							<SelectTrigger>
								<SelectValue placeholder="Select First KPI" />
							</SelectTrigger>
							<SelectContent>
								{filteredKPIs
									.filter((kpi) => {
										// Remove biogenic from single-bar and single-timeline charts
										if ((chartType === 'Single Project' || chartType === 'Single Time') && kpi.key === 'Biogenic Carbon') {
											return false;
										}
										return true;
									})
									.map((kpi) => (
										<SelectItem className="rounded-full" key={kpi.key} value={kpi.key}>
											{kpi.key}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					{showKPI2 && (
						<div>
							<Label htmlFor="kpi2" className="text-sm font-medium text-gray-700 mb-4 block pl-6">
								KPI 2
							</Label>
							<Select value={selectedKPI2} onValueChange={setSelectedKPI2}>
								<SelectTrigger>
									<SelectValue placeholder="Select Second KPI" />
								</SelectTrigger>
								<SelectContent className="rounded-[20px]">
									{compatibleKPI2Options.map((kpi) => (
										<SelectItem className="rounded-full" key={kpi.key} value={kpi.key}>
											{kpi.key}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};
