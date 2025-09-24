import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Eye, EyeOff } from 'lucide-react';
import { Project, availableKPIs } from '@/types/project';
import { ChartType, EmbodiedCarbonBreakdown, ValueType } from './R31-ChartOption';
import { getSectorBenchmarkColor } from '@/components/Utils/UtilSector';
import { formatNumber } from '@/lib/utils';
import { useState } from 'react';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks, uknzcbsOperationalEnergyBenchmarks } from '@/data/benchmarkData';
import { exportChartToCSV } from '@/components/ChartSub/C11-ExportCSV';
import { exportChartToPNG } from '@/components/ChartSub/C12-ExportPNG';
import { BubbleChart } from './ChartSub/C31-CompareTwo';
import { BarChart } from './ChartSub/C32-SingleProject';
import { TimelineChart } from './ChartSub/C33-SingleTime';
import { chartColors, seriesColors } from './ChartSub/C01-UtilColor';
import { generateNiceTicks } from './ChartSub/C02-UtilShape';

interface ChartProps {
	projects: Project[];
	chartType: ChartType;
	selectedKPI1: string;
	selectedKPI2: string;
	embodiedCarbonBreakdown: EmbodiedCarbonBreakdown;
	valueType: ValueType;
	isComparingToSelf?: boolean;
	selectedRibaStages?: string[];
}

export const Chart = ({ projects, chartType, selectedKPI1, selectedKPI2, embodiedCarbonBreakdown, valueType, isComparingToSelf = false, selectedRibaStages = [] }: ChartProps) => {
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
			embodiedCarbonBreakdown,
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
			embodiedCarbonBreakdown,
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

		if (chartType === 'single-bar' && selectedKPI1 === 'Total Embodied Carbon' && embodiedCarbonBreakdown !== 'none') {
			const breakdownType = embodiedCarbonBreakdown === 'lifecycle' ? 'Lifecycle Stage' : 'Building Element';
			return `Embodied Carbon by ${breakdownType} (${valueTypeLabel}) - Stacked Column Chart`;
		}

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

	const getLifecycleStageCategories = () => [
		{ key: 'biogenicCarbon', label: 'Biogenic carbon (A1-A3)', color: chartColors.tertiary },
		{ key: 'upfrontEmbodied', label: 'Upfront embodied carbon (A1-A5)', color: chartColors.primary },
		{ key: 'inUseEmbodied', label: 'In-use embodied carbon (B1-B5)', color: chartColors.secondary },
		{ key: 'endOfLife', label: 'End of life (C1-C4)', color: chartColors.warning },
		{ key: 'benefitsLoads', label: 'Benefits and loads (D1)', color: chartColors.quaternary },
		{ key: 'facilitatingWorks', label: 'Facilitating works', color: chartColors.accent2 },
	];

	const getBuildingElementCategories = () => [
		{ key: 'substructure', label: 'Substructure', color: chartColors.primary },
		{ key: 'superstructureFrame', label: 'Superstructure - Frame', color: chartColors.secondary },
		{ key: 'superstructureExternal', label: 'Superstructure - External envelope', color: chartColors.tertiary },
		{ key: 'superstructureInternal', label: 'Superstructure - Internal assemblies', color: chartColors.quaternary },
		{ key: 'finishes', label: 'Finishes', color: chartColors.warning },
		{ key: 'ffe', label: 'FF&E', color: chartColors.info },
		{ key: 'mep', label: 'MEP', color: chartColors.success },
		{ key: 'externalWorks', label: 'External works', color: chartColors.darkGreen },
		{ key: 'contingency', label: 'Contingency', color: chartColors.muted },
	];

	const getEmbodiedCarbonStackedData = () => {
		if (embodiedCarbonBreakdown === 'none' || projects.length === 0) return [];

		const categories = embodiedCarbonBreakdown === 'lifecycle' ? getLifecycleStageCategories() : getBuildingElementCategories();

		return projects.map((project) => {
			const baseId = project.id.split('-')[0];
			const displayName = isComparingToSelf && project['Current RIBA Stage'] ? `${project['Project Name']} (RIBA ${project['Current RIBA Stage']})` : project['Project Name'];

			const projectData = { name: displayName };

			// Mock breakdown data - in real app this would come from project.embodiedCarbonBreakdown
			categories.forEach((category, index) => {
				// Generate mock values based on total embodied carbon
				const baseValue = project['Total Embodied Carbon'] || 45;
				const multiplier =
					embodiedCarbonBreakdown === 'lifecycle'
						? [0.4, 0.15, 0.25, 0.1, 0.05, 0.05][index] // Lifecycle distribution
						: [0.15, 0.2, 0.15, 0.1, 0.05, 0.05, 0.15, 0.1, 0.05][index]; // Building element distribution

				const categoryValue = baseValue * (multiplier || 0.1);
				const finalValue = valueType === 'total' ? categoryValue * getProjectArea(baseId) : categoryValue;
				// Make biogenic carbon negative in the data
				const adjustedValue = category.key === 'biogenicCarbon' ? -Math.abs(finalValue) : finalValue;
				projectData[category.key] = Math.round(adjustedValue * 100) / 100;
			});

			return projectData;
		});
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
					<BarChart
						projects={projects}
						selectedKPI1={selectedKPI1}
						embodiedCarbonBreakdown={embodiedCarbonBreakdown}
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
