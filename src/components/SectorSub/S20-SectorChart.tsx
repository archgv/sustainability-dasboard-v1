import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { formatNumber } from '@/lib/utils';
import { sectorConfig } from '@/components/Key/KeySector';
import { chartColors } from '../Key/KeyColor';
import { getResponsiveContainerProps, getCartesianGridProps, getTooltipContainerStyle, findUnit, getChartProps } from '../UtilChart/ChartConfig';

interface SectorChartProps {
	chartData: any[];
	currentKPI: any;
	selectedKPI: string;
	valueType: 'average' | 'total';
}

export const SectorChart = ({ chartData, currentKPI, selectedKPI, valueType }: SectorChartProps) => {
	return (
		<Card className="shadow-inner mb-8">
			<h3 className="font-medium mt-8 mb-2 text-center" style={{ color: chartColors.dark }}>
				{currentKPI.label} by sector {findUnit(currentKPI, valueType)}
			</h3>
			<div className="h-[460px] flex justify-center" data-chart="sector-chart">
				<ResponsiveContainer {...getResponsiveContainerProps()}>
					<BarChart data={chartData} barGap={-50} {...getChartProps()}>
						<CartesianGrid vertical={false} {...getCartesianGridProps()} />
						<XAxis dataKey="sector" tick={{ fill: chartColors.dark, dy: 20 }} axisLine={false} tickLine={false} interval={0} />
						<YAxis
							label={{
								value: `${currentKPI.key} ${findUnit(currentKPI, valueType)}`,
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
								if (selectedKPI === 'Total Embodied Carbon') {
									const data = props.payload;
									const wholeLifeCarbon = formatNumber(Number(data.value));
									return [`${wholeLifeCarbon} ${findUnit(currentKPI, valueType)}`, valueType === 'total' ? 'Average Whole Life Carbon' : 'Average Whole Life Carbon'];
								}
								return [`${formatNumber(Number(value))} ${findUnit(currentKPI, valueType)}`, valueType === 'total' ? 'Cumulative total' : 'Average'];
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
											<p style={{ margin: 0, color: chartColors.primary }}>{`Average Whole Life Carbon: ${formatNumber(data.value)} ${findUnit(
												currentKPI,
												valueType
											)}`}</p>
											<p style={{ margin: 0, color: chartColors.dark }}>{`Average biogenic: ${formatNumber(data.biogenicValue)} ${findUnit(
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
												{`${valueType === 'total' ? 'Cumulative total' : 'Average'}: ${formatNumber(Number(payload[0].value))} ${findUnit(
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
						<ReferenceLine y={0} stroke={chartColors.pink} strokeWidth={4} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
};