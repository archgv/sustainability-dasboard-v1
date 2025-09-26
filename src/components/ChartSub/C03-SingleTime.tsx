import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Project } from '../Key/project';
import { KPIOptions } from '../Key/KeyKPI';
import { ValueType } from '../Key/KeyChart';
import { getSectorColor, getSectorBenchmarkColor } from '../Key/KeySector';
import { formatNumber } from '@/lib/utils';
import { uknzcbsBenchmarks, uknzcbsOperationalEnergyBenchmarks } from '@/data/benchmarkData';
import { chartColors } from '../Key/KeyColor';
import { generateNiceTicks } from '../UtilChart/UtilTick';
import { transformDataForValueType } from '../UtilChart/UtilValueType';
import { getResponsiveContainerProps, getChartProps, getCartesianGridProps, getYAxisProps, getXAxisProps, getBarProps, getTooltipContainerStyle, getUnitLabel } from '../UtilChart/ChartConfig';

interface SingleTimeProps {
	projects: Project[];
	selectedKPI1: string;
	valueType: ValueType;
	isComparingToSelf?: boolean;
	selectedSubSector: string;
}

export const SingleTime = ({ projects, selectedKPI1, valueType, isComparingToSelf = false, selectedSubSector }: SingleTimeProps) => {
	const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);

	const transformedProjects = transformDataForValueType(projects, valueType, selectedKPI1, '');

	const timelineData = transformedProjects
		.map((project) => {
			const baseId = project.id.split('-')[0];
			const displayName = isComparingToSelf && project['Current RIBA Stage'] ? `${project['Project Name']} (RIBA ${project['Current RIBA Stage']})` : project['Project Name'];

			// Extract year only from completion date
			const completionYear = new Date(project['PC Date']).getFullYear();

			return {
				...project,
				displayName,
				completionYear,
				date: new Date(project['PC Date']).getTime(),
			};
		})
		.sort((a, b) => a.date - b.date);

	// Get UKNZCBS benchmark data for timeline - ONLY for Upfront Carbon and Operational Energy with per sqm
	const shouldShowUpfrontBenchmark = valueType === 'average' && selectedKPI1 === 'upfrontCarbon' && timelineData.length > 0;
	const shouldShowOperationalEnergyBenchmark = valueType === 'average' && selectedKPI1 === 'operationalEnergyTotal' && timelineData.length > 0;

	// Create UKNZCBS benchmark data for upfront carbon
	const createUpfrontBenchmarkData = () => {
		if (!shouldShowUpfrontBenchmark || !projects[0] || !selectedSubSector) {
			return { newBuildData: [], retrofitData: [] };
		}

		const sectorData = uknzcbsBenchmarks[projects[0]['Primary Sector'] as keyof typeof uknzcbsBenchmarks];
		if (!sectorData) {
			return { newBuildData: [], retrofitData: [] };
		}

		const subSectorData = sectorData[selectedSubSector as keyof typeof sectorData];
		if (!subSectorData) {
			return { newBuildData: [], retrofitData: [] };
		}

		// Create benchmark lines from 2025 to 2050
		const years = Array.from({ length: 26 }, (_, i) => 2025 + i);

		const newBuildData = years
			.map((year) => ({
				completionYear: year,
				benchmarkValue: subSectorData['New Build'][year as keyof (typeof subSectorData)['New Build']],
				benchmarkType: 'New Build',
			}))
			.filter((item) => item.benchmarkValue !== undefined);

		const retrofitData = subSectorData['Retrofit']
			? years
					.map((year) => ({
						completionYear: year,
						benchmarkValue: subSectorData['Retrofit'][year as keyof (typeof subSectorData)['Retrofit']],
						benchmarkType: 'Retrofit',
					}))
					.filter((item) => item.benchmarkValue !== undefined)
			: [];

		return { newBuildData, retrofitData };
	};

	const upfrontBenchmarkData = createUpfrontBenchmarkData();

	// Create operational energy benchmark data for timeline
	const createOperationalEnergyBenchmarkData = () => {
		if (!shouldShowOperationalEnergyBenchmark || !projects[0] || !selectedSubSector) {
			return { newBuildData: [], retrofitData: [] };
		}

		const sectorData = uknzcbsOperationalEnergyBenchmarks[projects[0]['Primary Sector'] as keyof typeof uknzcbsOperationalEnergyBenchmarks];
		if (!sectorData) {
			return { newBuildData: [], retrofitData: [] };
		}

		const subSectorData = sectorData[selectedSubSector as keyof typeof sectorData];
		if (!subSectorData) {
			return { newBuildData: [], retrofitData: [] };
		}

		// Only include years from 2025 onwards for operational energy benchmarks
		const benchmarkYears = Array.from({ length: 26 }, (_, i) => 2025 + i);

		const newBuildData = benchmarkYears
			.map((year) => {
				const newBuildValues = subSectorData['New Build'];
				const value = newBuildValues?.[year as keyof typeof newBuildValues];

				return {
					completionYear: year,
					benchmarkValue: value,
				};
			})
			.filter((item) => item.benchmarkValue !== undefined && item.benchmarkValue !== null);

		const retrofitData = benchmarkYears
			.map((year) => {
				const retrofitValues = subSectorData['Retrofit'];
				const value = retrofitValues?.[year as keyof typeof retrofitValues];

				return {
					completionYear: year,
					benchmarkValue: value,
				};
			})
			.filter((item) => item.benchmarkValue !== undefined && item.benchmarkValue !== null);

		return { newBuildData, retrofitData };
	};

	const operationalEnergyBenchmarkData = createOperationalEnergyBenchmarkData();
	const benchmarkColor = projects[0] ? getSectorBenchmarkColor(projects[0]['Primary Sector']) : '#1E9F5A';

	// Determine graph range based on project data
	const projectYears = timelineData.map((p) => p.completionYear);
	const minProjectYear = Math.min(...projectYears);
	const maxProjectYear = Math.max(...projectYears);

	// Set X-axis domain to start at 2020 (or earlier project year) and extend to 2050
	const xAxisDomain = [Math.min(2020, minProjectYear), 2050];
	const xAxisTicks = [2020, 2022, 2024, 2026, 2028, 2030, 2032, 2034, 2036, 2038, 2040, 2042, 2044, 2046, 2048, 2050];

	return (
		<ResponsiveContainer {...getResponsiveContainerProps()}>
			<LineChart data={timelineData} {...getChartProps()}>
				<CartesianGrid {...getCartesianGridProps()} />
				<XAxis
					{...getXAxisProps('Single Time', selectedKPI1, kpi1Config, valueType)}
					dataKey="completionYear"
					type="number"
					scale="linear"
					domain={xAxisDomain}
					ticks={xAxisTicks}
					tickFormatter={(value) => value.toString()}
					tick={{ fill: chartColors.dark, fontSize: 12 }}
				/>
				<YAxis
					{...getYAxisProps('Single Time', selectedKPI1, kpi1Config, valueType)}
					tickFormatter={(value) => formatNumber(value)}
					ticks={(() => {
						const maxValue = Math.max(
							...timelineData.map((p) => Math.abs(p[selectedKPI1] || 0)),
							...(shouldShowUpfrontBenchmark && upfrontBenchmarkData.newBuildData ? upfrontBenchmarkData.newBuildData.map((b) => b.benchmarkValue) : []),
							...(shouldShowUpfrontBenchmark && upfrontBenchmarkData.retrofitData ? upfrontBenchmarkData.retrofitData.map((b) => b.benchmarkValue) : []),
							...(shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.newBuildData
								? operationalEnergyBenchmarkData.newBuildData.map((b) => b.benchmarkValue || 0)
								: []),
							...(shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.retrofitData
								? operationalEnergyBenchmarkData.retrofitData.map((b) => b.benchmarkValue || 0)
								: [])
						);
						return generateNiceTicks(maxValue * 1.1);
					})()}
				/>
				<Tooltip
					contentStyle={getTooltipContainerStyle()}
					content={({ active, payload, label }) => {
						if (active && payload && payload.length) {
							const projectData = payload.find((p) => p.dataKey === selectedKPI1);
							const year = parseInt(label as string);

							// Find benchmark values for this year
							let newBuildBenchmark = null;
							let retrofitBenchmark = null;

							if (shouldShowUpfrontBenchmark) {
								newBuildBenchmark = upfrontBenchmarkData.newBuildData.find((d) => d.completionYear === year)?.benchmarkValue;
								retrofitBenchmark = upfrontBenchmarkData.retrofitData.find((d) => d.completionYear === year)?.benchmarkValue;
							} else if (shouldShowOperationalEnergyBenchmark) {
								newBuildBenchmark = operationalEnergyBenchmarkData.newBuildData.find((d) => d.completionYear === year)?.benchmarkValue;
								retrofitBenchmark = operationalEnergyBenchmarkData.retrofitData.find((d) => d.completionYear === year)?.benchmarkValue;
							}

							return (
								<div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
									<p className="font-semibold" style={{ color: chartColors.dark }}>
										Year: {label}
									</p>
									{projectData && (
										<>
											<p className="text-sm" style={{ color: chartColors.dark }}>
												Project: {projectData.payload.displayName}
											</p>
											<p className="text-sm" style={{ color: chartColors.dark }}>
												{kpi1Config.key}: {formatNumber(projectData.value as number)} {getUnitLabel(kpi1Config, valueType)}
											</p>
										</>
									)}
									{(newBuildBenchmark || retrofitBenchmark) && (
										<div className="mt-2 pt-2 border-t border-gray-200">
											{newBuildBenchmark && (
												<p className="text-sm" style={{ color: benchmarkColor }}>
													New Build: {formatNumber(newBuildBenchmark)} {getUnitLabel(kpi1Config, valueType)}
												</p>
											)}
											{retrofitBenchmark && (
												<p className="text-sm" style={{ color: benchmarkColor }}>
													Retrofit: {formatNumber(retrofitBenchmark)} {getUnitLabel(kpi1Config, valueType)}
												</p>
											)}
										</div>
									)}
								</div>
							);
						}
						return null;
					}}
				/>

				{/* Project data as scatter points */}
				<Line type="monotone" dataKey={selectedKPI1} stroke="transparent" strokeWidth={0} dot={false} name={kpi1Config.key || selectedKPI1} legendType="none" />

				{/* Render dots with sector colors */}
				{timelineData.map((project, index) => {
					const sectorColor = getSectorColor(project['Primary Sector']);
					return (
						<Line
							key={`dot-${index}`}
							type="monotone"
							dataKey={selectedKPI1}
							data={[project]}
							stroke="transparent"
							strokeWidth={0}
							dot={{ fill: sectorColor, strokeWidth: 2, r: 6 }}
							legendType="none"
						/>
					);
				})}

				{/* UKNZCBS upfront carbon benchmark lines */}
				{shouldShowUpfrontBenchmark && upfrontBenchmarkData.newBuildData.length > 0 && (
					<Line
						type="monotone"
						dataKey="benchmarkValue"
						data={upfrontBenchmarkData.newBuildData}
						stroke={benchmarkColor}
						strokeWidth={2}
						strokeDasharray="5 5"
						dot={false}
						name="New Build Benchmark"
						connectNulls={false}
					/>
				)}

				{shouldShowUpfrontBenchmark && upfrontBenchmarkData.retrofitData.length > 0 && (
					<Line
						type="monotone"
						dataKey="benchmarkValue"
						data={upfrontBenchmarkData.retrofitData}
						stroke={benchmarkColor}
						strokeWidth={2}
						strokeDasharray="10 5"
						dot={false}
						name="Retrofit Benchmark"
						connectNulls={false}
					/>
				)}

				{/* UKNZCBS operational energy benchmark lines */}
				{shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.newBuildData.length > 0 && (
					<Line
						type="monotone"
						dataKey="benchmarkValue"
						data={operationalEnergyBenchmarkData.newBuildData}
						stroke={benchmarkColor}
						strokeWidth={2}
						strokeDasharray="5 5"
						dot={false}
						name="New Build Benchmark"
						connectNulls={false}
					/>
				)}

				{shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.retrofitData.length > 0 && (
					<Line
						type="monotone"
						dataKey="benchmarkValue"
						data={operationalEnergyBenchmarkData.retrofitData}
						stroke={benchmarkColor}
						strokeWidth={2}
						strokeDasharray="10 5"
						dot={false}
						name="Retrofit Benchmark"
						connectNulls={false}
					/>
				)}

				{/* Legend for benchmark lines */}
				{((shouldShowUpfrontBenchmark && (upfrontBenchmarkData.newBuildData.length > 0 || upfrontBenchmarkData.retrofitData.length > 0)) ||
					(shouldShowOperationalEnergyBenchmark && (operationalEnergyBenchmarkData.newBuildData.length > 0 || operationalEnergyBenchmarkData.retrofitData.length > 0))) && (
					<Legend
						verticalAlign="bottom"
						height={36}
						content={(props) => {
							const legendItems = [];
							// Add upfront carbon benchmark items
							if (shouldShowUpfrontBenchmark && upfrontBenchmarkData.newBuildData.length > 0) {
								legendItems.push({
									value: 'New Build',
									type: 'line',
									color: benchmarkColor,
									strokeDasharray: '5 5',
								});
							}
							if (shouldShowUpfrontBenchmark && upfrontBenchmarkData.retrofitData.length > 0) {
								legendItems.push({
									value: 'Retrofit',
									type: 'line',
									color: benchmarkColor,
									strokeDasharray: '10 5',
								});
							}
							// Add operational energy benchmark items
							if (shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.newBuildData.length > 0) {
								legendItems.push({
									value: 'New Build',
									type: 'line',
									color: benchmarkColor,
									strokeDasharray: '5 5',
								});
							}
							if (shouldShowOperationalEnergyBenchmark && operationalEnergyBenchmarkData.retrofitData.length > 0) {
								legendItems.push({
									value: 'Retrofit',
									type: 'line',
									color: benchmarkColor,
									strokeDasharray: '10 5',
								});
							}

							return (
								<div className="flex justify-center items-center gap-6 mt-4">
									{legendItems.map((item, index) => (
										<div key={index} className="flex items-center gap-2">
											<svg width="24" height="2" className="inline-block">
												<line x1="0" y1="1" x2="24" y2="1" stroke={item.color} strokeWidth="2" strokeDasharray={item.strokeDasharray} />
											</svg>
											<span className="text-sm" style={{ color: chartColors.dark }}>
												{item.value}
											</span>
										</div>
									))}
								</div>
							);
						}}
					/>
				)}
			</LineChart>
		</ResponsiveContainer>
	);
};
