import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project, KPIOptions } from '@/components/Utils/project';
import { ValueType } from '../R32-Chart';
import { getSectorColor, getSectorShape } from '@/components/Utils/UtilSector';
import { formatNumber } from '@/lib/utils';
import { ChartShape } from '../R33-ChartShape';
import { chartColors } from '../Utils/UtilColor';
import { getResponsiveContainerProps, getScatterChartProps, getCartesianGridProps, getYAxisProps, getXAxisProps, getBarProps, getTooltipContainerStyle, getUnitLabel } from './C00-ChartConfig';

interface BubbleChartProps {
	projects: Project[];
	selectedKPI1: string;
	selectedKPI2: string;
	valueType: ValueType;
	isComparingToSelf?: boolean;
	chartColors: typeof chartColors;
	generateNiceTicks: (maxValue: number, tickCount?: number) => number[];
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
	getProjectArea,
	transformDataForValueType,
}: BubbleChartProps) => {
	const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);
	const kpi2Config = KPIOptions.find((kpi) => kpi.key === selectedKPI2);

	const transformedProjects = transformDataForValueType(projects);
	const sortedProjects = transformedProjects;

	// Transform biogenic carbon values to negative for bubble chart display - use sorted projects
	const bubbleChartData = sortedProjects.map((project) => ({
		...project,
		[selectedKPI1]: selectedKPI1 === 'Biogenic Carbonn' ? -Math.abs(project[selectedKPI1] || 0) : project[selectedKPI1],
		[selectedKPI2]: selectedKPI2 === 'Biogenic Carbon' ? -Math.abs(project[selectedKPI2] || 0) : project[selectedKPI2],
	}));

	return (
		<ResponsiveContainer {...getResponsiveContainerProps()}>
			<ScatterChart {...getScatterChartProps()}>
				<CartesianGrid {...getCartesianGridProps()} />
				<XAxis
					{...getXAxisProps('Compare Two', selectedKPI1, kpi1Config, valueType)}
					type="number"
					dataKey={selectedKPI1}
					name={kpi1Config?.label || selectedKPI1}
					tick={{ fill: chartColors.dark, fontSize: 12 }}
					tickFormatter={(value) => formatNumber(value)}
					ticks={(() => {
						const maxValue = Math.max(...bubbleChartData.map((p) => Math.abs(p[selectedKPI1] || 0)));
						return generateNiceTicks(maxValue * 1.1);
					})()}
				/>
				<YAxis
					{...getYAxisProps('Compare Two', selectedKPI2, kpi2Config, valueType)}
					type="number"
					dataKey={selectedKPI2}
					name={kpi2Config?.label || selectedKPI2}
					tickFormatter={(value) => formatNumber(value)}
					ticks={(() => {
						const maxValue = Math.max(...bubbleChartData.map((p) => Math.abs(p[selectedKPI2] || 0)));
						return generateNiceTicks(maxValue * 1.1);
					})()}
				/>
				<Tooltip
					cursor={{ strokeDasharray: '3 3' }}
					contentStyle={getTooltipContainerStyle()}
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
										{kpi1Config?.label}: {formatNumber(data[selectedKPI1])} {getUnitLabel(kpi1Config, valueType)}
									</p>
									<p className="text-sm" style={{ color: chartColors.dark }}>
										{kpi2Config?.label}: {formatNumber(data[selectedKPI2])} {getUnitLabel(kpi2Config, valueType)}
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
