import { Project, availableKPIs } from '@/types/project';
import { ChartType, EmbodiedCarbonBreakdown, ValueType } from '@/components/R31-ChartOption';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks } from '@/data/benchmarkData';
import { getSectorBenchmarkColor } from '@/utils/projectUtils';

interface ExportPNGOptions {
	projects: Project[];
	chartType: ChartType;
	selectedKPI1: string;
	selectedKPI2: string;
	embodiedCarbonBreakdown: EmbodiedCarbonBreakdown;
	valueType: ValueType;
	showBenchmarks: boolean;
	selectedBarChartBenchmark: string;
}

const getUnitLabel = (baseUnit: string, valueType: ValueType, forCSV: boolean = false): string => {
	// For CSV exports, use plain text to avoid encoding issues
	const unit = forCSV ? baseUnit.replace(/CO2/g, 'CO2').replace(/₂/g, '2') : baseUnit.replace(/CO2/g, 'CO₂');

	if (valueType === 'total') {
		return unit.replace('/m²', '').replace('/year', '/year total');
	}
	return unit;
};

const getChartTitle = (
	chartType: ChartType,
	selectedKPI1: string,
	selectedKPI2: string,
	embodiedCarbonBreakdown: EmbodiedCarbonBreakdown,
	valueType: ValueType
) => {
	const valueTypeLabel = valueType === 'per-sqm' ? 'per sqm' : 'total';
	const kpi1Config = availableKPIs.find((kpi) => kpi.key === selectedKPI1);
	const kpi2Config = availableKPIs.find((kpi) => kpi.key === selectedKPI2);

	if (chartType === 'single-bar' && selectedKPI1 === 'Total Embodied Carbon' && embodiedCarbonBreakdown !== 'none') {
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

export const exportChartToPNG = (options: ExportPNGOptions) => {
	const { projects, chartType, selectedKPI1, selectedKPI2, embodiedCarbonBreakdown, valueType, showBenchmarks, selectedBarChartBenchmark } = options;

	// Find the chart SVG element - use specific selector to avoid conflicts
	const chartContainer = document.querySelector('[data-chart="chart-container"]');
	if (!chartContainer) {
		console.error('Chart container not found');
		return;
	}

	const svgElement = chartContainer.querySelector('svg');
	if (!svgElement) {
		console.error('SVG element not found');
		return;
	}

	// Create a canvas element with extra space for logo and title
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		console.error('Canvas context not available');
		return;
	}

	// Set canvas dimensions with extra height for logo, title, and bottom margin
	const svgRect = svgElement.getBoundingClientRect();
	canvas.width = svgRect.width * 2; // Higher resolution
	canvas.height = (svgRect.height + 180) * 2; // Extra space for logo, title, and bottom margin
	ctx.scale(2, 2);

	let yPosition = 30;

	// Load and draw logo
	const logo = new Image();
	logo.crossOrigin = 'anonymous';
	logo.onload = () => {
		// Fill white background
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

		// Draw logo at top left
		const logoWidth = 80;
		const logoHeight = (logo.height / logo.width) * logoWidth;
		ctx.drawImage(logo, 20, yPosition, logoWidth, logoHeight);

		// Set font and color for title (Arial font family)
		ctx.font = 'bold 18px Arial, sans-serif';
		ctx.fillStyle = '#272727';
		ctx.textAlign = 'center';

		yPosition = Math.max(yPosition + logoHeight + 20, 80);

		// Get chart title and value type information
		const chartTitle = getChartTitle(chartType, selectedKPI1, selectedKPI2, embodiedCarbonBreakdown, valueType);
		const valueTypeText = valueType === 'per-sqm' ? '(per sqm GIA)' : '(Total values)';

		// Draw title
		ctx.fillText(chartTitle, canvas.width / 4, yPosition);

		// Draw value type subtitle
		ctx.font = '14px Arial, sans-serif';
		ctx.fillText(valueTypeText, canvas.width / 4, yPosition + 25);

		yPosition += 50;

		// Get benchmark data for PNG export
		const getBenchmarkDataForPNG = () => {
			// Get UKNZCBS benchmark data for upfront carbon
			if (selectedKPI1 === 'Upfront Carbon' && selectedBarChartBenchmark && valueType === 'per-sqm' && projects.length > 0) {
				const benchmarkColor = getSectorBenchmarkColor(projects[0]['Primary Sector']);

				// Get the PC date from the primary project to determine benchmark year
				let benchmarkYear = parseInt(projects[0]['PC Date']) || 2025;
				if (benchmarkYear < 2025) benchmarkYear = 2025;

				// Get benchmark values for this sector and sub-sector
				const sectorData = uknzcbsBenchmarks[projects[0]['Primary Sector'] as keyof typeof uknzcbsBenchmarks];
				if (!sectorData) return { lines: [], title: '' };

				const subSectorData = sectorData[selectedBarChartBenchmark as keyof typeof sectorData];
				if (!subSectorData) return { lines: [], title: '' };

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

				return {
					lines: benchmarkLines,
					title: `UKNZCBS: ${selectedBarChartBenchmark}`,
				};
			}

			// Get benchmark data for total embodied carbon
			if (showBenchmarks && selectedKPI1 === 'Total Embodied Carbon' && valueType === 'per-sqm' && projects.length > 0) {
				const benchmarkColor = getSectorBenchmarkColor(projects[0]['Primary Sector']);

				// Get benchmark values for this sector
				const sectorBenchmarks = totalEmbodiedCarbonBenchmarks[projects[0]['Primary Sector'] as keyof typeof totalEmbodiedCarbonBenchmarks];

				if (!sectorBenchmarks) return { lines: [], title: '' };

				const benchmarkLines = Object.entries(sectorBenchmarks).map(([name, value]) => ({
					name,
					value,
					color: benchmarkColor,
				}));

				return {
					lines: benchmarkLines,
					title: `Benchmarks: ${projects[0]['Primary Sector']}`,
				};
			}

			return { lines: [], title: '' };
		};

		// Add benchmark information if available
		const benchmarkData = getBenchmarkDataForPNG();
		if (benchmarkData.lines.length > 0) {
			// Draw benchmark title
			ctx.font = 'bold 14px Arial, sans-serif';
			ctx.fillStyle = '#666666';
			ctx.textAlign = 'left';

			ctx.fillText(benchmarkData.title, 20, yPosition);
			yPosition += 30;

			// Draw benchmark legend
			ctx.font = '12px Arial, sans-serif';
			let xPos = 20;

			benchmarkData.lines.forEach((benchmark, index) => {
				// Draw line indicator
				ctx.strokeStyle = benchmark.color;
				ctx.lineWidth = 2;
				ctx.setLineDash(benchmark.name.includes('New building') ? [5, 5] : [10, 5]);
				ctx.beginPath();
				ctx.moveTo(xPos, yPosition - 5);
				ctx.lineTo(xPos + 24, yPosition - 5);
				ctx.stroke();
				ctx.setLineDash([]); // Reset dash pattern

				// Draw text
				ctx.fillStyle = '#272727';
				ctx.fillText(benchmark.name, xPos + 30, yPosition);

				xPos += 200; // Space for next legend item
				if (xPos > canvas.width / 2 - 200) {
					xPos = 20;
					yPosition += 20;
				}
			});

			yPosition += 30;
		}

		ctx.fillStyle = '#272727'; // Reset color
		ctx.textAlign = 'center'; // Reset alignment

		// Convert SVG to data URL
		const svgData = new XMLSerializer().serializeToString(svgElement);
		const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		const svgUrl = URL.createObjectURL(svgBlob);

		// Create image and draw to canvas
		const img = new Image();
		img.onload = () => {
			// Draw the SVG image below the title
			ctx.drawImage(img, 0, yPosition, svgRect.width, svgRect.height);

			// Convert canvas to PNG and download
			canvas.toBlob((blob) => {
				if (blob) {
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = `chart-${selectedKPI1}-${valueType}-${Date.now()}.png`;
					a.click();
					URL.revokeObjectURL(url);
				}
			}, 'image/png');

			URL.revokeObjectURL(svgUrl);
		};

		img.src = svgUrl;
	};

	logo.src = '/lovable-uploads/4ce0bfd4-e09c-45a3-bb7c-0a84df6eca91.png';
};