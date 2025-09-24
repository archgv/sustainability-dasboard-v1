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

interface ExportCSVOptions {
	selectedKPI: string;
	currentKPI: { label: string; unit: string; totalUnit: string } | undefined;
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

export const exportSectorCSV = (options: ExportCSVOptions) => {
	const { selectedKPI, currentKPI, effectiveValueType, yearFilter, sectorStats, allSectors } = options;
	
	console.log('Downloading CSV for sector performance analysis');
	
	const csvContent =
		[
			'Sector Performance Analysis',
			`KPI: ${currentKPI?.label} (${getDisplayUnit(currentKPI, effectiveValueType, true)})`,
			`Value Type: ${effectiveValueType}`,
			`Year Filter: ${yearFilter}`,
			'',
			`Sector,Projects,Average (${getDisplayUnit(currentKPI, effectiveValueType, true)}),Min (${getDisplayUnit(currentKPI, effectiveValueType, true)}),Max (${getDisplayUnit(currentKPI, effectiveValueType, true)}),Range (${getDisplayUnit(currentKPI, effectiveValueType, true)})`,
		].join('\n') + '\n';
		
	const csvData = allSectors
		.map((sector) => {
			const stats = sectorStats[sector];
			const avg = stats ? getAverage(stats.totalValue, stats.count) : 0;
			const min = stats && stats.minValue !== Infinity ? Math.round(stats.minValue) : 0;
			const max = stats && stats.maxValue !== -Infinity ? Math.round(stats.maxValue) : 0;
			const range = max - min;
			const count = stats ? stats.count : 0;
			return `${sector},${count},${formatNumber(avg)},${formatNumber(min)},${formatNumber(max)},${formatNumber(range)}`;
		})
		.join('\n');
		
	const fullCsvContent = csvContent + csvData;
	const blob = new Blob([fullCsvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `sector-performance-${selectedKPI}-${effectiveValueType}-${Date.now()}.csv`;
	a.click();
	URL.revokeObjectURL(url);
};