import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Project, KPIOptions } from '@/components/Utils/project';
import { ValueType } from '../R32-Chart';
import { getSectorColor, getSectorBenchmarkColor } from '@/components/Utils/UtilSector';
import { formatNumber } from '@/lib/utils';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks } from '@/data/benchmarkData';
import { chartColors } from '../Utils/UtilColor';
import {
	getResponsiveContainerProps,
	getChartProps,
	getCartesianGridProps,
	getYAxisProps,
	getXAxisProps,
	getBarProps,
	getTooltipContainerStyle,
	getUnitLabel,
	MultiLineTickComponent,
} from './C00-ChartConfig';

interface BarChartProps {
	projects: Project[];
	selectedKPI1: string;
	valueType: ValueType;
	isComparingToSelf?: boolean;
	showBenchmarks: boolean;
	selectedBarChartBenchmark: string;
	chartColors: typeof chartColors;
	generateNiceTicks: (maxValue: number, tickCount?: number) => number[];
	getProjectArea: (projectId: string) => number;
	transformDataForValueType: (data: Project[]) => Project[];
}

export const SingleProject = ({
	projects,
	selectedKPI1,
	valueType,
	isComparingToSelf = false,
	showBenchmarks,
	selectedBarChartBenchmark,
	chartColors,
	generateNiceTicks,
	getProjectArea,
	transformDataForValueType,
}: BarChartProps) => {
	const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);

	const transformedProjects = transformDataForValueType(projects);
	const sortedProjects = transformedProjects;

	// Add biogenic data as negative values for totalEmbodiedCarbon - use sorted projects
	const chartData = sortedProjects.map((project) => ({
		...project,
		'Biogenic Carbon': selectedKPI1 === 'Total Embodied Carbon' ? -Math.abs(project['Biogenic Carbon'] || 0) * (valueType === 'total' ? getProjectArea(project.id.split('-')[0]) : 1) : 0,
	}));

	// Get UKNZCBS benchmark data for the bar chart - always based on PRIMARY project only
	const getBarChartBenchmarkLines = () => {
		if (!selectedBarChartBenchmark || selectedKPI1 !== 'Upfront Carbon' || valueType !== 'average' || projects.length === 0) {
			return [];
		}

		// ALWAYS use the first project in the original array as the primary project
		const benchmarkColor = getSectorBenchmarkColor(projects[0]['Primary Sector']);

		// Get the PC date from the primary project to determine benchmark year
		let benchmarkYear = parseInt(projects[0]['PC Date']) || 2025;
		if (benchmarkYear < 2025) benchmarkYear = 2025; // Use 2025 for years before 2025

		// Get benchmark values for this sector and sub-sector
		const sectorData = uknzcbsBenchmarks[projects[0]['Primary Sector'] as keyof typeof uknzcbsBenchmarks];
		if (!sectorData) return [];

		const subSectorData = sectorData[selectedBarChartBenchmark as keyof typeof sectorData];
		if (!subSectorData) return [];

		const newBuildValue = subSectorData['New Build']?.[benchmarkYear as keyof (typeof subSectorData)['New Build']];
		const retrofitValue = subSectorData['Retrofit']?.[benchmarkYear as keyof (typeof subSectorData)['Retrofit']];

		const benchmarkLines = [];
		if (newBuildValue !== undefined) {
			benchmarkLines.push({
				name: `New Build (PC ${benchmarkYear})`,
				value: newBuildValue,
				color: benchmarkColor,
				year: benchmarkYear,
			});
		}
		if (retrofitValue !== undefined) {
			benchmarkLines.push({
				name: `Retrofit (PC ${benchmarkYear})`,
				value: retrofitValue,
				color: benchmarkColor,
				year: benchmarkYear,
			});
		}

		return benchmarkLines;
	};

	// Get benchmark data for the primary project's sector (only for Total Embodied Carbon with average)
	const getBenchmarkLines = () => {
		if (!showBenchmarks || selectedKPI1 !== 'Total Embodied Carbon' || valueType !== 'average' || projects.length === 0) {
			return [];
		}

		// ALWAYS use the first project in the original array as the primary project
		const benchmarkColor = getSectorBenchmarkColor(projects[0]['Primary Sector']);

		// Get benchmark values for this sector
		const sectorBenchmarks = totalEmbodiedCarbonBenchmarks[projects[0]['Primary Sector'] as keyof typeof totalEmbodiedCarbonBenchmarks];

		if (!sectorBenchmarks) return [];

		return Object.entries(sectorBenchmarks).map(([name, value]) => ({
			name,
			value,
			color: benchmarkColor,
		}));
	};

	const benchmarkLines = getBenchmarkLines();
	const barChartBenchmarkLines = getBarChartBenchmarkLines();

	return (
		<div className="w-full h-full flex justify-center">
			{/* Benchmark Legend - positioned after title, before chart */}
			{barChartBenchmarkLines.length > 0 && (
				<div className="flex justify-center items-center gap-6 mb-4">
					{barChartBenchmarkLines.map((item, index) => (
						<div key={index} className="flex items-center gap-2">
							<svg width="24" height="2" className="inline-block">
								<line x1="0" y1="1" x2="24" y2="1" stroke={item.color} strokeWidth="2" strokeDasharray={item.name.includes('New Build') ? '5 5' : '10 5'} />
							</svg>
							<span className="text-sm" style={{ color: chartColors.dark }}>
								{item.name}
							</span>
						</div>
					))}
				</div>
			)}
			<ResponsiveContainer {...getResponsiveContainerProps(true)}>
				<BarChart data={chartData} {...getChartProps()}>
					<CartesianGrid vertical={false} {...getCartesianGridProps()} />
					<XAxis
						{...getXAxisProps('Single Project', selectedKPI1, kpi1Config, valueType)}
						dataKey={(item) => {
							const displayName = isComparingToSelf && item['Current RIBA Stage'] ? `${item['Project Name']} (RIBA ${item['Current RIBA Stage']})` : item['Project Name'];
							return displayName;
						}}
						tick={(props) => {
							const lines = MultiLineTickComponent(props);
							return (
								<g transform={`translate(${props.x + 25},${props.y + 20})`}>
									{lines.map((line, index) => (
										<text key={index} x={0} y={index * 12} textAnchor="end" fill={chartColors.dark} fontSize="10">
											{line}
										</text>
									))}
								</g>
							);
						}}
					/>
					<YAxis
						{...getYAxisProps('Single Project', selectedKPI1, kpi1Config, valueType)}
						tickFormatter={(value) => formatNumber(value)}
						domain={selectedKPI1 === 'Total Embodied Carbon' ? [0, 1600] : [0, 'dataMax']}
						ticks={
							selectedKPI1 === 'Total Embodied Carbon'
								? [0, 400, 800, 1200, 1600]
								: (() => {
										const maxValue = Math.max(...chartData.map((p) => Math.abs(p[selectedKPI1] || 0)));
										return generateNiceTicks(maxValue * 1.1);
								  })()
						}
					/>
					<Tooltip
						formatter={(value: number, name: string) => [
							`${formatNumber(value)} ${getUnitLabel(kpi1Config, valueType)}`,
							name === 'Biogenic Carbon' ? 'Biogenic Carbon' : kpi1Config.key || selectedKPI1,
						]}
						labelFormatter={(label) => `Project: ${label}`}
						contentStyle={getTooltipContainerStyle()}
						content={({ active, payload, label }) => {
							if (active && payload && payload.length) {
								const mainData = payload.find((p) => p.dataKey === selectedKPI1);
								const biogenicData = payload.find((p) => p.dataKey === 'Biogenic Carbon');

								return (
									<div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
										<p className="font-semibold" style={{ color: chartColors.dark }}>
											Project: {label}
										</p>
										{mainData && (
											<p className="text-sm" style={{ color: chartColors.dark }}>
												{kpi1Config.key}: {formatNumber(mainData.value)} {getUnitLabel(kpi1Config, valueType)}
											</p>
										)}
										{biogenicData && (
											<p className="text-sm" style={{ color: chartColors.dark }}>
												Biogenic Carbon: {formatNumber(Math.abs(biogenicData.value))} {getUnitLabel(kpi1Config, valueType)}
											</p>
										)}
										{barChartBenchmarkLines.length > 0 && (
											<div className="mt-2 pt-2 border-t">
												<p className="text-xs font-medium" style={{ color: chartColors.dark }}>
													Benchmarks:
												</p>
												{barChartBenchmarkLines.map((benchmark, idx) => (
													<p key={idx} className="text-xs" style={{ color: chartColors.dark }}>
														{benchmark.name}: {formatNumber(benchmark.value)} {getUnitLabel(kpi1Config, valueType)}
													</p>
												))}
											</div>
										)}
									</div>
								);
							}
							return null;
						}}
					/>
					<Bar dataKey={selectedKPI1} {...getBarProps()} fill={chartColors.primary} name={kpi1Config.key || selectedKPI1}>
						{sortedProjects.map((project, index) => {
							const sectorColor = getSectorColor(project['Primary Sector']);
							return <Cell key={index} fill={sectorColor} stroke={sectorColor} strokeWidth={3} />;
						})}
					</Bar>
					{selectedKPI1 === 'Total Embodied Carbon' && (
						<Bar dataKey="Biogenic Carbon" {...getBarProps()} fill="white" name="Biogenic Carbon">
							{sortedProjects.map((project, index) => {
								const sectorColor = getSectorColor(project['Primary Sector']);
								return <Cell key={index} fill="white" stroke={sectorColor} strokeWidth={3} />;
							})}
						</Bar>
					)}
					{<ReferenceLine y={0} stroke="#A8A8A3" strokeWidth={4} />}

					{/* Benchmark lines for Total Embodied Carbon */}
					{benchmarkLines.map((benchmark, index) => (
						<ReferenceLine
							key={benchmark.name}
							y={benchmark.value}
							stroke={benchmark.color}
							strokeWidth={2}
							strokeDasharray="5 5"
							label={{
								value: benchmark.name,
								position: 'insideTopRight',
								offset: 10,
								style: { fill: benchmark.color, fontSize: '12px', fontWeight: 'bold' },
							}}
						/>
					))}

					{/* UKNZCBS Benchmark lines for Upfront Carbon */}
					{barChartBenchmarkLines.map((benchmark, index) => (
						<ReferenceLine key={benchmark.name} y={benchmark.value} stroke={benchmark.color} strokeWidth={2} strokeDasharray={benchmark.name.includes('New Build') ? '5 5' : '10 5'} />
					))}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
