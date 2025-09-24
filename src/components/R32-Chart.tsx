import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Eye, EyeOff } from 'lucide-react';
import { Project, availableKPIs } from '@/types/project';
import { ChartType, ValueType } from './R31-ChartOption';
import { getSectorBenchmarkColor } from '@/components/Utils/UtilSector';
import { formatNumber } from '@/lib/utils';
import { useState } from 'react';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks, uknzcbsOperationalEnergyBenchmarks } from '@/data/benchmarkData';
import { exportChartToCSV } from '@/components/ChartSub/C11-ExportCSV';
import { exportChartToPNG } from '@/components/ChartSub/C12-ExportPNG';
import { BubbleChart } from './ChartSub/C31-CompareTwo';
import { SingleProject } from './ChartSub/C32-SingleProject';
import { TimelineChart } from './ChartSub/C33-SingleTime';
import { chartColors, seriesColors } from './ChartSub/C01-UtilColor';
import { generateNiceTicks } from './ChartSub/C02-UtilShape';

interface ChartProps {
	projects: Project[];
	chartType: ChartType;
	selectedKPI1: string;
	selectedKPI2: string;
	valueType: ValueType;
	isComparingToSelf?: boolean;
	selectedRibaStages?: string[];
}

export const Chart = ({ projects, chartType, selectedKPI1, selectedKPI2, valueType, isComparingToSelf = false, selectedRibaStages = [] }: ChartProps) => {
	const [showBenchmarks, setShowBenchmarks] = useState(false);
	const [selectedSubSector, setSelectedSubSector] = useState<string>('');
	const [selectedBarChartBenchmark, setSelectedBarChartBenchmark] = useState<string>('');

	const kpi1Config = availableKPIs.find((kpi) => kpi.key === selectedKPI1);
	const kpi2Config = availableKPIs.find((kpi) => kpi.key === selectedKPI2);

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
		if (valueType === 'per-sqm') {
			return data; // Data is already per sqm in our KPIs
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

	const getUnitLabel = (baseUnit: string, valueType: ValueType, forCSV: boolean = false): string => {
		// For CSV exports, use plain text to avoid encoding issues
		const unit = forCSV ? baseUnit.replace(/CO2/g, 'CO2').replace(/₂/g, '2') : baseUnit.replace(/CO2/g, 'CO₂');

		if (valueType === 'total') {
			return unit.replace('/m²', '').replace('/year', '/year total');
		}
		return unit;
	};

	const getChartTitle = () => {
		const valueTypeLabel = valueType === 'per-sqm' ? 'per sqm' : 'total';

		switch (chartType) {
			case 'compare-bubble':
				return `${kpi1Config?.label} vs ${kpi2Config?.label} (${valueTypeLabel}) - Bubble Chart`;
			case 'single-bar':
				return `${kpi1Config?.label} by Project (${valueTypeLabel}) - Bar Chart`;
			case 'single-timeline':
				return `${kpi1Config?.label} Over Time (${valueTypeLabel}) - Timeline`;
			default:
				return 'Chart';
		}
	};

	const renderChart = () => {
		switch (chartType) {
			case 'compare-bubble':
				return (
					<BubbleChart
						projects={projects}
						selectedKPI1={selectedKPI1}
						selectedKPI2={selectedKPI2}
						valueType={valueType}
						isComparingToSelf={isComparingToSelf}
						chartColors={chartColors}
						generateNiceTicks={generateNiceTicks}
						getUnitLabel={getUnitLabel}
						getProjectArea={getProjectArea}
						transformDataForValueType={transformDataForValueType}
					/>
				);

			case 'single-bar':
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
						getUnitLabel={getUnitLabel}
						getProjectArea={getProjectArea}
						transformDataForValueType={transformDataForValueType}
					/>
				);

			case 'single-timeline':
				return (
					<TimelineChart
						projects={projects}
						selectedKPI1={selectedKPI1}
						valueType={valueType}
						isComparingToSelf={isComparingToSelf}
						selectedSubSector={selectedSubSector}
						chartColors={chartColors}
						generateNiceTicks={generateNiceTicks}
						getUnitLabel={getUnitLabel}
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
	const showSubSectorToggle =
		(selectedKPI1 === 'Upfront Carbon' || selectedKPI1 === 'Operational Energy Total') && valueType === 'per-sqm' && chartType === 'single-timeline' && availableSubSectors.length > 1;
	const showBarChartSubSectorToggle = selectedKPI1 === 'Upfront Carbon' && valueType === 'per-sqm' && chartType === 'single-bar' && availableSubSectors.length > 0;

	return (
		<Card className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold" style={{ color: chartColors.dark }}>
					{getChartTitle()}
				</h2>
				<div className="flex items-center space-x-2">
					{/* Show benchmark toggle only for Total Embodied Carbon with per-sqm values */}
					{selectedKPI1 === 'Total Embodied Carbon' && valueType === 'per-sqm' && chartType === 'single-bar' && (
						<Button
							variant={showBenchmarks ? 'default' : 'outline'}
							size="sm"
							onClick={() => setShowBenchmarks(!showBenchmarks)}
							disabled={!hasBenchmarks()}
							className="flex items-center gap-2"
						>
							{showBenchmarks ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
							Show Benchmarks
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
			{showSubSectorToggle && (
				<div className="mb-4">
					<p className="text-sm font-medium mb-2" style={{ color: chartColors.dark }}>
						UKNZCBS benchmarks
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
			{showBarChartSubSectorToggle && (
				<div className="mb-4">
					<p className="text-sm font-medium mb-2" style={{ color: chartColors.dark }}>
						UKNZCBS benchmarks
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
	);
};
