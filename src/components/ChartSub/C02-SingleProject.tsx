import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Project } from '../Key/project';
import { KPIOptions } from '../Key/KeyKPI';
import { getSectorColor, getSectorBenchmarkColor } from '@/components/Key/KeySector';
import { formatNumber } from '@/lib/utils';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks } from '@/data/benchmarkData';
import { chartColors } from '../Key/KeyColor';
import { generateNiceTicks } from '../Util/UtilTick';

import {
	getResponsiveContainerProps,
	getChartProps,
	getCartesianGridProps,
	getYAxisProps,
	getXAxisProps,
	getBarProps,
	getTooltipContainerStyle,
	MultiLineTickComponent,
	getUnitBracket,
} from '../Util/ChartConfig';
import { getGIA, getProjectCurrrentStage } from '../Util/UtilProject';
import { getProjectData } from '../Util/UtilChart';

interface BarChartProps {
	projects: Project[];
	selectedKPI1: string;
	valueType: string;
	isComparingToSelf?: boolean;
	showSingleProjectBenchmarks: boolean;
	selectedSubSector: string;
}

export const SingleProject = ({ projects, selectedKPI1, valueType, isComparingToSelf = false, showSingleProjectBenchmarks, selectedSubSector }: BarChartProps) => {
	const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);

	const chartData = projects.map((project) => {
		const projectCurrentStage = getProjectCurrrentStage(project);

		const kpiValues = Object.fromEntries(
			KPIOptions.map(({ key }) => {
				const multiplier = valueType === 'total' ? getGIA(project) : 1;
				const value = Number(projectCurrentStage[key]) * multiplier;

				return [key, value];
			})
		);

		return {
			// minimal fields used in the BarChart
			'Project Name': project['Project Name'],
			'Primary Sector': project['Primary Sector'],
			'Current RIBA Stage': project['Current RIBA Stage'],
			'Structural Frame Materials': projectCurrentStage?.['Structural Frame Materials'],
			...kpiValues,
		};
	});

	// Get UKNZCBS benchmark data for the bar chart - always based on PRIMARY project only
	const getBenchmarkUpfrontCarbon = () => {
		if (!selectedSubSector || selectedKPI1 !== 'Upfront Carbon' || valueType !== 'average' || projects.length === 0) {
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

		const subSectorData = sectorData[selectedSubSector as keyof typeof sectorData];
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

	// Get benchmark data for the primary project's sector (only for Embodied Carbon with average)
	const getBenchmarkEmbodiedCarbon = () => {
		if (!showSingleProjectBenchmarks || selectedKPI1 !== 'Embodied Carbon' || projects.length === 0) {
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

	const benchmarkEmbodiedCarbon = getBenchmarkEmbodiedCarbon();
	const benchmarkUpfrontCarbon = getBenchmarkUpfrontCarbon();

	return (
		<div className="w-full h-full flex justify-center">
			<ResponsiveContainer {...getResponsiveContainerProps()}>
				<BarChart data={chartData} barGap={-100} {...getChartProps()}>
					<CartesianGrid vertical={false} {...getCartesianGridProps()} />
					<XAxis
						{...getXAxisProps('Single Project', kpi1Config, valueType)}
						dataKey={(item) => {
							const displayName = isComparingToSelf && item['Current RIBA Stage'] ? `RIBA ${item['Current RIBA Stage']}` : item['Project Name'];
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
						{...getYAxisProps('Single Project', kpi1Config, valueType)}
						tickFormatter={(value) => formatNumber(value)}
						domain={
							valueType === 'average' && selectedKPI1 === 'Embodied Carbon'
								? [0, 1600]
								: valueType === 'average' && selectedKPI1 === 'Operational Energy'
								? [0, 300]
								: valueType === 'average' && selectedKPI1 === 'Upfront Carbon'
								? [0, 1000]
								: [0, 'dataMax']
						}
						ticks={
							valueType === 'average' && selectedKPI1 === 'Embodied Carbon'
								? [0, 400, 800, 1200, 1600]
								: valueType === 'average' && selectedKPI1 === 'Operational Energy'
								? [0, 50, 100, 150, 200, 250, 300]
								: valueType === 'average' && selectedKPI1 === 'Upfront Carbon'
								? [0, 200, 400, 600, 800, 1000]
								: (() => {
										const maxValue = Math.max(...chartData.map((p) => Math.abs(p[selectedKPI1] || 0)));
										return generateNiceTicks(maxValue * 1.1);
								  })()
						}
					/>
					<Tooltip
						cursor={{ fill: 'none' }}
						formatter={(value: number) => [`${formatNumber(value)} ${getUnitBracket(kpi1Config, valueType)}`, kpi1Config.key || selectedKPI1]}
						labelFormatter={(label) => `Project: ${label}`}
						contentStyle={getTooltipContainerStyle()}
						content={({ active, payload, label }) => {
							if (active && payload && payload.length) {
								const project = payload[0]?.payload;

								const mainValue = project[selectedKPI1];

								const renewableValue = project['Renewable Energy Generation'];
								const renewableKPIOption = KPIOptions.find((kpi) => kpi.key === 'Renewable Energy Generation');
								const renewableShow = ['Operational Energy', 'Operational Energy Part L', 'Operational Energy Gas'].includes(selectedKPI1);

								const biogenicValue = project['Biogenic Carbon'];
								const biogenicKPIOption = KPIOptions.find((kpi) => kpi.key === 'Biogenic Carbon');
								const biogenicShow = ['Upfront Carbon', 'Embodied Carbon'].includes(selectedKPI1);

								const structuralValue = project['Structural Frame Materials'];
								const structuralShow = ['Upfront Carbon', 'Embodied Carbon'].includes(selectedKPI1);

								const habitatValue = project['Habitats Units Gained'];
								const habitatShow = ['Biodiversity Net Gain'].includes(selectedKPI1);

								return (
									<div
										className="bg-white p-3 border rounded-lg shadow-lg"
										style={{
											backgroundColor: 'white',
											borderColor: chartColors.primary,
										}}
									>
										<p className="font-semibold" style={{ color: chartColors.dark }}>
											Project: {label}
										</p>
										{mainValue && (
											<p className="text-sm" style={{ color: chartColors.dark }}>
												{kpi1Config.key}: {formatNumber(mainValue)} {getUnitBracket(kpi1Config, valueType)}
											</p>
										)}
										{renewableShow && renewableValue && (
											<p className="text-sm" style={{ color: chartColors.dark }}>
												Renewable Energy Generation: {formatNumber(renewableValue)} {getUnitBracket(renewableKPIOption, valueType)}
											</p>
										)}
										{biogenicShow && biogenicValue && (
											<p className="text-sm" style={{ color: chartColors.dark }}>
												Biogenic Carbon: {formatNumber(biogenicValue)} {getUnitBracket(biogenicKPIOption, valueType)}
											</p>
										)}
										{structuralShow && structuralValue && (
											<p className="text-sm" style={{ color: chartColors.dark }}>
												Structural Frame Materials: {structuralValue}
											</p>
										)}
										{habitatShow && habitatValue && (
											<p className="text-sm" style={{ color: chartColors.dark }}>
												Habitats Units Gained: {habitatValue}
											</p>
										)}
									</div>
								);
							}
							return null;
						}}
					/>
					<Bar dataKey={selectedKPI1} {...getBarProps()} fill={chartColors.primary} name={kpi1Config.key || selectedKPI1}>
						{chartData.map((project, index) => {
							const sectorColor = getSectorColor(project['Primary Sector']);
							return <Cell key={index} fill={sectorColor} stroke={sectorColor} strokeWidth={3} />;
						})}
					</Bar>
					{selectedKPI1 === 'Embodied Carbon' && (
						<Bar dataKey="Biogenic Carbon" {...getBarProps()} fill="white" name="Biogenic Carbon">
							{chartData.map((project, index) => {
								const sectorColor = getSectorColor(project['Primary Sector']);
								return <Cell key={index} fill="white" stroke={sectorColor} strokeWidth={3} />;
							})}
						</Bar>
					)}
					{<ReferenceLine y={0} stroke={chartColors.pink} strokeWidth={4} />}

					{/* Benchmark lines for Embodied Carbon */}
					{benchmarkEmbodiedCarbon.map((benchmark, index) => (
						<ReferenceLine
							key={benchmark.name}
							y={benchmark.value}
							stroke={benchmark.color}
							strokeWidth={2}
							strokeDasharray="2 2"
							label={{
								value: benchmark.name,
								position: 'insideTopRight',
								offset: 10,
								style: {
									fill: benchmark.color,
									fontSize: '12px',
									fontWeight: 'bold',
								},
							}}
						/>
					))}

					{/* UKNZCBS Benchmark lines for Upfront Carbon */}
					{benchmarkUpfrontCarbon.map((benchmark, index) => (
						<ReferenceLine
							key={benchmark.name}
							y={benchmark.value}
							stroke={benchmark.color}
							strokeWidth={2}
							strokeDasharray={benchmark.name.includes('New Build') ? '10 5' : '2 2'}
							label={{
								value: benchmark.name,
								position: 'insideTopRight',
								offset: 10,
								style: {
									fill: benchmark.color,
									fontSize: '12px',
									fontWeight: 'bold',
								},
							}}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};
