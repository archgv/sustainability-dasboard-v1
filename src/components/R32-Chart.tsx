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
import { Selector } from './R31-Selector';
import { getChartTitle, hasBenchmarks, getAvailableSubSectors, getChartToggles } from './UtilChart/UtilChart';

interface ChartProps {
	projects: Project[];
	isComparingToSelf?: boolean;
	selectedRibaStages?: string[];
}

export const Chart = ({ projects, isComparingToSelf = false, selectedRibaStages = [] }: ChartProps) => {
	const [chartType, setChartType] = useState('Compare Two');
	const [selectedKPI1, setSelectedKPI1] = useState('Total Embodied Carbon');
	const [selectedKPI2, setSelectedKPI2] = useState('Operational Energy Total');
	const [valueType, setValueType] = useState('average');
	const [showBenchmarks, setShowBenchmarks] = useState(false);
	const [selectedSubSector, setSelectedSubSector] = useState('');
	const [selectedBarChartBenchmark, setSelectedBarChartBenchmark] = useState('');

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

	const commonProps = {
		projects,
		selectedKPI1,
		valueType,
		isComparingToSelf,
	};

	const renderChart = () => {
		switch (chartType) {
			case 'Compare Two':
				return <CompareTwo {...commonProps} selectedKPI2={selectedKPI2} />;

			case 'Single Project':
				return <SingleProject {...commonProps} showBenchmarks={showBenchmarks} selectedBarChartBenchmark={selectedBarChartBenchmark} />;

			case 'Single Time':
				return <SingleTime {...commonProps} selectedSubSector={selectedSubSector} />;

			default:
				return <div>Select a chart type to view data</div>;
		}
	};

	const availableSubSectors = getAvailableSubSectors(projects, selectedKPI1);
	const { showSingleTimeSectorToggle, showSingleSectorToggle } = getChartToggles(selectedKPI1, valueType, chartType, availableSubSectors);

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
					<h2 className="py-2">{getChartTitle(chartType, valueType, selectedKPI1, selectedKPI2)}</h2>
					<div className="flex items-center space-x-2">
						{/* Show benchmark toggle only for Total Embodied Carbon with average values */}
						{selectedKPI1 === 'Total Embodied Carbon' && valueType === 'average' && chartType === 'Single Project' && (
							<Button
								variant={showBenchmarks ? 'default' : 'outline'}
								size="sm"
								onClick={() => setShowBenchmarks(!showBenchmarks)}
								disabled={!hasBenchmarks(projects)}
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
