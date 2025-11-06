import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Eye, EyeOff } from 'lucide-react';
import { Project } from '@/components/Key/project';
import { useState } from 'react';
import { exportChartToCSV } from '@/components/Util/UtilCSV';
import { exportChartToPNG } from '@/components/Util/UtilPNG';
import { CompareTwo } from './ChartSub/C01-CompareTwo';
import { SingleProject } from './ChartSub/C02-SingleProject';
import { SingleTime } from './ChartSub/C03-SingleTime';
import { chartColors } from './Key/KeyColor';
import { Selector } from './R31-Selector';
import { getChartTitle, hasBenchmarks, getAvailableSubSectors } from './Util/UtilChart';

interface ChartProps {
	projects: Project[];
	isComparingToSelf?: boolean;
	selectedRibaStages?: string[];
}

export const Chart = ({ projects, isComparingToSelf = false, selectedRibaStages = [] }: ChartProps) => {
	const [chartType, setChartType] = useState('Compare Two');
	const [selectedKPI1, setSelectedKPI1] = useState('Operational Energy');
	const [selectedKPI2, setSelectedKPI2] = useState('Operational Energy');
	const [valueType, setValueType] = useState('average');
	const [showSingleProjectBenchmarks, setShowSingleProjectBenchmarks] = useState(false);
	const [selectedSubSector, setSelectedSubSector] = useState('');

	const handleExportCSV = () => {
		exportChartToCSV({
			projects,
			chartType,
			selectedKPI1,
			selectedKPI2,
			valueType,
			isComparingToSelf,
			showSingleProjectBenchmarks,
			selectedSubSector,
		});
	};

	const handleExportPNG = () => {
		exportChartToPNG({
			projects,
			chartType,
			selectedKPI1,
			selectedKPI2,
			valueType,
			showSingleProjectBenchmarks,
			selectedSubSector,
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
				return <SingleProject {...commonProps} showSingleProjectBenchmarks={showSingleProjectBenchmarks} selectedSubSector={selectedSubSector} />;

			case 'Single Time':
				return <SingleTime {...commonProps} selectedSubSector={selectedSubSector} />;
		}
	};

	const availableSubSectors = getAvailableSubSectors(projects, selectedKPI1);

	const showSectorToggle =
		['Upfront Carbon', 'Operational Energy'].includes(selectedKPI1) && valueType === 'average' && ['Single Time', 'Single Project'].includes(chartType) && availableSubSectors.length > 0;

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
						{/* Show benchmark toggle only for Embodied Carbon with average values */}
						{selectedKPI1 === 'Embodied Carbon' && chartType === 'Single Project' && (
							<Button
								variant={showSingleProjectBenchmarks ? 'default' : 'outline'}
								size="sm"
								onClick={() => setShowSingleProjectBenchmarks(!showSingleProjectBenchmarks)}
								disabled={!hasBenchmarks(projects)}
								className="flex items-center gap-2"
							>
								{showSingleProjectBenchmarks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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

				{/* Sub-sector toggle for upfront carbon bar chart */}
				{showSectorToggle && (
					<div className="mb-2 flex justify-end items-center py-4">
						<p className="text-me font-medium pr-4" style={{ color: chartColors.pink }}>
							UKNZCBS Benchmarks
						</p>
						<div className="flex flex-wrap gap-2">
							<Button variant={selectedSubSector === '' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedSubSector('')} className="text-xs">
								None
							</Button>
							{availableSubSectors.map((subSector) => (
								<Button key={subSector} variant={selectedSubSector === subSector ? 'default' : 'outline'} size="sm" onClick={() => setSelectedSubSector(subSector)} className="text-xs">
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
