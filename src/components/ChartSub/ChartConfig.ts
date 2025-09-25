// Common chart configuration for ResponsiveContainer and chart components
import { chartColors } from '../Utils/UtilColor';

// Common ResponsiveContainer props
export const getResponsiveContainerProps = (isBarChart = false) => ({
  width: isBarChart ? "90%" : "100%",
  height: "100%" as const,
});

// Common BarChart props
export const getBarChartProps = () => ({
  barGap: -100,
  margin: { top: 50, right: 30, left: 20, bottom: 80 },
});

// Common ScatterChart props
export const getScatterChartProps = () => ({
  margin: { top: 80, right: 20, bottom: 20, left: 80 },
});

// Common LineChart props
export const getLineChartProps = () => ({
  margin: { top: 40, right: 30, left: 60, bottom: 80 },
});

// Common CartesianGrid props
export const getCartesianGridProps = () => ({
  strokeDasharray: "3 3" as const,
  stroke: chartColors.accent1,
  horizontal: true,
  verticalPoints: [] as never[],
});

// Common YAxis props for bar charts
export const getYAxisProps = () => ({
  tick: { fill: chartColors.dark, fontSize: 12 },
  tickLine: false,
  axisLine: { strokeWidth: 0 },
});

// Common XAxis props for bar charts
export const getXAxisProps = () => ({
  axisLine: { stroke: chartColors.dark, strokeWidth: 1 },
  tickLine: false,
});

// Common Bar props
export const getBarProps = () => ({
  barSize: 100,
  radius: [6, 6, 0, 0] as [number, number, number, number],
});

// Common Tooltip container style
export const getTooltipContainerStyle = () => ({
  backgroundColor: 'white',
  border: `1px solid ${chartColors.primary}`,
  borderRadius: '8px',
});