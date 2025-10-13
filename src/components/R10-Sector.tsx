import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SectorKeys, sectorConfig } from '@/components/Key/KeySector';
import { Project } from '@/components/Key/project';
import { KPIOptions } from '@/components/Key/KeyKPI';
import { exportSectorCSV } from '@/components/SectorSub/S01-ExportCSV';
import { exportSectorPNG } from '@/components/SectorSub/S02-ExportPNG';
import { SectorSelector } from '@/components/SectorSub/S10-SectorSelector';
import { SectorChart } from '@/components/SectorSub/S20-SectorChart';
import { SectorTable } from '@/components/SectorSub/S30-SectorTable';
import { chartColors } from './Key/KeyColor';

interface SectorStats {
	count: number;
	totalValue: number;
	totalGIA: number;
	minValue: number;
	maxValue: number;
	values: number[];
}

export type SectorStatsMap = Record<string, SectorStats>;

interface SectorStats {
	count: number;
	totalValue: number;
	totalGIA: number;
	minValue: number;
	maxValue: number;
	values: number[];
}

export interface ChartDataItem {
	sector: string; // sector key like "Residential"
	value: number; // average or total KPI value
	biogenicValue: number; // negative biogenic carbon value
	count: number; // number of projects
}

interface BiogenicStats {
	totalValue: number;
	count: number;
}

export const SectorPerformance = ({ projects }: { projects: Project[] }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [selectedKPI, setSelectedKPI] = useState('Total Embodied Carbon');
	const [valueType, setValueType] = useState<'average' | 'total'>('average');
	const [yearFilter, setYearFilter] = useState('all');
	// Force average for biodiversity metrics
	useEffect(() => {
		if (['Biodiversity Net Gain', 'Urban Greening Factor'].includes(selectedKPI)) {
			setValueType('average'); // runs only when selectedKPI changes
		}
	}, [selectedKPI]);
	const currentKPI = KPIOptions.find((kpi) => kpi.key === selectedKPI);

	// Get available years from projects for selector
	const availableYears = [...new Set(projects.map((p) => new Date(p['PC Date']).getFullYear()))].sort((a, b) => b - a);

	// Filter projects by year if needed
	const filteredProjects =
		yearFilter === 'all'
			? projects
			: projects.filter((project) => {
					const projectYear = new Date(project['PC Date']).getFullYear();
					const filterYear = parseInt(yearFilter.replace('from-', ''));
					return projectYear >= filterYear;
			  });

	const sectorStats = filteredProjects.reduce<SectorStatsMap>((acc, project: Project) => {
		const sector = project['Primary Sector'];
		if (!acc[sector]) {
			acc[sector] = {
				count: 0,
				totalValue: 0,
				totalGIA: 0,
				minValue: Infinity,
				maxValue: -Infinity,
				values: [],
			};
		}
		acc[sector].count++;
		const value = project[selectedKPI] || 0;
		const gia = project['GIA'] || 0;
		if (valueType === 'total' && gia > 0) {
			let totalValue = value * gia;
			// Convert to appropriate units for totals
			if (selectedKPI === 'Upfront Carbon' || selectedKPI === 'Total Embodied Carbon') {
				totalValue = totalValue / 1000; // Convert kg to tonnes
			} else if (selectedKPI === 'Operational Energy Total' || selectedKPI === 'Operational Energy Gas') {
				totalValue = totalValue / 1000; // Convert kWh to MWh
			}
			acc[sector].totalValue += totalValue;
			acc[sector].minValue = Math.min(acc[sector].minValue, totalValue);
			acc[sector].maxValue = Math.max(acc[sector].maxValue, totalValue);
			acc[sector].values.push(totalValue);
		} else {
			acc[sector].totalValue += value;
			acc[sector].minValue = Math.min(acc[sector].minValue, value);
			acc[sector].maxValue = Math.max(acc[sector].maxValue, value);
			acc[sector].values.push(value);
		}
		acc[sector].totalGIA += gia;
		return acc;
	}, {});

	const getAverage = (total: number, count: number) => {
		return count > 0 ? Math.round(total / count) : 0;
	};

	// Create chart data ensuring all sectors are included
	const chartData: ChartDataItem[] = SectorKeys.map((sector) => {
		const stats = sectorStats[sector];
		const baseValue = stats ? getAverage(stats.totalValue, stats.count) : 0;

		// For Total Embodied Carbon, also calculate biogenic data for negative columns
		let biogenicValue = 0;
		if (selectedKPI === 'Total Embodied Carbon' && stats) {
			const biogenicStats = filteredProjects.reduce<BiogenicStats>(
				(acc, project: Project) => {
					if (project['Primary Sector'] === sector) {
						const value = project['Biogenic Carbon'] || 0;
						const gia = project['GIA'] || 0;
						if (valueType === 'total' && gia > 0) {
							let totalValue = value * gia;
							totalValue = totalValue / 1000; // Convert kg to tonnes
							acc.totalValue += totalValue;
						} else {
							acc.totalValue += value;
						}
						acc.count += 1;
					}
					return acc;
				},
				{ totalValue: 0, count: 0 }
			);

			biogenicValue = biogenicStats.count > 0 ? Math.round(biogenicStats.totalValue / biogenicStats.count) : 0;
		}

		return {
			sector: sector,
			value: baseValue,
			biogenicValue: -Math.abs(biogenicValue), // Make it negative for below zero
			count: stats ? stats.count : 0,
		};
	});

	const handleDownloadCSV = () => {
		exportSectorCSV({
			selectedKPI,
			currentKPI,
			valueType,
			yearFilter,
			sectorStats,
			SectorKeys,
		});
	};

	const handleDownloadPNG = () => {
		exportSectorPNG({
			selectedKPI,
			currentKPI,
			valueType,
			yearFilter,
			sectorStats,
			SectorKeys,
		});
	};

	return (
		<Card className="p-0">
			<div className="flex items-center justify-between cursor-pointer p-6" onClick={() => setIsExpanded(!isExpanded)}>
				<h2>Sector Performance Analysis</h2>
				<ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`} style={{ color: chartColors.primary }} />
			</div>

			{isExpanded && (
				<div className="">
					<div className="px-6">
						<SectorSelector
							selectedKPI={selectedKPI}
							setSelectedKPI={setSelectedKPI}
							valueType={valueType}
							setValueType={setValueType}
							yearFilter={yearFilter}
							setYearFilter={setYearFilter}
							availableYears={availableYears}
							onDownloadCSV={handleDownloadCSV}
							onDownloadPNG={handleDownloadPNG}
						/>

						<SectorChart chartData={chartData} currentKPI={currentKPI} selectedKPI={selectedKPI} valueType={valueType} />
					</div>

					<SectorTable sectorStats={sectorStats} currentKPI={currentKPI} valueType={valueType} />
				</div>
			)}
		</Card>
	);
};
