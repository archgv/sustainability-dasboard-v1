// Common chart configuration for ResponsiveContainer and chart components
import { Value } from '@radix-ui/react-select';
import { ValueType } from '../R31-ChartOption';
import { chartColors } from '../Utils/UtilColor';
import { KPIOption } from '../Utils/project';

// Common ResponsiveContainer props
export const getResponsiveContainerProps = (isBarChart = false) => ({
	width: isBarChart ? '90%' : '100%',
	height: '100%' as const,
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
	strokeDasharray: '3 3' as const,
	stroke: chartColors.accent1,
	horizontal: true,
	verticalPoints: [] as never[],
});

export const MultiLineTickComponent = (props) => {
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

	return lines;
};

export const getUnitLabel = (currentKPI: KPIOption, valueType: ValueType, forCSV: boolean = false): string => {
	const baseUnit = currentKPI?.unit;
	// For CSV exports, use plain text to avoid encoding issues
	const unit = forCSV ? baseUnit.replace(/CO2/g, 'CO2').replace(/₂/g, '2') : baseUnit.replace(/CO2/g, 'CO₂');

	if (valueType === 'total') {
		return unit.replace('/m²', '').replace('/year', '/year total');
	}
	return unit;
};

export const getDisplayUnit = (currentKPI: KPIOption, valueType: string, forCSV: boolean = false) => {
	if (valueType === 'total') {
		const unit = currentKPI?.totalUnit || '';
		return forCSV ? unit.replace(/CO₂/g, 'CO2').replace(/²/g, '2') : unit;
	}
	const unit = currentKPI?.unit || '';
	return forCSV ? unit.replace(/CO₂/g, 'CO2').replace(/²/g, '2') : unit;
};

// Common XAxis props for bar charts
export const getXAxisProps = (chart: string, selectedKPI: string, currentKPI: KPIOption, valueType: ValueType) => {
	let value = 'Year';
	if (chart === 'Single Time') {
		value = `${currentKPI?.label || selectedKPI} (${getUnitLabel(currentKPI, valueType)})`;
	}
	let label = { value: value, position: 'insideBottom', offset: -20, style: { textAnchor: 'middle', fontSize: 12 } };
	if (chart === 'Single Project') {
		label = null;
	}

	return {
		tickLine: false,
		axisLine: { strokeWidth: 0 },
		label: label,
	};
};

// Common YAxis props for bar charts
export const getYAxisProps = (chart: string, selectedKPI: string, currentKPI: KPIOption, valueType: ValueType) => {
	const value = `${currentKPI?.label || selectedKPI} (${getUnitLabel(currentKPI, valueType)})`;
	// if (chart === 'Single Time') {
	//    value = `${currentKPI?.value} (${getDisplayUnit()})`;
	// }
	return {
		tick: { fill: chartColors.dark, fontSize: 12 },
		tickLine: false,
		axisLine: { strokeWidth: 0 },
		label: {
			value: value,
			angle: -90,
			position: 'insideLeft',
			offset: -10,
			style: { textAnchor: 'middle', fontSize: 12 },
		},
	};
};

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
