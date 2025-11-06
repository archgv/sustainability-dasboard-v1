import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { formatNumber } from '@/lib/utils';
import { sectorConfig, SectorKeys } from '@/components/Key/KeySector';
import { chartColors } from '../Key/KeyColor';
import { getResponsiveContainerProps, getCartesianGridProps, getTooltipContainerStyle, getUnit, getChartProps, getUnitBracket } from '../Util/ChartConfig';
import { KPIOption } from '../Key/KeyKPI';
import { Project } from '../Key/project';
import { getProjectCurrrentStage } from '../Util/UtilProject';

interface SectorChartProps {
	filteredProjects: Project[];
	sectorStats: Record<string, { totalValue: number; count: number }>;
	currentKPI: KPIOption;
	selectedKPI: string;
	valueType: 'average' | 'total';
}

export interface ChartDataItem {
	sector: string; // sector key like "Residential"
	value: number; // average or total KPI value
	biogenicValue: number; // negative biogenic carbon value
	count: number; // number of projects
}

interface BiogenicStats {
	totalValue: number;
	count: number;
}

export const SectorChart = ({ filteredProjects, sectorStats, currentKPI, selectedKPI, valueType }: SectorChartProps) => {
	const getAverage = (total: number, count: number) => {
		return count > 0 ? Math.round(total / count) : 0;
	};

	// Create chart data ensuring all sectors are included
	const chartData: ChartDataItem[] = SectorKeys.map((sector) => {
		const stats = sectorStats[sector];
		const baseValue = stats ? getAverage(stats.totalValue, stats.count) : 0;

		// For Embodied Carbon, also calculate biogenic data for negative columns
		let biogenicValue = 0;
		if (selectedKPI === 'Embodied Carbon' && stats) {
			const biogenicStats = filteredProjects.reduce<BiogenicStats>(
				(acc, project: Project) => {
					if (project['Primary Sector'] === sector) {
						const value = getProjectCurrrentStage(project)['Biogenic Carbon'] || 0;
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
			biogenicValue: biogenicValue,
			count: stats ? stats.count : 0,
		};
	});

	return (
		<Card className="shadow-inner mb-8">
			<h3 className="font-medium mt-8 mb-2 text-center" style={{ color: chartColors.dark }}>
				{currentKPI.label} by sector {getUnitBracket(currentKPI, valueType)}
			</h3>
			<div className="h-[460px] flex justify-center" data-chart="sector-chart">
				<ResponsiveContainer {...getResponsiveContainerProps()}>
					<BarChart data={chartData} barGap={-50} {...getChartProps()}>
						<CartesianGrid vertical={false} {...getCartesianGridProps()} />
						<XAxis dataKey="sector" tick={{ fill: chartColors.dark, dy: 20 }} axisLine={false} tickLine={false} interval={0} />
						<YAxis
							label={{
								value: `${currentKPI.key} ${getUnitBracket(currentKPI, valueType)}`,
								angle: -90,
								position: 'insideLeft',
								offset: -10,
								style: { textAnchor: 'middle', fontSize: 12 },
							}}
							tick={{ fill: chartColors.pink, fontSize: 12 }}
							tickLine={false}
							axisLine={{ stroke: chartColors.pink, strokeWidth: 4 }}
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
								if (selectedKPI === 'Embodied Carbon') {
									const data = props.payload;
									const wholeLifeCarbon = formatNumber(Number(data.value));
									return [`${wholeLifeCarbon} ${getUnit(currentKPI, valueType)}`, valueType === 'total' ? 'Average Whole Life Carbon' : 'Average Whole Life Carbon'];
								}
								return [`${formatNumber(Number(value))} ${getUnit(currentKPI, valueType)}`, valueType === 'total' ? 'Cumulative total' : 'Average'];
							}}
							labelFormatter={(label) => `Sector: ${label}`}
							contentStyle={getTooltipContainerStyle()}
							content={({ active, payload, label }) => {
								if (active && payload && payload.length && selectedKPI === 'Embodied Carbon') {
									const data = payload[0].payload;
									return (
										<div
											style={{
												...getTooltipContainerStyle(),
												padding: '8px',
											}}
										>
											<p style={{ margin: 0, fontWeight: 'bold' }}>{`Sector: ${label}`}</p>
											<p style={{ margin: 0, color: chartColors.primary }}>{`Average Whole Life Carbon: ${formatNumber(data.value)} ${getUnit(currentKPI, valueType)}`}</p>
											<p style={{ margin: 0, color: chartColors.dark }}>{`Average Biogenic: ${formatNumber(data.biogenicValue)} ${getUnit(currentKPI, valueType)}`}</p>
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
												{`${valueType === 'total' ? 'Cumulative total' : 'Average'}: ${formatNumber(Number(payload[0].value))} ${getUnit(currentKPI, valueType)}`}
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
						{/* Show biogenic data as negative bars below zero for Embodied Carbon */}
						{selectedKPI === 'Embodied Carbon' && (
							<Bar dataKey="biogenicValue" barSize={50} radius={[6, 6, 0, 0]}>
								{chartData.map((entry, index) => (
									<Cell key={`biogenic-cell-${index}`} fill="white" stroke={sectorConfig[entry.sector as keyof typeof sectorConfig]?.color || chartColors.primary} strokeWidth={3} />
								))}
							</Bar>
						)}
						<ReferenceLine y={0} stroke={chartColors.pink} strokeWidth={4} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
};
