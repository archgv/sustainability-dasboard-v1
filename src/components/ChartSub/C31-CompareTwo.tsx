import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project, availableKPIs } from '@/types/project';
import { ValueType } from '../R31-ChartOption';
import { getSectorColor, getSectorShape } from '@/components/Utils/UtilSector';
import { formatNumber } from '@/lib/utils';
import { ChartShape } from '../R33-ChartShape';
import { chartColors } from './C01-UtilColor';

interface BubbleChartProps {
	projects: Project[];
	selectedKPI1: string;
	selectedKPI2: string;
	valueType: ValueType;
	isComparingToSelf?: boolean;
	chartColors: typeof chartColors;
	generateNiceTicks: (maxValue: number, tickCount?: number) => number[];
	getUnitLabel: (baseUnit: string, valueType: ValueType, forCSV?: boolean) => string;
	getProjectArea: (projectId: string) => number;
	transformDataForValueType: (data: Project[]) => Project[];
}

export const BubbleChart = ({
	projects,
	selectedKPI1,
	selectedKPI2,
	valueType,
	isComparingToSelf = false,
	chartColors,
	generateNiceTicks,
	getUnitLabel,
	getProjectArea,
	transformDataForValueType,
}: BubbleChartProps) => {
	const kpi1Config = availableKPIs.find((kpi) => kpi.key === selectedKPI1);
	const kpi2Config = availableKPIs.find((kpi) => kpi.key === selectedKPI2);

	const transformedProjects = transformDataForValueType(projects);
	const sortedProjects = transformedProjects;

	// Transform biogenic carbon values to negative for bubble chart display - use sorted projects
	const bubbleChartData = sortedProjects.map((project) => ({
		...project,
		[selectedKPI1]: selectedKPI1 === 'biogenicCarbon' ? -Math.abs(project[selectedKPI1] || 0) : project[selectedKPI1],
		[selectedKPI2]: selectedKPI2 === 'biogenicCarbon' ? -Math.abs(project[selectedKPI2] || 0) : project[selectedKPI2],
	}));

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
};
