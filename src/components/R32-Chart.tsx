import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Eye, EyeOff } from 'lucide-react';
import { Project } from '@/components/Key/project';
import { KPIOptions } from '@/components/Key/KeyKPI';
import { useState } from 'react';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks, uknzcbsOperationalEnergyBenchmarks } from '@/data/benchmarkData';
import { exportChartToCSV } from '@/components/UtilChart/UtilCSV';
import { exportChartToPNG } from '@/components/UtilChart/UtilPNG';
import { CompareTwo } from './ChartSub/C01-CompareTwo';
import { SingleProject } from './ChartSub/C02-SingleProject';
import { SingleTime } from './ChartSub/C03-SingleTime';
import { chartColors } from './Key/KeyColor';
import { generateNiceTicks } from './UtilChart/UtilTick';
import { chartKPIs, ChartType, filteredKPIs, getProjectArea, kpiCompatibilityMatrix, ValueType } from './Key/KeyChart';
import { Selector } from './R31-Selector';
import { transformDataForValueType } from './UtilChart/UtilValueType';

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
				return `${kpi1Config.key} vs ${kpi2Config.key} (${valueTypeLabel})`;
			case 'Single Project':
				return `${kpi1Config.key} by Project (${valueTypeLabel})`;
			case 'Single Time':
				return `${kpi1Config.key} Over Time (${valueTypeLabel})`;
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
						transformDataForValueType={(data) => transformDataForValueType(data, valueType, selectedKPI1, selectedKPI2)}
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
						transformDataForValueType={(data) => transformDataForValueType(data, valueType, selectedKPI1, selectedKPI2)}
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
						transformDataForValueType={(data) => transformDataForValueType(data, valueType, selectedKPI1, selectedKPI2)}
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

	return (
		<div className="space-y-6">
			{/* Chart Configuration */}
			<Selector
				chartType={chartType}
				setChartType={setChartType}
				selectedKPI1={selectedKPI1}
				setSelectedKPI1={setSelectedKPI1}
				selectedKPI2={selectedKPI2}
				setSelectedKPI2={setSelectedKPI2}
				valueType={valueType}
				setValueType={setValueType}
			/>

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
