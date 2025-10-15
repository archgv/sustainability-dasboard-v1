// Common chart configuration for ResponsiveContainer and chart components

import { chartColors } from '../Key/KeyColor';
import { KPIOption } from '../Key/KeyKPI';

// Common ResponsiveContainer props
export const getResponsiveContainerProps = () => ({
	width: '100%',
	height: '100%' as const,
});

// Common Chart props
export const getChartProps = () => ({
	margin: { top: 50, bottom: 50, left: 50, right: 50 },
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

// export const getUnitLabel = (currentKPI: KPIOption, valueType: string, forCSV: boolean = false): string => {
// 	const baseUnit = currentKPI?.unit;

// 	const unit = forCSV ? baseUnit.replace(/CO2/g, 'CO2').replace(/₂/g, '2') : baseUnit.replace(/CO2/g, 'CO₂');

// 	if (valueType === 'total') {
// 		return unit.replace('/m²', '').replace('/year', '/year total');
// 	}
// 	return unit;
// };

export const findUnit = (currentKPI: KPIOption, valueType: string, forCSV: boolean = false) => {
	const unit = valueType === 'total' ? currentKPI.unit : currentKPI.totalUnit;
	return forCSV ? unit.replace(/CO₂/g, 'CO2').replace(/²/g, '2') : unit;
};

export const findUnitBracket = (currentKPI: KPIOption, valueType: string, forCSV: boolean = false) => {
	if (currentKPI.key === 'Urban Greening Factor') return findUnit(currentKPI, valueType, forCSV);
	return `(${findUnit(currentKPI, valueType, forCSV)})`;
};

// Common XAxis props for bar charts
export const getXAxisProps = (chart: string, selectedKPI: string, currentKPI: KPIOption, valueType: string) => {
	let value = 'Year';
	if (chart === 'Compare Two') {
		value = `${currentKPI.key || selectedKPI} ${findUnitBracket(currentKPI, valueType)}`;
	}
	let label = { value: value, position: 'insideBottom', offset: -20, style: { textAnchor: 'middle', fontSize: 12 } };
	if (chart === 'Single Project') {
		label = null;
	}

	return {
		tickLine: false,
		axisLine: { strokeWidth: 4, stroke: chartColors.pink },
		label: label,
	};
};

// Common YAxis props for bar charts
export const getYAxisProps = (chart: string, selectedKPI: string, currentKPI: KPIOption, valueType: string) => {
	const value = `${currentKPI.key || selectedKPI} ${findUnitBracket(currentKPI, valueType)}`;
	// if (chart === 'Single Time') {
	//    value = `${currentKPI?.value} (${getDisplayUnit()})`;
	// }
	return {
		tick: { fill: chartColors.dark, fontSize: 12 },
		tickLine: false,
		axisLine: { strokeWidth: 4, stroke: chartColors.pink },
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
