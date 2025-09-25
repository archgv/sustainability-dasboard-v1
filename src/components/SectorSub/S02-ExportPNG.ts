import { formatNumber } from '@/lib/utils';

interface SectorStats {
	count: number;
	totalValue: number;
	totalGIA: number;
	minValue: number;
	maxValue: number;
	values: number[];
}

type SectorStatsMap = Record<string, SectorStats>;

interface ExportPNGOptions {
	selectedKPI: string;
	currentKPI: { value: string; unit: string; totalUnit: string } | undefined;
	effectiveValueType: string;
	yearFilter: string;
	sectorStats: SectorStatsMap;
	allSectors: string[];
}

const getDisplayUnit = (currentKPI: { unit: string; totalUnit: string } | undefined, effectiveValueType: string, forCSV: boolean = false) => {
	if (effectiveValueType === 'total') {
		const unit = currentKPI?.totalUnit || '';
		return forCSV ? unit.replace(/CO₂/g, 'CO2').replace(/²/g, '2') : unit;
	}
	const unit = currentKPI?.unit || '';
	return forCSV ? unit.replace(/CO₂/g, 'CO2').replace(/²/g, '2') : unit;
};

const getAverage = (total: number, count: number) => {
	return count > 0 ? Math.round(total / count) : 0;
};

export const exportSectorPNG = (options: ExportPNGOptions) => {
	const { selectedKPI, currentKPI, effectiveValueType, yearFilter, sectorStats, allSectors } = options;

	console.log('Downloading PNG for sector performance analysis');

	// Create a canvas element with dimensions for full layout
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		console.error('Canvas context not available');
		return;
	}

	// Set canvas dimensions for full layout
	canvas.width = 800;
	canvas.height = 1000;

	// Fill white background
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let yPosition = 30;

	// Load and draw logo
	const logo = new Image();
	logo.crossOrigin = 'anonymous';
	logo.onload = () => {
		// Draw logo at top left
		const logoWidth = 80;
		const logoHeight = (logo.height / logo.width) * logoWidth;
		ctx.drawImage(logo, 20, yPosition, logoWidth, logoHeight);

		// Set font and color for title
		ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
		ctx.fillStyle = '#272727';
		ctx.textAlign = 'center';

		yPosition = Math.max(yPosition + logoHeight + 20, 80);

		// Draw title with Average/Cumulative prefix
		const prefix = effectiveValueType === 'total' ? 'Cumulative' : 'Average';
		const title = `${prefix} ${currentKPI?.value.toLowerCase()} by sector (${getDisplayUnit(currentKPI, effectiveValueType)})`;
		ctx.fillText(title, canvas.width / 2, yPosition);
		yPosition += 60;

		// Draw chart
		const chartContainer = document.querySelector('[data-chart="sector-chart"]');
		if (!chartContainer) {
			console.error('Sector chart container not found');
			return;
		}
		const svgElement = chartContainer.querySelector('svg');
		if (!svgElement) {
			console.error('Sector chart SVG element not found');
			return;
		}

		// Modify SVG to use Arial font for axis labels
		let svgData = new XMLSerializer().serializeToString(svgElement);
		// Replace any font families with Arial
		svgData = svgData.replace(/font-family="[^"]*"/g, 'font-family="Arial, sans-serif"');
		svgData = svgData.replace(/font-family: [^;]*;/g, 'font-family: Arial, sans-serif;');
		// Also ensure text elements use Arial
		svgData = svgData.replace(/<text([^>]*)>/g, '<text$1 font-family="Arial, sans-serif">');

		const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		const svgUrl = URL.createObjectURL(svgBlob);

		const img = new Image();
		img.onload = () => {
			// Draw chart
			const chartHeight = 320;
			const chartWidth = 700;
			const chartX = (canvas.width - chartWidth) / 2;
			ctx.drawImage(img, chartX, yPosition, chartWidth, chartHeight);
			yPosition += chartHeight + 30;

			// Draw date range
			ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
			ctx.textAlign = 'left';
			const dateRangeText = yearFilter === 'all' ? 'Date range: All years' : `Date range: From ${yearFilter.replace('from-', '')}`;
			ctx.fillText(dateRangeText, 50, yPosition);
			yPosition += 40;

			// Draw table title
			ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
			ctx.fillText('Summary Statistics', 50, yPosition);
			yPosition += 30;

			// Draw table
			const tableHeaders =
				effectiveValueType === 'per-sqm'
					? ['Sector', 'No. of projects', `Average (${getDisplayUnit(currentKPI, effectiveValueType)})`, 'Min', 'Max', 'Range']
					: ['Sector', 'No. of projects', `Cumulative total (${getDisplayUnit(currentKPI, effectiveValueType)})`, 'Min', 'Max', `Cumulative total Area (m²)`];

			const colWidths = [120, 100, 140, 80, 80, 120];
			const rowHeight = 25;
			const startX = 50;

			// Draw table headers
			ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
			ctx.fillStyle = '#E9E8D3';
			ctx.fillRect(
				startX,
				yPosition,
				colWidths.reduce((a, b) => a + b, 0),
				rowHeight
			);

			ctx.fillStyle = '#272727';
			ctx.strokeStyle = '#272727';
			ctx.lineWidth = 1;
			ctx.strokeRect(
				startX,
				yPosition,
				colWidths.reduce((a, b) => a + b, 0),
				rowHeight
			);

			let currentX = startX;
			tableHeaders.forEach((header, i) => {
				ctx.strokeRect(currentX, yPosition, colWidths[i], rowHeight);
				ctx.textAlign = i === 0 ? 'left' : 'center';
				const textX = i === 0 ? currentX + 5 : currentX + colWidths[i] / 2;
				ctx.fillText(header, textX, yPosition + 16);
				currentX += colWidths[i];
			});
			yPosition += rowHeight;

			// Draw table rows
			ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
			allSectors.forEach((sector) => {
				const stats = sectorStats[sector];
				const avg = stats ? getAverage(stats.totalValue, stats.count) : 0;
				const min = stats && stats.minValue !== Infinity ? Math.round(stats.minValue) : 0;
				const max = stats && stats.maxValue !== -Infinity ? Math.round(stats.maxValue) : 0;
				const range = max - min;
				const count = stats ? stats.count : 0;
				const totalArea = stats ? Math.round(stats.totalGIA) : 0;

				const rowData =
					effectiveValueType === 'per-sqm'
						? [sector, count.toString(), formatNumber(avg), formatNumber(min), formatNumber(max), formatNumber(range)]
						: [sector, count.toString(), formatNumber(stats ? stats.totalValue : 0), formatNumber(min), formatNumber(max), formatNumber(totalArea)];

				ctx.strokeRect(
					startX,
					yPosition,
					colWidths.reduce((a, b) => a + b, 0),
					rowHeight
				);

				currentX = startX;
				rowData.forEach((data, i) => {
					ctx.strokeRect(currentX, yPosition, colWidths[i], rowHeight);
					ctx.textAlign = i === 0 ? 'left' : 'center';
					const textX = i === 0 ? currentX + 5 : currentX + colWidths[i] / 2;
					ctx.fillText(data, textX, yPosition + 16);
					currentX += colWidths[i];
				});
				yPosition += rowHeight;
			});

			// Convert canvas to PNG and download
			canvas.toBlob((blob) => {
				if (blob) {
					const url = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = `sector-performance-${selectedKPI}-${effectiveValueType}-${Date.now()}.png`;
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
