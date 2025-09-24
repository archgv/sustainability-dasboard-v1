import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Eye, EyeOff } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend, Cell, ReferenceLine, ReferenceDot } from 'recharts';
import { Project, availableKPIs } from '@/types/project';
import { ChartType, EmbodiedCarbonBreakdown, ValueType } from './R31-ChartOption';
import { getSectorColor, getSectorShape, sectorConfig, getSectorBenchmarkColor } from '@/utils/projectUtils';
import { formatNumber } from '@/lib/utils';
import { useState } from 'react';
import { ChartShape } from './R33-ChartShape';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks, uknzcbsOperationalEnergyBenchmarks } from '@/data/benchmarkData';
import { exportChartToCSV } from '@/components/chartExport/chartExportCSV';
import { exportChartToPNG } from '@/components/chartExport/chartExportPNG';

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

// Custom color palette based on your specifications
const chartColors = {
	primary: '#2D9B4D', // Updated to green as requested
	secondary: '#48DE9D', // Bright green
	tertiary: '#FF8EE5', // Updated bright pink as requested
	quaternary: '#5dc5ed', // Light blue
	accent1: '#E9E8D3', // Updated light green fill as requested
	accent2: '#c9e1ea', // Light blue/grey
	dark: '#272727', // Updated dark gray as requested
	darkGreen: '#004033', // Dark green
	benchmark: '#e74c3c', // Red for benchmark lines
	// Additional complementary colors
	warning: '#f39c12', // Orange
	info: '#3498db', // Medium blue
	success: '#2D9B4D', // Updated to use new green
	muted: '#272727', // Updated to use new dark gray
};

// Color arrays for different chart types
const seriesColors = [
	chartColors.primary,
	chartColors.secondary,
	chartColors.tertiary,
	chartColors.quaternary,
	chartColors.warning,
	chartColors.info,
	chartColors.success,
	chartColors.muted,
	chartColors.darkGreen,
];

// Utility function to generate nice, regular tick intervals
const generateNiceTicks = (maxValue: number, tickCount: number = 5): number[] => {
	if (maxValue <= 0) return [0];

	// Calculate step size
	const roughStep = maxValue / (tickCount - 1);

	// Round step to nice numbers (1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, etc.)
	const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
	const normalizedStep = roughStep / magnitude;

	let niceStep;
	if (normalizedStep <= 1) niceStep = 1;
	else if (normalizedStep <= 2) niceStep = 2;
	else if (normalizedStep <= 5) niceStep = 5;
	else niceStep = 10;

	const finalStep = niceStep * magnitude;

	// Generate ticks
	const ticks = [];
	for (let i = 0; i <= Math.ceil(maxValue / finalStep); i++) {
		ticks.push(i * finalStep);
	}

	return ticks;
};

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

		if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon' && embodiedCarbonBreakdown !== 'none') {
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
		// Handle embodied carbon breakdown with stacked columns
		if (chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon' && embodiedCarbonBreakdown !== 'none') {
			const stackedData = getEmbodiedCarbonStackedData();

			if (stackedData.length === 0) {
				return <div className="flex items-center justify-center h-full text-gray-500">No breakdown data available for selected projects</div>;
			}

			const categories = embodiedCarbonBreakdown === 'lifecycle' ? getLifecycleStageCategories() : getBuildingElementCategories();

			return (
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={stackedData} margin={{ top: 50, right: 30, left: 20, bottom: 60 }}>
						<CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
						<XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fill: chartColors.dark }} />
						<YAxis
							label={{ value: valueType === 'per-sqm' ? 'kgCO₂e/m²' : 'kgCO₂e total', angle: -90, position: 'insideLeft' }}
							tick={{ fill: chartColors.dark }}
							tickFormatter={(value) => formatNumber(value)}
							ticks={(() => {
								const maxValue = Math.max(...stackedData.flatMap((item) => categories.map((cat) => Math.abs(item[cat.key] || 0))));
								return generateNiceTicks(maxValue * 1.1);
							})()}
						/>
						<Tooltip
							formatter={(value: number, name: string) => {
								const category = categories.find((cat) => cat.key === name);
								// Make biogenic carbon negative in tooltip
								const displayValue = name === 'biogenicCarbon' ? -Math.abs(value) : value;
								return [`${formatNumber(displayValue)} ${valueType === 'per-sqm' ? 'kgCO₂e/m²' : 'kgCO₂e total'}`, category?.label || name];
							}}
							labelFormatter={(label) => `Project: ${label}`}
							contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
						/>
						<Legend
							wrapperStyle={{ paddingTop: '20px' }}
							formatter={(value) => {
								const category = categories.find((cat) => cat.key === value);
								return category?.label || value;
							}}
						/>
						{categories.map((category) => (
							<Bar key={category.key} dataKey={category.key} stackId="embodiedCarbon" fill={category.color} name={category.label} />
						))}
					</BarChart>
				</ResponsiveContainer>
			);
		}

		const transformedProjects = transformDataForValueType(projects);

		// Projects are now passed in the correct order (primary first, then comparison projects in selection order)
		// No need to re-sort, just use the order they were provided
		const sortedProjects = transformedProjects;

		// Transform biogenic carbon values to negative for bubble chart display - use sorted projects
		const bubbleChartData = sortedProjects.map((project) => ({
			...project,
			[selectedKPI1]: selectedKPI1 === 'biogenicCarbon' ? -Math.abs(project[selectedKPI1] || 0) : project[selectedKPI1],
			[selectedKPI2]: selectedKPI2 === 'biogenicCarbon' ? -Math.abs(project[selectedKPI2] || 0) : project[selectedKPI2],
		}));

		switch (chartType) {
			case 'compare-bubble':
				return (
					<ResponsiveContainer width="100%" height="100%">
						<ScatterChart margin={{ top: 80, right: 20, bottom: 20, left: 80 }}>
							<CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
							<XAxis
								type="number"
								dataKey={selectedKPI1}
								name={kpi1Config?.label || selectedKPI1}
								label={{ value: `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType)})`, position: 'insideBottom', offset: -5 }}
								tick={{ fill: chartColors.dark }}
								tickFormatter={(value) => formatNumber(value)}
								ticks={(() => {
									const maxValue = Math.max(...bubbleChartData.map((p) => Math.abs(p[selectedKPI1] || 0)));
									return generateNiceTicks(maxValue * 1.1);
								})()}
							/>
							<YAxis
								type="number"
								dataKey={selectedKPI2}
								name={kpi2Config?.label || selectedKPI2}
								label={{
									value: `${kpi2Config?.label || selectedKPI2} (${getUnitLabel(kpi2Config?.unit || '', valueType)})`,
									angle: -90,
									position: 'outside',
									textAnchor: 'middle',
									offset: 10,
								}}
								tick={{ fill: chartColors.dark }}
								tickFormatter={(value) => formatNumber(value)}
								ticks={(() => {
									const maxValue = Math.max(...bubbleChartData.map((p) => Math.abs(p[selectedKPI2] || 0)));
									return generateNiceTicks(maxValue * 1.1);
								})()}
							/>
							<Tooltip
								cursor={{ strokeDasharray: '3 3' }}
								contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
								content={({ active, payload }) => {
									if (active && payload && payload.length) {
										const data = payload[0].payload;
										const baseId = data.id.split('-')[0];
										const area = getProjectArea(baseId);
										const displayName = isComparingToSelf && data['Current RIBA Stage'] ? `${data['Project Name']} (RIBA ${data['Current RIBA Stage']})` : data['Project Name'];

										return (
											<div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
												<p className="font-semibold" style={{ color: chartColors.dark }}>
													{displayName}
												</p>
												<p className="text-sm" style={{ color: chartColors.darkGreen }}>
													{data['Primary Sector']}
												</p>
												<p className="text-sm" style={{ color: chartColors.dark }}>
													Area: {formatNumber(area)} m²
												</p>
												<p className="text-sm" style={{ color: chartColors.dark }}>
													{kpi1Config?.label}: {formatNumber(data[selectedKPI1])} {getUnitLabel(kpi1Config?.unit || '', valueType)}
												</p>
												<p className="text-sm" style={{ color: chartColors.dark }}>
													{kpi2Config?.label}: {formatNumber(data[selectedKPI2])} {getUnitLabel(kpi2Config?.unit || '', valueType)}
												</p>
											</div>
										);
									}
									return null;
								}}
							/>
							<Scatter
								name="Projects"
								data={bubbleChartData}
								fill={chartColors.primary}
								fillOpacity={0.8}
								shape={(props) => {
									const { cx, cy, payload } = props;
									if (!payload) return null;

									const baseId = payload.id.split('-')[0];
									const area = getProjectArea(baseId);
									const bubbleSize = valueType === 'per-sqm' ? Math.sqrt(area / 500) : 8;
									const sectorColor = getSectorColor(payload['Primary Sector']);
									const shape = getSectorShape(payload['Primary Sector']);

									return <ChartShape cx={cx} cy={cy} fill={sectorColor} shape={shape} size={Math.max(16, Math.min(40, bubbleSize * 2))} />;
								}}
							/>
						</ScatterChart>
					</ResponsiveContainer>
				);

			case 'single-bar': {
				const MultiLineTickComponent = (props) => {
					const { x, y, payload } = props;
					const words = payload.value.split(' ');
					const lines = [];
					let currentLine = '';

					// Split text into lines of max 2-3 words
					for (let i = 0; i < words.length; i++) {
						const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
						if (testLine.length > 15 && currentLine) {
							lines.push(currentLine);
							currentLine = words[i];
						} else {
							currentLine = testLine;
						}
					}
					if (currentLine) lines.push(currentLine);

					return (
						<g transform={`translate(${x},${y + 20})`}>
							{lines.map((line, index) => (
								<text key={index} x={0} y={index * 16} textAnchor="end" fill={chartColors.dark} fontSize="12" transform="rotate(-45)">
									{line}
								</text>
							))}
						</g>
					);
				};

				// Add biogenic data as negative values for totalEmbodiedCarbon - use sorted projects
				const chartData = sortedProjects.map((project) => ({
					...project,
					biogenic: selectedKPI1 === 'totalEmbodiedCarbon' ? -Math.abs(project['Biogenic Carbon'] || 0) * (valueType === 'total' ? getProjectArea(project.id.split('-')[0]) : 1) : 0,
				}));

				// Get UKNZCBS benchmark data for the bar chart - always based on PRIMARY project only
				const getBarChartBenchmarkLines = () => {
					if (!selectedBarChartBenchmark || selectedKPI1 !== 'upfrontCarbon' || valueType !== 'per-sqm' || projects.length === 0) {
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

					const newBuildValue = subSectorData['New building']?.[benchmarkYear as keyof (typeof subSectorData)['New building']];
					const retrofitValue = subSectorData['Retrofit']?.[benchmarkYear as keyof (typeof subSectorData)['Retrofit']];

					const benchmarkLines = [];
					if (newBuildValue !== undefined) {
						benchmarkLines.push({
							name: `New building (PC ${benchmarkYear})`,
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

				// Get benchmark data for the primary project's sector (only for Total Embodied Carbon with per-sqm)
				const getBenchmarkLines = () => {
					if (!showBenchmarks || selectedKPI1 !== 'totalEmbodiedCarbon' || valueType !== 'per-sqm' || projects.length === 0) {
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
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={chartData} margin={{ top: 50, right: 30, left: 20, bottom: 80 }}>
							<CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
							<XAxis
								dataKey={(item) => {
									const baseId = item.id.split('-')[0];
									const displayName = isComparingToSelf && item.ribaStage ? `${item.name} (RIBA ${item.ribaStage.replace('stage-', '')})` : item.name;
									return displayName;
								}}
								height={80}
								interval={0}
								tick={<MultiLineTickComponent />}
								axisLine={{ stroke: chartColors.dark, strokeWidth: 1 }}
								tickLine={false}
							/>
							<YAxis
								label={{
									value: `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType)})`,
									angle: -90,
									position: 'insideLeft',
									style: { textAnchor: 'middle' },
								}}
								tick={{ fill: chartColors.dark }}
								tickFormatter={(value) => formatNumber(value)}
								domain={selectedKPI1 === 'totalEmbodiedCarbon' ? [0, 1600] : [0, 'dataMax']}
								ticks={
									selectedKPI1 === 'totalEmbodiedCarbon'
										? [0, 400, 800, 1200, 1600]
										: (() => {
												const maxValue = Math.max(...chartData.map((p) => Math.abs(p[selectedKPI1] || 0)));
												return generateNiceTicks(maxValue * 1.1);
										  })()
								}
							/>
							<Tooltip
								formatter={(value: number, name: string) => [
									`${formatNumber(value)} ${getUnitLabel(kpi1Config?.unit || '', valueType)}`,
									name === 'biogenic' ? 'Biogenic Carbon' : kpi1Config?.label || selectedKPI1,
								]}
								labelFormatter={(label) => `Project: ${label}`}
								contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
								content={({ active, payload, label }) => {
									if (active && payload && payload.length) {
										const mainData = payload.find((p) => p.dataKey === selectedKPI1);
										const biogenicData = payload.find((p) => p.dataKey === 'biogenic');

										return (
											<div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
												<p className="font-semibold" style={{ color: chartColors.dark }}>
													Project: {label}
												</p>
												{mainData && (
													<p className="text-sm" style={{ color: chartColors.dark }}>
														{kpi1Config?.label}: {formatNumber(mainData.value)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
													</p>
												)}
												{biogenicData && (
													<p className="text-sm" style={{ color: chartColors.dark }}>
														Biogenic Carbon: {formatNumber(Math.abs(biogenicData.value))} {getUnitLabel(kpi1Config?.unit || '', valueType)}
													</p>
												)}
											</div>
										);
									}
									return null;
								}}
							/>
							<Bar dataKey={selectedKPI1} fill={chartColors.primary} name={kpi1Config?.label || selectedKPI1} radius={[4, 4, 0, 0]}>
								{sortedProjects.map((project, index) => {
									const sectorColor = getSectorColor(project['Primary Sector']);
									return <Cell key={index} fill={sectorColor} />;
								})}
							</Bar>
							{selectedKPI1 === 'totalEmbodiedCarbon' && (
								<Bar dataKey="biogenic" fill="white" name="biogenic" radius={[0, 0, 4, 4]}>
									{sortedProjects.map((project, index) => {
										const sectorColor = getSectorColor(project['Primary Sector']);
										return <Cell key={index} fill="white" stroke={sectorColor} strokeWidth={2} />;
									})}
								</Bar>
							)}
							{selectedKPI1 === 'totalEmbodiedCarbon' && <ReferenceLine y={0} stroke="#A8A8A3" strokeWidth={2} />}

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
								<ReferenceLine
									key={benchmark.name}
									y={benchmark.value}
									stroke={benchmark.color}
									strokeWidth={2}
									strokeDasharray={benchmark.name.includes('New building') ? '5 5' : '10 5'}
								/>
							))}
						</BarChart>
					</ResponsiveContainer>
				);

				// Add legend for UKNZCBS benchmarks as a separate component
				const BarChartLegend = () => {
					if (barChartBenchmarkLines.length === 0) return null;

					return (
						<div className="flex justify-center items-center gap-6 mt-4">
							{barChartBenchmarkLines.map((item, index) => (
								<div key={index} className="flex items-center gap-2">
									<svg width="24" height="2" className="inline-block">
										<line x1="0" y1="1" x2="24" y2="1" stroke={item.color} strokeWidth="2" strokeDasharray={item.name.includes('New building') ? '5 5' : '10 5'} />
									</svg>
									<span className="text-sm" style={{ color: chartColors.dark }}>
										{item.name}
									</span>
								</div>
							))}
						</div>
					);
				};

				return (
					<div>
						{/* Benchmark Legend - positioned after title, before chart */}
						{barChartBenchmarkLines.length > 0 && (
							<div className="flex justify-center items-center gap-6 mb-4">
								{barChartBenchmarkLines.map((item, index) => (
									<div key={index} className="flex items-center gap-2">
										<svg width="24" height="2" className="inline-block">
											<line x1="0" y1="1" x2="24" y2="1" stroke={item.color} strokeWidth="2" strokeDasharray={item.name.includes('New building') ? '5 5' : '10 5'} />
										</svg>
										<span className="text-sm" style={{ color: chartColors.dark }}>
											{item.name}
										</span>
									</div>
								))}
							</div>
						)}
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData} margin={{ top: 50, right: 30, left: 20, bottom: 80 }}>
								<CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
								<XAxis
									dataKey={(item) => {
										const baseId = item.id.split('-')[0];
										const displayName = isComparingToSelf && item.ribaStage ? `${item.name} (RIBA ${item.ribaStage.replace('stage-', '')})` : item.name;
										return displayName;
									}}
									height={80}
									interval={0}
									tick={<MultiLineTickComponent />}
									axisLine={{ stroke: chartColors.dark, strokeWidth: 1 }}
									tickLine={false}
								/>
								<YAxis
									label={{
										value: `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType)})`,
										angle: -90,
										position: 'insideLeft',
										style: { textAnchor: 'middle' },
									}}
									tick={{ fill: chartColors.dark }}
									tickFormatter={(value) => formatNumber(value)}
									domain={
										selectedKPI1 === 'totalEmbodiedCarbon'
											? [0, 1600]
											: selectedKPI1 === 'upfrontCarbon'
											? [0, 1000]
											: (() => {
													const maxDataValue = Math.max(...chartData.map((p) => Math.abs(p[selectedKPI1] || 0)));
													const maxBenchmarkValue = barChartBenchmarkLines.length > 0 ? Math.max(...barChartBenchmarkLines.map((b) => b.value)) : 0;
													const maxValue = Math.max(maxDataValue, maxBenchmarkValue, 1000);
													return [0, Math.max(maxValue * 1.1, 1000)];
											  })()
									}
									ticks={
										selectedKPI1 === 'totalEmbodiedCarbon'
											? [0, 400, 800, 1200, 1600]
											: selectedKPI1 === 'upfrontCarbon'
											? [0, 200, 400, 600, 800, 1000]
											: (() => {
													const maxDataValue = Math.max(...chartData.map((p) => Math.abs(p[selectedKPI1] || 0)));
													const maxBenchmarkValue = barChartBenchmarkLines.length > 0 ? Math.max(...barChartBenchmarkLines.map((b) => b.value)) : 0;
													const maxValue = Math.max(maxDataValue, maxBenchmarkValue, 1000);
													return generateNiceTicks(Math.max(maxValue * 1.1, 1000));
											  })()
									}
								/>
								<Tooltip
									formatter={(value: number, name: string) => [
										`${formatNumber(value)} ${getUnitLabel(kpi1Config?.unit || '', valueType)}`,
										name === 'biogenic' ? 'Biogenic Carbon' : kpi1Config?.label || selectedKPI1,
									]}
									labelFormatter={(label) => `Project: ${label}`}
									contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
									content={({ active, payload, label }) => {
										if (active && payload && payload.length) {
											const mainData = payload.find((p) => p.dataKey === selectedKPI1);
											const biogenicData = payload.find((p) => p.dataKey === 'biogenic');

											return (
												<div className="bg-white p-3 border rounded-lg shadow-lg" style={{ backgroundColor: 'white', borderColor: chartColors.primary }}>
													<p className="font-semibold" style={{ color: chartColors.dark }}>
														Project: {label}
													</p>
													{mainData && (
														<p className="text-sm" style={{ color: chartColors.dark }}>
															{kpi1Config?.label}: {formatNumber(mainData.value)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
														</p>
													)}
													{biogenicData && (
														<p className="text-sm" style={{ color: chartColors.dark }}>
															Biogenic Carbon: {formatNumber(Math.abs(biogenicData.value))} {getUnitLabel(kpi1Config?.unit || '', valueType)}
														</p>
													)}
													{barChartBenchmarkLines.length > 0 && (
														<div className="mt-2 pt-2 border-t">
															<p className="text-xs font-medium" style={{ color: chartColors.dark }}>
																Benchmarks:
															</p>
															{barChartBenchmarkLines.map((benchmark, idx) => (
																<p key={idx} className="text-xs" style={{ color: chartColors.dark }}>
																	{benchmark.name}: {formatNumber(benchmark.value)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
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
								<Bar dataKey={selectedKPI1} fill={chartColors.primary} name={kpi1Config?.label || selectedKPI1} radius={[4, 4, 0, 0]}>
									{sortedProjects.map((project, index) => {
										const sectorColor = getSectorColor(project['Primary Sector']);
										return <Cell key={index} fill={sectorColor} />;
									})}
								</Bar>
								{selectedKPI1 === 'totalEmbodiedCarbon' && (
									<Bar dataKey="biogenic" fill="white" name="biogenic" radius={[0, 0, 4, 4]}>
										{sortedProjects.map((project, index) => {
											const sectorColor = getSectorColor(project['Primary Sector']);
											return <Cell key={index} fill="white" stroke={sectorColor} strokeWidth={2} />;
										})}
									</Bar>
								)}
								{selectedKPI1 === 'totalEmbodiedCarbon' && <ReferenceLine y={0} stroke="#A8A8A3" strokeWidth={2} />}

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
									<ReferenceLine
										key={benchmark.name}
										y={benchmark.value}
										stroke={benchmark.color}
										strokeWidth={2}
										strokeDasharray={benchmark.name.includes('New building') ? '5 5' : '10 5'}
									/>
								))}
							</BarChart>
						</ResponsiveContainer>
					</div>
				);
			}

			case 'single-timeline': {
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
				const shouldShowUpfrontBenchmark = valueType === 'per-sqm' && selectedKPI1 === 'upfrontCarbon' && timelineData.length > 0;
				const shouldShowOperationalEnergyBenchmark = valueType === 'per-sqm' && selectedKPI1 === 'operationalEnergyTotal' && timelineData.length > 0;

				// Helper function to get sub-sectors for a given sector
				const getSubSectorsForSector = (sector: string): string[] => {
					const sectorSubSectors = uknzcbsBenchmarks[sector as keyof typeof uknzcbsBenchmarks];
					return sectorSubSectors ? Object.keys(sectorSubSectors) : [];
				};

				// Get the primary project's sector and available sub-sectors
				const availableSubSectors = getSubSectorsForSector(projects[0]['Primary Sector']);

				// Set default sub-sector if not already selected
				if (!selectedSubSector && availableSubSectors.length > 0) {
					setSelectedSubSector(availableSubSectors[0]);
				}

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
							benchmarkValue: subSectorData['New building'][year as keyof (typeof subSectorData)['New building']],
							benchmarkType: 'New building',
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
							const newBuildValues = subSectorData['New building'];
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
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={timelineData} margin={{ top: 40, right: 30, left: 60, bottom: 80 }}>
							<CartesianGrid strokeDasharray="3 3" stroke={chartColors.accent1} horizontal={true} verticalPoints={[]} />
							<XAxis
								dataKey="completionYear"
								type="number"
								scale="linear"
								domain={xAxisDomain}
								ticks={xAxisTicks}
								tickFormatter={(value) => value.toString()}
								label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
								tick={{ fill: chartColors.dark }}
							/>
							<YAxis
								label={{
									value: `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType)})`,
									angle: -90,
									position: 'insideLeft',
									style: { textAnchor: 'middle' },
								}}
								tick={{ fill: chartColors.dark }}
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
								contentStyle={{ backgroundColor: 'white', border: `1px solid ${chartColors.primary}`, borderRadius: '8px' }}
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
															{kpi1Config?.label}: {formatNumber(projectData.value as number)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
														</p>
													</>
												)}
												{(newBuildBenchmark || retrofitBenchmark) && (
													<div className="mt-2 pt-2 border-t border-gray-200">
														{newBuildBenchmark && (
															<p className="text-sm" style={{ color: benchmarkColor }}>
																New Build: {formatNumber(newBuildBenchmark)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
															</p>
														)}
														{retrofitBenchmark && (
															<p className="text-sm" style={{ color: benchmarkColor }}>
																Retrofit: {formatNumber(retrofitBenchmark)} {getUnitLabel(kpi1Config?.unit || '', valueType)}
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
							<Line type="monotone" dataKey={selectedKPI1} stroke="transparent" strokeWidth={0} dot={false} name={kpi1Config?.label || selectedKPI1} legendType="none" />

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
									name="New building benchmark"
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
									name="Retrofit benchmark"
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
									name="New building benchmark"
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
									name="Retrofit benchmark"
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
			}

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
		if (selectedKPI1 === 'upfrontCarbon') {
			const sectorData = uknzcbsBenchmarks[projects[0]['Primary Sector'] as keyof typeof uknzcbsBenchmarks];
			return sectorData ? Object.keys(sectorData) : [];
		} else if (selectedKPI1 === 'operationalEnergyTotal') {
			const sectorData = uknzcbsOperationalEnergyBenchmarks[projects[0]['Primary Sector'] as keyof typeof uknzcbsOperationalEnergyBenchmarks];
			return sectorData ? Object.keys(sectorData) : [];
		}

		return [];
	};

	const availableSubSectors = getAvailableSubSectors();
	const showSubSectorToggle =
		(selectedKPI1 === 'upfrontCarbon' || selectedKPI1 === 'operationalEnergyTotal') && valueType === 'per-sqm' && chartType === 'single-timeline' && availableSubSectors.length > 1;
	const showBarChartSubSectorToggle = selectedKPI1 === 'upfrontCarbon' && valueType === 'per-sqm' && chartType === 'single-bar' && availableSubSectors.length > 0;

	return (
		<Card className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold" style={{ color: chartColors.dark }}>
					{getChartTitle()}
				</h2>
				<div className="flex items-center space-x-2">
					{/* Show benchmark toggle only for Total Embodied Carbon with per-sqm values */}
					{selectedKPI1 === 'totalEmbodiedCarbon' && valueType === 'per-sqm' && chartType === 'single-bar' && (
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
