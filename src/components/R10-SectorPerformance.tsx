import { useEffect, useState } from 'react';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { formatNumber } from '@/lib/utils';
import { sectorConfig } from '@/components/Utils/UtilSector';
import { Project, KPIOptions } from '@/components/Utils/project';
import { exportSectorCSV } from '@/components/SectorSub/S01-ExportCSV';
import { exportSectorPNG } from '@/components/SectorSub/S02-ExportPNG';
import { chartColors } from './Utils/UtilColor';
import { getResponsiveContainerProps, getCartesianGridProps, getYAxisProps, getTooltipContainerStyle, getDisplayUnit } from './ChartSub/C00-ChartConfig';

interface SectorStats {
	count: number;
	totalValue: number;
	totalGIA: number;
	minValue: number;
	maxValue: number;
	values: number[];
}

type SectorStatsMap = Record<string, SectorStats>;

interface BiogenicStats {
	totalValue: number;
	count: number;
}

export const SectorPerformance = ({ projects }: { projects: Project[] }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [selectedKPI, setSelectedKPI] = useState('Total Embodied Carbon');
	const [valueType, setValueType] = useState<'average' | 'total'>('average');
	const [yearFilter, setYearFilter] = useState('all');
	// Force average for biodiversity metrics
	useEffect(() => {
		if (['Biodiversity Net Gain', 'Urban Greening Factor'].includes(selectedKPI)) {
			setValueType('average'); // runs only when selectedKPI changes
		}
	}, [selectedKPI]);
	const currentKPI = KPIOptions.find((kpi) => kpi.key === selectedKPI);
	const allSectors = ['Residential', 'Education', 'Healthcare', 'Infrastructure', 'CCC', 'Workplace'];

	// Filter projects by year if needed
	const filteredProjects =
		yearFilter === 'all'
			? projects
			: projects.filter((project) => {
					const projectYear = new Date(project['PC Date']).getFullYear();
					const filterYear = parseInt(yearFilter.replace('from-', ''));
					return projectYear >= filterYear;
			  });

	const sectorStats = filteredProjects.reduce<SectorStatsMap>((acc, project: Project) => {
		const sector = project['Primary Sector'];
		if (!acc[sector]) {
			acc[sector] = {
				count: 0,
				totalValue: 0,
				totalGIA: 0,
				minValue: Infinity,
				maxValue: -Infinity,
				values: [],
			};
		}
		acc[sector].count++;
		const value = project[selectedKPI] || 0;
		const gia = project['GIA'] || 0;
		if (valueType === 'total' && gia > 0) {
			let totalValue = value * gia;
			// Convert to appropriate units for totals
			if (selectedKPI === 'Upfront Carbon' || selectedKPI === 'Total Embodied Carbon') {
				totalValue = totalValue / 1000; // Convert kg to tonnes
			} else if (selectedKPI === 'Operational Energy Total' || selectedKPI === 'Operational Energy Gas') {
				totalValue = totalValue / 1000; // Convert kWh to MWh
			}
			acc[sector].totalValue += totalValue;
			acc[sector].minValue = Math.min(acc[sector].minValue, totalValue);
			acc[sector].maxValue = Math.max(acc[sector].maxValue, totalValue);
			acc[sector].values.push(totalValue);
		} else {
			acc[sector].totalValue += value;
			acc[sector].minValue = Math.min(acc[sector].minValue, value);
			acc[sector].maxValue = Math.max(acc[sector].maxValue, value);
			acc[sector].values.push(value);
		}
		acc[sector].totalGIA += gia;
		return acc;
	}, {});

	const getAverage = (total: number, count: number) => {
		return count > 0 ? Math.round(total / count) : 0;
	};

	// Create chart data ensuring all sectors are included
	const chartData = allSectors.map((sector) => {
		const stats = sectorStats[sector];
		const baseValue = stats ? getAverage(stats.totalValue, stats.count) : 0;

		// For Total Embodied Carbon, also calculate biogenic data for negative columns
		let biogenicValue = 0;
		if (selectedKPI === 'Total Embodied Carbon' && stats) {
			const biogenicStats = filteredProjects.reduce<BiogenicStats>(
				(acc, project: Project) => {
					if (project['Primary Sector'] === sector) {
						const value = project['Biogenic Carbon'] || 0;
						const gia = project['GIA'] || 0;
						if (valueType === 'total' && gia > 0) {
							let totalValue = value * gia;
							totalValue = totalValue / 1000; // Convert kg to tonnes
							acc.totalValue += totalValue;
						} else {
							acc.totalValue += value;
						}
						acc.count += 1;
					}
					return acc;
				},
				{ totalValue: 0, count: 0 }
			);

			biogenicValue = biogenicStats.count > 0 ? Math.round(biogenicStats.totalValue / biogenicStats.count) : 0;
		}

		return {
			sector: sector,
			value: baseValue,
			biogenicValue: -Math.abs(biogenicValue), // Make it negative for below zero
			count: stats ? stats.count : 0,
		};
	});

	const getYearOptions = () => {
		const years = projects.map((p) => new Date(p['PC Date']).getFullYear());
		const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
		return uniqueYears;
	};

	const handleDownloadCSV = () => {
		exportSectorCSV({
			selectedKPI,
			currentKPI,
			valueType,
			yearFilter,
			sectorStats,
			allSectors,
		});
	};

	const handleDownloadPNG = () => {
		exportSectorPNG({
			selectedKPI,
			currentKPI,
			valueType,
			yearFilter,
			sectorStats,
			allSectors,
		});
	};

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
				<h2 className="text-xl font-semibold" style={{ color: chartColors.dark }}>
					Sector Performance Analysis
				</h2>
				<ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} style={{ color: chartColors.primary }} />
			</div>

			{isExpanded && (
				<div className="mt-6 space-y-6">
					{/* Controls Row */}
					<div className="flex flex-wrap items-center gap-4 mx-4">
						<div className="flex items-center space-x-2">
							<Select value={selectedKPI} onValueChange={setSelectedKPI}>
								<SelectTrigger className="w-80 rounded-full pl-6 pr-6">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="w-80 rounded-3xl pr-10 mr-4">
									{KPIOptions.map((kpi) => (
										<SelectItem key={kpi.key} value={kpi.key} className="rounded-full m-1 mr-4 pr-10">
											{kpi.key}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Only show value type selector for non-biodiversity KPIs */}
						{!['Biodiversity Net Gain', 'Urban Greening Factor'].includes(selectedKPI) && (
							<div className="flex items-center space-x-2">
								<div style={{ backgroundColor: chartColors.accent1 }} className="flex rounded-full p-1 bg-slate-100">
									<button
										className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${valueType === 'average' ? 'bg-white shadow-sm' : 'hover:opacity-80'}`}
										style={{
											color: valueType === 'average' ? chartColors.dark : chartColors.darkGreen,
											backgroundColor: valueType === 'average' ? 'white' : 'transparent',
										}}
										onClick={() => setValueType('average')}
									>
										Average/m²
									</button>
									<button
										className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${valueType === 'total' ? 'bg-white shadow-sm' : 'hover:opacity-80'}`}
										style={{
											color: valueType === 'total' ? chartColors.dark : chartColors.darkGreen,
											backgroundColor: valueType === 'total' ? 'white' : 'transparent',
										}}
										onClick={() => setValueType('total')}
									>
										Total
									</button>
								</div>
							</div>
						)}

						<div className="flex items-center space-x-2">
							<Select value={yearFilter} onValueChange={setYearFilter}>
								<SelectTrigger className="w-36 rounded-full pl-6 pr-6">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All years</SelectItem>
									{getYearOptions().map((year) => (
										<SelectItem key={year} value={`from-${year}`}>
											From {year}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center space-x-2 ml-auto">
							<Button variant="outline" size="sm" onClick={handleDownloadCSV} className="flex items-center gap-2 rounded-full">
								<FileText className="h-4 w-4" />
								CSV
							</Button>
							<Button variant="outline" size="sm" onClick={handleDownloadPNG} className="flex items-center gap-2 rounded-full">
								<Download className="h-4 w-4" />
								PNG
							</Button>
						</div>
					</div>

					{/* Chart Section */}
					<div>
						<h3 className="font-medium mt-12 mb-2 text-center" style={{ color: chartColors.dark }}>
							{currentKPI.key} by Sector ({getDisplayUnit(currentKPI, valueType)})
						</h3>
						<div className="h-[460px] flex justify-center" data-chart="sector-chart">
							<ResponsiveContainer {...getResponsiveContainerProps(true)}>
								<BarChart data={chartData} barGap={-50} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
									<CartesianGrid {...getCartesianGridProps()} />
									<XAxis dataKey="sector" tick={{ fill: chartColors.dark, dy: 20 }} axisLine={false} tickLine={false} interval={0} />
									<YAxis
										label={{
											value: `${currentKPI.key} (${getDisplayUnit(currentKPI, valueType)})`,
											angle: -90,
											position: 'insideLeft',
											offset: -10,
											style: { textAnchor: 'middle', fontSize: 12 },
										}}
										//{...getYAxisProps('Sector', selectedKPI, currentKPI, valueType)}
										tickFormatter={(value) => formatNumber(value)}
										domain={(() => {
											// Get the data range
											const values = chartData.flatMap((d) => [d.value, d.biogenicValue || 0]);
											if (values.length === 0) return [0, 100];

											const dataMin = Math.min(0, ...values);
											const dataMax = Math.max(0, ...values);
											const range = dataMax - dataMin;

											// Calculate nice interval based on range
											let interval;
											if (range <= 75) interval = 15;
											else if (range <= 100) interval = 20;
											else if (range <= 200) interval = 25;
											else if (range <= 500) interval = 50;
											else if (range <= 1000) interval = 100;
											else if (range <= 1500) interval = 200;
											else if (range <= 5000) interval = 500;
											else interval = 1000;

											// Round min down and max up to nearest interval, always including 0
											const adjustedMin = Math.floor(dataMin / interval) * interval;
											const adjustedMax = Math.ceil(dataMax / interval) * interval;

											return [adjustedMin, adjustedMax];
										})()}
										ticks={(() => {
											// Get the data range
											const values = chartData.flatMap((d) => [d.value, d.biogenicValue || 0]);
											if (values.length === 0) return [0];

											const dataMin = Math.min(0, ...values);
											const dataMax = Math.max(0, ...values);
											const range = dataMax - dataMin;

											// Calculate nice interval
											let interval;
											if (range <= 75) interval = 15;
											else if (range <= 100) interval = 20;
											else if (range <= 200) interval = 25;
											else if (range <= 500) interval = 50;
											else if (range <= 1000) interval = 100;
											else if (range <= 1500) interval = 200;
											else if (range <= 5000) interval = 500;
											else interval = 1000;

											// Generate evenly spaced ticks that always include 0
											const adjustedMin = Math.floor(dataMin / interval) * interval;
											const adjustedMax = Math.ceil(dataMax / interval) * interval;

											const ticks = [];
											for (let tick = adjustedMin; tick <= adjustedMax; tick += interval) {
												ticks.push(tick);
											}

											return ticks;
										})()}
									/>
									<Tooltip
										formatter={(value, name, props) => {
											if (selectedKPI === 'Total Embodied Carbon') {
												const data = props.payload;
												const wholeLifeCarbon = formatNumber(Number(data.value));
												const biogenic = formatNumber(Number(data.biogenicValue));
												return [
													`${wholeLifeCarbon} ${getDisplayUnit(currentKPI, valueType)}`,
													valueType === 'total' ? 'Average Whole Life Carbon' : 'Average Whole Life Carbon',
												];
											}
											return [`${formatNumber(Number(value))} ${getDisplayUnit(currentKPI, valueType)}`, valueType === 'total' ? 'Cumulative total' : 'Average'];
										}}
										labelFormatter={(label) => `Sector: ${label}`}
										contentStyle={getTooltipContainerStyle()}
										content={({ active, payload, label }) => {
											if (active && payload && payload.length && selectedKPI === 'Total Embodied Carbon') {
												const data = payload[0].payload;
												return (
													<div
														style={{
															...getTooltipContainerStyle(),
															padding: '8px',
														}}
													>
														<p style={{ margin: 0, fontWeight: 'bold' }}>{`Sector: ${label}`}</p>
														<p style={{ margin: 0, color: chartColors.primary }}>{`Average Whole Life Carbon: ${formatNumber(data.value)} ${getDisplayUnit(
															currentKPI,
															valueType
														)}`}</p>
														<p style={{ margin: 0, color: chartColors.dark }}>{`Average biogenic: ${formatNumber(data.biogenicValue)} ${getDisplayUnit(
															currentKPI,
															valueType
														)}`}</p>
													</div>
												);
											}
											if (active && payload && payload.length) {
												return (
													<div
														style={{
															...getTooltipContainerStyle(),
															padding: '8px',
														}}
													>
														<p style={{ margin: 0, fontWeight: 'bold' }}>{`Sector: ${label}`}</p>
														<p style={{ margin: 0, color: chartColors.primary }}>
															{`${valueType === 'total' ? 'Cumulative total' : 'Average'}: ${formatNumber(Number(payload[0].value))} ${getDisplayUnit(
																currentKPI,
																valueType
															)}`}
														</p>
													</div>
												);
											}
											return null;
										}}
									/>
									<Bar dataKey="value" barSize={50} radius={[6, 6, 0, 0]}>
										{chartData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={sectorConfig[entry.sector as keyof typeof sectorConfig]?.color || chartColors.primary}
												stroke={sectorConfig[entry.sector as keyof typeof sectorConfig]?.color || chartColors.primary}
												strokeWidth={3}
											/>
										))}
									</Bar>
									{/* Show biogenic data as negative bars below zero for Total Embodied Carbon */}
									{selectedKPI === 'Total Embodied Carbon' && (
										<Bar dataKey="biogenicValue" barSize={50} radius={[6, 6, 0, 0]}>
											{chartData.map((entry, index) => (
												<Cell
													key={`biogenic-cell-${index}`}
													fill="white"
													stroke={sectorConfig[entry.sector as keyof typeof sectorConfig]?.color || chartColors.primary}
													strokeWidth={3}
												/>
											))}
										</Bar>
									)}
									<ReferenceLine y={0} stroke="#A8A8A3" strokeWidth={4} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Summary Statistics Table */}
					<div className="mt-12">
						<h3 className="text-lg font-semibold mb-4 mx-4" style={{ color: chartColors.dark }}>
							Summary Statistics
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full border-separate rounded-2xl overflow-hidden" style={{ borderSpacing: 0 }}>
								<thead>
									<tr className="divide-x-4 divide-white" style={{ backgroundColor: chartColors.accent1 }}>
										<>
											<th className="px-4 py-2 text-left">Sector</th>
										</>
										<>
											<th className="px-4 py-2 text-center">Project Count</th>
										</>
										{valueType === 'average' ? (
											<>
												<th className="px-4 py-2 text-center">Average ({getDisplayUnit(currentKPI, valueType)})</th>
												<th className="px-4 py-2 text-center">Min</th>
												<th className="px-4 py-2 text-center">Max</th>
												<th className="px-4 py-2 text-center">Range</th>
											</>
										) : (
											<>
												<th className="px-4 py-2 text-center">Total ({getDisplayUnit(currentKPI, valueType)})</th>
												<th className="px-4 py-2 text-center">Min</th>
												<th className="px-4 py-2 text-center">Max</th>
												<th className="px-4 py-2 text-center">Total Area (m²)</th>
											</>
										)}
									</tr>
								</thead>
								<tbody className="bg-gray-100">
									{allSectors.map((sector) => {
										const stats = sectorStats[sector];
										const avg = stats ? getAverage(stats.totalValue, stats.count) : 0;
										const min = stats && stats.minValue !== Infinity ? Math.round(stats.minValue) : 0;
										const max = stats && stats.maxValue !== -Infinity ? Math.round(stats.maxValue) : 0;
										const range = max - min;
										const count = stats ? stats.count : 0;
										const totalArea = stats ? Math.round(stats.totalGIA) : 0;
										return (
											<tr key={sector} className="divide-y-2 divide-x-4 divide-white">
												<td className="px-4 py-2 text-left font-medium">{sector}</td>
												<td className="px-4 py-2 text-center">{count}</td>
												{valueType === 'average' ? (
													<>
														<td className="px-4 py-2 text-center">{formatNumber(avg)}</td>
														<td className="px-4 py-2 text-center">{formatNumber(min)}</td>
														<td className="px-4 py-2 text-center">{formatNumber(max)}</td>
														<td className="px-4 py-2 text-center">{formatNumber(range)}</td>
													</>
												) : (
													<>
														<td className="px-4 py-2 text-center">{formatNumber(stats ? stats.totalValue : 0)}</td>
														<td className="px-4 py-2 text-center">{formatNumber(min)}</td>
														<td className="px-4 py-2 text-center">{formatNumber(max)}</td>
														<td className="px-4 py-2 text-center">{formatNumber(totalArea)}</td>
													</>
												)}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</Card>
	);
};
