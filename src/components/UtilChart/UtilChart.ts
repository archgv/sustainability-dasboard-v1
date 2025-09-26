import { Project } from '../Key/project';
import { KPIOptions } from '../Key/KeyKPI';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks, uknzcbsOperationalEnergyBenchmarks } from '@/data/benchmarkData';

export const getChartTitle = (chartType: string, valueType: string, selectedKPI1: string, selectedKPI2: string): string => {
	const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);
	const kpi2Config = KPIOptions.find((kpi) => kpi.key === selectedKPI2);
	const valueTypeLabel = valueType === 'average' ? '/m²' : 'total';

	switch (chartType) {
		case 'Compare Two':
			return `${kpi1Config?.key} vs ${kpi2Config?.key} (${valueTypeLabel})`;
		case 'Single Project':
			return `${kpi1Config?.key} by Project (${valueTypeLabel})`;
		case 'Single Time':
			return `${kpi1Config?.key} Over Time (${valueTypeLabel})`;
		default:
			return 'Chart';
	}
};

export const hasBenchmarks = (projects: Project[]): boolean => {
	if (projects.length === 0) return false;
	return !!totalEmbodiedCarbonBenchmarks[projects[0]['Primary Sector'] as keyof typeof totalEmbodiedCarbonBenchmarks];
};

export const getAvailableSubSectors = (projects: Project[], selectedKPI1: string): string[] => {
	if (projects.length === 0) return [];

	// Check both upfront carbon and operational energy benchmarks
	if (selectedKPI1 === 'Upfront Carbon') {
		const sectorData = uknzcbsBenchmarks[projects[0]['Primary Sector'] as keyof typeof uknzcbsBenchmarks];
		return sectorData ? Object.keys(sectorData) : [];
	} else if (selectedKPI1 === 'Operational Energy Total') {
		const sectorData = uknzcbsOperationalEnergyBenchmarks[projects[0]['Primary Sector'] as keyof typeof uknzcbsOperationalEnergyBenchmarks];
		return sectorData ? Object.keys(sectorData) : [];
	}

	return [];
};

export const getChartToggles = (selectedKPI1: string, valueType: string, chartType: string, availableSubSectors: string[]) => {
	const showSingleTimeSectorToggle =
		(selectedKPI1 === 'Upfront Carbon' || selectedKPI1 === 'Operational Energy Total') && valueType === 'average' && chartType === 'Single Time' && availableSubSectors.length > 1;

	const showSingleSectorToggle = selectedKPI1 === 'Upfront Carbon' && valueType === 'average' && chartType === 'Single Project' && availableSubSectors.length > 0;

	return { showSingleTimeSectorToggle, showSingleSectorToggle };
};
