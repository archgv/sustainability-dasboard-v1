import { Project } from '../Key/project';
import { KPIOptions } from '../Key/KeyKPI';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks } from '@/data/benchmarkData';

interface ExportCSVOptions {
	projects: Project[];
	chartType: string;
	selectedKPI1: string;
	selectedKPI2: string;
	valueType: string;
	isComparingToSelf?: boolean;
	selectedRibaStages?: string[];
	showBenchmarks: boolean;
	selectedBarChartBenchmark: string;
}

interface ChartCategory {
	key: string;
	label: string;
	color: string;
}

// Mock building area data for demonstration
const getProjectArea = (projectId: string): number => {
	const areas: Record<string, number> = {
		'1': 15000, // Green Office Tower
		'2': 8500, // Sustainable Housing Complex
		'3': 22000, // Innovation Campus
		'4': 12000, // Community Health Center
		'5': 18000, // Urban Retail Hub
	};
	return areas[projectId] || 10000;
};

const getUnitLabel = (baseUnit: string, valueType: string, forCSV: boolean = false): string => {
	// For CSV exports, use plain text to avoid encoding issues
	const unit = forCSV ? baseUnit.replace(/CO2/g, 'CO2').replace(/₂/g, '2') : baseUnit.replace(/CO2/g, 'CO₂');

	if (valueType === 'total') {
		return unit.replace('/m²', '').replace('/year', '/year total');
	}
	return unit;
};

const getChartTitle = (chartType: string, selectedKPI1: string, selectedKPI2: string, valueType: string) => {
	const valueTypeLabel = valueType === 'average' ? 'per sqm' : 'total';
	const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);
	const kpi2Config = KPIOptions.find((kpi) => kpi.key === selectedKPI2);

	switch (chartType) {
		case 'Compare Two':
			return `${kpi1Config?.key} vs ${kpi2Config?.key} (${valueTypeLabel}) - Bubble Chart`;
		case 'Single Project':
			return `${kpi1Config?.key} by Project (${valueTypeLabel}) - Bar Chart`;
		case 'Single Time':
			return `${kpi1Config?.key} Over Time (${valueTypeLabel}) - Timeline`;
		default:
			return 'Chart';
	}
};

const transformDataForValueType = (data: Project[], valueType: string, selectedKPI1: string, selectedKPI2: string): Project[] => {
	if (valueType === 'average') {
		return data; // Data is already per sqm in our KPIs
	}

	// For total values, multiply by building area
	return data.map((item) => ({
		...item,
		[selectedKPI1]: (item[selectedKPI1 as keyof Project] as number) * getProjectArea(item.id.split('-')[0]), // Handle RIBA stage variants
		[selectedKPI2]: selectedKPI2 ? (item[selectedKPI2 as keyof Project] as number) * getProjectArea(item.id.split('-')[0]) : undefined,
	}));
};

export const exportChartToCSV = (options: ExportCSVOptions) => {
	const { projects, chartType, selectedKPI1, selectedKPI2, valueType, isComparingToSelf = false, selectedRibaStages = [], showBenchmarks, selectedBarChartBenchmark } = options;

	const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);
	const kpi2Config = KPIOptions.find((kpi) => kpi.key === selectedKPI2);

	const chartTitle = getChartTitle(chartType, selectedKPI1, selectedKPI2, valueType);
	let csvContent = `${chartTitle}\n\n`;

	const transformedProjects = transformDataForValueType(projects, valueType, selectedKPI1, selectedKPI2);

	// CSV headers
	const headers = ['Project Name', `${kpi1Config?.key || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType, true)})`];

	// For Total Embodied Carbon charts, include biogenic carbon column
	if (chartType === 'Single Project' && selectedKPI1 === 'Total Embodied Carbon') {
		headers.push(`Biogenic (${getUnitLabel(kpi1Config?.unit || '', valueType, true)})`);
	}

	if (chartType === 'Compare Two') {
		headers.push(`${kpi2Config?.key || selectedKPI2} (${getUnitLabel(kpi2Config?.unit || '', valueType, true)})`);
		headers.push('Building Area (m²)');
	}
	if (chartType === 'Single Time') {
		headers.push('Completion Year');
	}
	csvContent += headers.join(',') + '\n';

	// CSV data rows
	transformedProjects.forEach((project) => {
		const baseId = project.id.split('-')[0];
		const displayName = isComparingToSelf && project['Current RIBA Stage'] ? `${project['Project Name']} (RIBA ${project['Current RIBA Stage']})` : project['Project Name'];

		const row = [`"${displayName}"`, (project[selectedKPI1 as keyof Project] as number)?.toString() || '0'];

		// For Total Embodied Carbon charts, add biogenic carbon as negative value
		if (chartType === 'Single Project' && selectedKPI1 === 'Total Embodied Carbon') {
			const biogenicValue = project['Biogenic Carbon'] || 0;
			const finalBiogenicValue = valueType === 'total' ? -Math.abs(biogenicValue * getProjectArea(baseId)) : -Math.abs(biogenicValue);
			row.push(finalBiogenicValue.toString());
		}

		if (chartType === 'Compare Two') {
			row.push((project[selectedKPI2 as keyof Project] as number)?.toString() || '0');
			row.push(getProjectArea(baseId).toString());
		}
		if (chartType === 'Single Time') {
			row.push(new Date(project['PC Date']).getFullYear().toString());
		}

		csvContent += row.join(',') + '\n';
	});

	// Add benchmark data to CSV if available
	const getBenchmarkDataForCSV = () => {
		// Get UKNZCBS benchmark data for upfront carbon
		if (selectedKPI1 === 'Upfront Carbon' && selectedBarChartBenchmark && valueType === 'average' && projects.length > 0) {
			const primaryProject = projects[0];
			const primarySector = primaryProject['Primary Sector'];

			// Get the PC date from the primary project to determine benchmark year
			let benchmarkYear = parseInt(primaryProject['PC Date']) || 2025;
			if (benchmarkYear < 2025) benchmarkYear = 2025;

			// Get benchmark values for this sector and sub-sector
			const sectorData = uknzcbsBenchmarks[primarySector as keyof typeof uknzcbsBenchmarks];
			if (!sectorData) return { lines: [], title: '' };

			const subSectorData = sectorData[selectedBarChartBenchmark as keyof typeof sectorData];
			if (!subSectorData) return { lines: [], title: '' };

			const newBuildValue = subSectorData['New Build']?.[benchmarkYear as keyof (typeof subSectorData)['New Build']];
			const retrofitValue = subSectorData['Retrofit']?.[benchmarkYear as keyof (typeof subSectorData)['Retrofit']];

			const benchmarkLines = [];
			if (newBuildValue !== undefined) {
				benchmarkLines.push({
					name: `New Build (PC ${benchmarkYear})`,
					value: newBuildValue,
				});
			}
			if (retrofitValue !== undefined) {
				benchmarkLines.push({
					name: `Retrofit (PC ${benchmarkYear})`,
					value: retrofitValue,
				});
			}

			return {
				lines: benchmarkLines,
				title: `UKNZCBS: ${selectedBarChartBenchmark}`,
			};
		}

		// Get benchmark data for total embodied carbon
		if (showBenchmarks && selectedKPI1 === 'Total Embodied Carbon' && valueType === 'average' && projects.length > 0) {
			// Get benchmark values for this sector
			const sectorBenchmarks = totalEmbodiedCarbonBenchmarks[projects[0]['Primary Sector'] as keyof typeof totalEmbodiedCarbonBenchmarks];

			if (!sectorBenchmarks) return { lines: [], title: '' };

			const benchmarkLines = Object.entries(sectorBenchmarks).map(([name, value]) => ({
				name,
				value,
			}));

			return {
				lines: benchmarkLines,
				title: `Benchmarks: ${projects[0]['Primary Sector']}`,
			};
		}

		return { lines: [], title: '' };
	};

	const benchmarkData = getBenchmarkDataForCSV();
	if (benchmarkData.lines.length > 0) {
		csvContent += `\n${benchmarkData.title}\n`;
		csvContent += 'Benchmark Name,Value\n';
		benchmarkData.lines.forEach((benchmark) => {
			csvContent += `"${benchmark.name}",${benchmark.value}\n`;
		});
	}

	// Download CSV
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `chart-data-${selectedKPI1}-${valueType}-${Date.now()}.csv`;
	a.click();
	URL.revokeObjectURL(url);
};
