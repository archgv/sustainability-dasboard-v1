import { Project, KPIOptions } from '@/components/Utils/project';
import { ChartType, ValueType } from '@/components/R32-Chart';
import { totalEmbodiedCarbonBenchmarks, uknzcbsBenchmarks } from '@/data/benchmarkData';

interface ExportCSVOptions {
	projects: Project[];
	chartType: ChartType;
	selectedKPI1: string;
	selectedKPI2: string;
	valueType: ValueType;
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

const getUnitLabel = (baseUnit: string, valueType: ValueType, forCSV: boolean = false): string => {
	// For CSV exports, use plain text to avoid encoding issues
	const unit = forCSV ? baseUnit.replace(/CO2/g, 'CO2').replace(/₂/g, '2') : baseUnit.replace(/CO2/g, 'CO₂');

	if (valueType === 'total') {
		return unit.replace('/m²', '').replace('/year', '/year total');
	}
	return unit;
};

const getChartTitle = (chartType: ChartType, selectedKPI1: string, selectedKPI2: string, valueType: ValueType) => {
	const valueTypeLabel = valueType === 'per-sqm' ? 'per sqm' : 'total';
	const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);
	const kpi2Config = KPIOptions.find((kpi) => kpi.key === selectedKPI2);

	switch (chartType) {
		case 'Compare Two':
			return `${kpi1Config?.label} vs ${kpi2Config?.label} (${valueTypeLabel}) - Bubble Chart`;
		case 'Single Project':
			return `${kpi1Config?.label} by Project (${valueTypeLabel}) - Bar Chart`;
		case 'Single Time':
			return `${kpi1Config?.label} Over Time (${valueTypeLabel}) - Timeline`;
		default:
			return 'Chart';
	}
};

const getLifecycleStageCategories = (): ChartCategory[] => [
	{ key: 'biogenicCarbon', label: 'Biogenic carbon (A1-A3)', color: '#FF8EE5' },
	{ key: 'upfrontEmbodied', label: 'Upfront embodied carbon (A1-A5)', color: '#2D9B4D' },
	{ key: 'inUseEmbodied', label: 'In-use embodied carbon (B1-B5)', color: '#48DE9D' },
	{ key: 'endOfLife', label: 'End of life (C1-C4)', color: '#f39c12' },
	{ key: 'benefitsLoads', label: 'Benefits and loads (D1)', color: '#5dc5ed' },
	{ key: 'facilitatingWorks', label: 'Facilitating works', color: '#c9e1ea' },
];

const getBuildingElementCategories = (): ChartCategory[] => [
	{ key: 'substructure', label: 'Substructure', color: '#2D9B4D' },
	{ key: 'superstructureFrame', label: 'Superstructure - Frame', color: '#48DE9D' },
	{ key: 'superstructureExternal', label: 'Superstructure - External envelope', color: '#FF8EE5' },
	{ key: 'superstructureInternal', label: 'Superstructure - Internal assemblies', color: '#5dc5ed' },
	{ key: 'finishes', label: 'Finishes', color: '#f39c12' },
	{ key: 'ffe', label: 'FF&E', color: '#3498db' },
	{ key: 'mep', label: 'MEP', color: '#2D9B4D' },
	{ key: 'externalWorks', label: 'External works', color: '#004033' },
	{ key: 'contingency', label: 'Contingency', color: '#272727' },
];

const transformDataForValueType = (data: Project[], valueType: ValueType, selectedKPI1: string, selectedKPI2: string): Project[] => {
	if (valueType === 'per-sqm') {
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
	const headers = ['Project Name', `${kpi1Config?.label || selectedKPI1} (${getUnitLabel(kpi1Config?.unit || '', valueType, true)})`];

	// For Total Embodied Carbon charts, include biogenic carbon column
	if (chartType === 'Single Project' && selectedKPI1 === 'Total Embodied Carbon') {
		headers.push(`Biogenic (${getUnitLabel(kpi1Config?.unit || '', valueType, true)})`);
	}

	if (chartType === 'Compare Two') {
		headers.push(`${kpi2Config?.label || selectedKPI2} (${getUnitLabel(kpi2Config?.unit || '', valueType, true)})`);
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
		if (selectedKPI1 === 'Upfront Carbon' && selectedBarChartBenchmark && valueType === 'per-sqm' && projects.length > 0) {
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
		if (showBenchmarks && selectedKPI1 === 'Total Embodied Carbon' && valueType === 'per-sqm' && projects.length > 0) {
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
