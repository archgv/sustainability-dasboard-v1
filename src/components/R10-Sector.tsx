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
import { getProjectCurrrentStage } from './Util/UtilProject';

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

export const SectorPerformance = ({ projects }: { projects: Project[] }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [selectedKPI, setSelectedKPI] = useState('Embodied Carbon');
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
					const filterYear = parseInt(yearFilter);
					return projectYear == filterYear;
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
		const value = getProjectCurrrentStage(project)[selectedKPI] || 0;
		const gia = project['GIA'] || 0;
		if (valueType === 'total' && gia > 0) {
			let totalValue = value * gia;
			// Convert to appropriate units for totals
			if (selectedKPI === 'Upfront Carbon' || selectedKPI === 'Embodied Carbon') {
				totalValue = totalValue / 1000; // Convert kg to tonnes
			} else if (selectedKPI === 'Operational Energy' || selectedKPI === 'Operational Energy Gas') {
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

						<SectorChart filteredProjects={filteredProjects} sectorStats={sectorStats} currentKPI={currentKPI} selectedKPI={selectedKPI} valueType={valueType} />
					</div>

					<SectorTable sectorStats={sectorStats} currentKPI={currentKPI} valueType={valueType} />
				</div>
			)}
		</Card>
	);
};
