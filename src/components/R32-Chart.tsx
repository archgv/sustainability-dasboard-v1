import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Eye, EyeOff } from 'lucide-react';
import { Project, KPIOptions } from '@/components/Utils/project';
import { useState } from 'react';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks, uknzcbsOperationalEnergyBenchmarks } from '@/data/benchmarkData';
import { exportChartToCSV } from '@/components/ChartSub/C11-ExportCSV';
import { exportChartToPNG } from '@/components/ChartSub/C12-ExportPNG';
import { CompareTwo } from './ChartSub/C31-CompareTwo';
import { SingleProject } from './ChartSub/C32-SingleProject';
import { SingleTime } from './ChartSub/C33-SingleTime';
import { chartColors } from './Utils/UtilColor';
import { generateNiceTicks } from './Utils/UtilShape';
import { chartKPIs, filteredKPIs, kpiCompatibilityMatrix } from './Utils/UtilChart';

export type ChartType = 'Compare Two' | 'Single Project' | 'Single Time';
export type ValueType = 'total' | 'average';

interface ChartProps {
	projects: Project[];
	isComparingToSelf?: boolean;
	selectedRibaStages?: string[];
}

export const Chart = ({ projects, isComparingToSelf = false, selectedRibaStages = [] }: ChartProps) => {
	const [chartType, setChartType] = useState<ChartType>('Compare Two');
	const [selectedKPI1, setSelectedKPI1] = useState('Total Embodied Carbon');
	const [selectedKPI2, setSelectedKPI2] = useState('Operational Energy Total');
	const [valueType, setValueType] = useState<ValueType>('average');
	const [showBenchmarks, setShowBenchmarks] = useState(false);
	const [selectedSubSector, setSelectedSubSector] = useState<string>('');
	const [selectedBarChartBenchmark, setSelectedBarChartBenchmark] = useState<string>('');

	const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);
	const kpi2Config = KPIOptions.find((kpi) => kpi.key === selectedKPI2);

	// Mock building area data for demonstration
	const getProjectArea = (projectId: string): number => {
		const areas: Record<string, number> = {
			'1': 15000, // Green Office Tower
			'2': 8500, // Sustainable Housing Complex
			'3': 22000, // Innovation Campus
			'4': 12000, // Community Health Center
			'5': 18000, // Urban Retail Hub
		};
		return areas[projectId] || 10000;
	};

	const transformDataForValueType = (data: Project[]): Project[] => {
		if (valueType === 'average') {
			return data;
		}

		// For total values, multiply by building area
		return data.map((item) => ({
			...item,
			[selectedKPI1]: item[selectedKPI1] * getProjectArea(item.id.split('-')[0]), // Handle RIBA stage variants
			[selectedKPI2]: selectedKPI2 ? item[selectedKPI2] * getProjectArea(item.id.split('-')[0]) : undefined,
		}));
	};

	const handleExportCSV = () => {
		exportChartToCSV({
			projects,
			chartType,
			selectedKPI1,
			selectedKPI2,
			valueType,
			isComparingToSelf,
			selectedRibaStages,
			showBenchmarks,
			selectedBarChartBenchmark,
		});
	};

	const handleExportPNG = () => {
		exportChartToPNG({
			projects,
			chartType,
			selectedKPI1,
			selectedKPI2,
			valueType,
			showBenchmarks,
			selectedBarChartBenchmark,
		});
	};

	const getChartTitle = () => {
		const valueTypeLabel = valueType === 'average' ? '/m²' : 'total';

		switch (chartType) {
			case 'Compare Two':
				return `${kpi1Config.key} vs ${kpi2Config.key} (${valueTypeLabel}) - Bubble Chart`;
			case 'Single Project':
				return `${kpi1Config.key} by Project (${valueTypeLabel}) - Bar Chart`;
			case 'Single Time':
				return `${kpi1Config.key} Over Time (${valueTypeLabel}) - Timeline`;
			default:
				return 'Chart';
		}
	};

	const renderChart = () => {
		switch (chartType) {
			case 'Compare Two':
				return (
					<CompareTwo
						projects={projects}
						selectedKPI1={selectedKPI1}
						selectedKPI2={selectedKPI2}
						valueType={valueType}
						isComparingToSelf={isComparingToSelf}
						chartColors={chartColors}
						generateNiceTicks={generateNiceTicks}
						getProjectArea={getProjectArea}
						transformDataForValueType={transformDataForValueType}
					/>
				);

			case 'Single Project':
				return (
					<SingleProject
						projects={projects}
						selectedKPI1={selectedKPI1}
						valueType={valueType}
						isComparingToSelf={isComparingToSelf}
						showBenchmarks={showBenchmarks}
						selectedBarChartBenchmark={selectedBarChartBenchmark}
						chartColors={chartColors}
						generateNiceTicks={generateNiceTicks}
						getProjectArea={getProjectArea}
						transformDataForValueType={transformDataForValueType}
					/>
				);

			case 'Single Time':
				return (
					<SingleTime
						projects={projects}
						selectedKPI1={selectedKPI1}
						valueType={valueType}
						isComparingToSelf={isComparingToSelf}
						selectedSubSector={selectedSubSector}
						chartColors={chartColors}
						generateNiceTicks={generateNiceTicks}
						transformDataForValueType={transformDataForValueType}
					/>
				);

			default:
				return <div>Select a chart type to view data</div>;
		}
	};

	// Check if there are benchmarks available for the current sector
	const hasBenchmarks = () => {
		if (projects.length === 0) return false;
		return !!totalEmbodiedCarbonBenchmarks[projects[0]['Primary Sector'] as keyof typeof totalEmbodiedCarbonBenchmarks];
	};

	// Get sub-sectors for the primary project's sector
	const getAvailableSubSectors = (): string[] => {
		if (projects.length === 0) return [];

		// Check both upfront carbon and operational energy benchmarks
		if (selectedKPI1 === 'Upfront Carbon') {
			const sectorData = uknzcbsBenchmarks[projects[0]['Primary Sector'] as keyof typeof uknzcbsBenchmarks];
			return sectorData ? Object.keys(sectorData) : [];
		} else if (selectedKPI1 === 'Operational Energy Total') {
			const sectorData = uknzcbsOperationalEnergyBenchmarks[projects[0]['Primary Sector'] as keyof typeof uknzcbsOperationalEnergyBenchmarks];
			return sectorData ? Object.keys(sectorData) : [];
		}

		return [];
	};

	const availableSubSectors = getAvailableSubSectors();
	const showSingleTimeSectorToggle =
		(selectedKPI1 === 'Upfront Carbon' || selectedKPI1 === 'Operational Energy Total') && valueType === 'average' && chartType === 'Single Time' && availableSubSectors.length > 1;
	const showSingleSectorToggle = selectedKPI1 === 'Upfront Carbon' && valueType === 'average' && chartType === 'Single Project' && availableSubSectors.length > 0;

	// Get compatible KPI2 options based on selected KPI1
	const showKPI2 = chartType === 'Compare Two';
	const compatibleKPI2Options = showKPI2 ? filteredKPIs.filter((kpi) => kpiCompatibilityMatrix[selectedKPI1]?.includes(kpi.key)) : [];

	return (
		<div className="space-y-6">
			{/* Chart Configuration */}
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

			<Card className="p-6">
				<div className="flex justify-between items-center text-center mb-2">
					<h2 className="py-2">{getChartTitle()}</h2>
					<div className="flex items-center space-x-2">
						{/* Show benchmark toggle only for Total Embodied Carbon with average values */}
						{selectedKPI1 === 'Total Embodied Carbon' && valueType === 'average' && chartType === 'Single Project' && (
							<Button
								variant={showBenchmarks ? 'default' : 'outline'}
								size="sm"
								onClick={() => setShowBenchmarks(!showBenchmarks)}
								disabled={!hasBenchmarks()}
								className="flex items-center gap-2"
							>
								{showBenchmarks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
								Benchmarks
							</Button>
						)}
						<Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center gap-2">
							<FileText className="w-4 h-4" />
							CSV
						</Button>
						<Button variant="outline" size="sm" onClick={handleExportPNG} className="flex items-center gap-2">
							<Download className="w-4 h-4" />
							PNG
						</Button>
					</div>
				</div>

				{/* Sub-sector toggle for upfront carbon timeline */}
				{showSingleTimeSectorToggle && (
					<div className="mb-2 flex justify-between items-center py-4">
						<p className="text-sm font-medium mb-2 px-10" style={{ color: chartColors.pink }}>
							UKNZCBS Benchmarks
						</p>
						<div className="flex flex-wrap gap-2">
							{availableSubSectors.map((subSector) => (
								<Button key={subSector} variant={selectedSubSector === subSector ? 'default' : 'outline'} size="sm" onClick={() => setSelectedSubSector(subSector)} className="text-xs">
									{subSector}
								</Button>
							))}
						</div>
					</div>
				)}

				{/* Sub-sector toggle for upfront carbon bar chart */}
				{showSingleSectorToggle && (
					<div className="mb-2 flex justify-between items-center py-4">
						<p className="text-me font-medium mb-2 px-10" style={{ color: chartColors.pink }}>
							UKNZCBS Benchmarks
						</p>
						<div className="flex flex-wrap gap-2">
							<Button variant={selectedBarChartBenchmark === '' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedBarChartBenchmark('')} className="text-xs">
								None
							</Button>
							{availableSubSectors.map((subSector) => (
								<Button
									key={subSector}
									variant={selectedBarChartBenchmark === subSector ? 'default' : 'outline'}
									size="sm"
									onClick={() => setSelectedBarChartBenchmark(subSector)}
									className="text-xs"
								>
									{subSector}
								</Button>
							))}
						</div>
					</div>
				)}

				<div className="h-[480px]" data-chart="chart-container">
					{renderChart()}
				</div>
			</Card>
		</div>
	);
};
