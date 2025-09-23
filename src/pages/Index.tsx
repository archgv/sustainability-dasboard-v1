import { useState } from 'react';
import { FilterPanel } from '@/components/FilterPanel';
import { ChartSection } from '@/components/ChartSection';
import { ProjectPortfolio } from '@/components/ProjectPortfolio';
import { DashboardHeader } from '@/components/DashboardHeader';
import { AddProjectData } from '@/components/AddProjectData';
import { ChartTypeSelector, ChartType, EmbodiedCarbonBreakdown, ValueType } from '@/components/ChartTypeSelector';
import { ProjectComparison } from '@/components/ProjectComparison';
import { SectorPerformance } from '@/components/SectorPerformance';
import { CertificationAnalysis } from '@/components/CertificationAnalysis';
import { sampleProjects } from '@/data/sampleData';
import { Project } from '@/types/project';

const Index = () => {
	const [filteredProjects, setFilteredProjects] = useState(sampleProjects);
	const [chartType, setChartType] = useState<ChartType>('compare-bubble');
	const [selectedKPI1, setSelectedKPI1] = useState('totalEmbodiedCarbon');
	const [selectedKPI2, setSelectedKPI2] = useState('operationalEnergyTotal');
	const [embodiedCarbonBreakdown, setEmbodiedCarbonBreakdown] = useState<EmbodiedCarbonBreakdown>('none');
	const [valueType, setValueType] = useState<ValueType>('per-sqm');
	const [primaryProject, setPrimaryProject] = useState(sampleProjects[0]?.id || '');
	const [comparisonProjects, setComparisonProjects] = useState<string[]>([]);
	const [compareToSelf, setCompareToSelf] = useState(false);
	const [selectedRibaStages, setSelectedRibaStages] = useState<string[]>([]);

	const [filters, setFilters] = useState({
		'Primary Sector': 'all',
		'Project Type': 'all',
		'Current RIBA Stage': 'all',
		dateRange: 'all',
		carbonRange: [0, 200],
		energyRange: [0, 200],
	});

	const handleFilterChange = (newFilters: typeof filters) => {
		setFilters(newFilters);

		const filtered = sampleProjects.filter((project) => {
			const primarySectorMatch = newFilters['Primary Sector'] === 'all' || project['Primary Sector'] === newFilters['Primary Sector'];
			const projectTypeMatch = newFilters['Project Type'] === 'all' || project['Project Type'] === newFilters['Project Type'];
			const ribaStageMatch = newFilters['Current RIBA Stage'] === 'all' || project['Current RIBA Stage'] === newFilters['Current RIBA Stage'];
			//const carbonMatch = project.carbonIntensity >= newFilters.carbonRange[0] && project.carbonIntensity <= newFilters.carbonRange[1];
			//const energyMatch = project.operationalEnergy >= newFilters.energyRange[0] && project.operationalEnergy <= newFilters.energyRange[1];

			let dateMatch = true;
			if (newFilters.dateRange !== 'all') {
				const projectYear = new Date(project['PC Date']).getFullYear();
				const currentYear = new Date().getFullYear();

				switch (newFilters.dateRange) {
					case 'recent':
						dateMatch = currentYear - projectYear <= 2;
						break;
					case 'older':
						dateMatch = currentYear - projectYear > 2;
						break;
				}
			}

			//return typologyMatch && projectTypeMatch && ribaStageMatch && carbonMatch && energyMatch && dateMatch;
			return primarySectorMatch && projectTypeMatch && ribaStageMatch && dateMatch;
		});

		setFilteredProjects(filtered);
	};

	const handleClearFilters = () => {
		const defaultFilters = {
			'Primary Sector': 'all',
			'Project Type': 'all',
			'Current RIBA Stage': 'all',
			dateRange: 'all',
			carbonRange: [0, 200],
			energyRange: [0, 200],
		};
		handleFilterChange(defaultFilters);
	};

	const handleComparisonChange = (projects: string[], compareToSelfFlag: boolean, ribaStages: string[]) => {
		setComparisonProjects(projects);
		setCompareToSelf(compareToSelfFlag);
		setSelectedRibaStages(ribaStages);
	};

	const handlePrimaryProjectChange = (newPrimaryProject: string) => {
		setPrimaryProject(newPrimaryProject);
		// Clear comparison projects when primary project changes
		setComparisonProjects([]);
		setCompareToSelf(false);
		setSelectedRibaStages([]);
	};

	const getDisplayProjects = () => {
		// Handle self-comparison mode
		if (compareToSelf && selectedRibaStages.length > 0) {
			const primaryProjectData = filteredProjects.find((p) => p.id === primaryProject);
			if (!primaryProjectData) return [];

			return selectedRibaStages.map((stageId) => ({
				...primaryProjectData,
				id: `${primaryProjectData.id}-${stageId}`,
				'Current RIBA Stage': stageId as Project['Current RIBA Stage'],
				'Project Name': primaryProjectData['Project Name'],
			}));
		}

		// Handle comparison mode with multiple projects
		if (comparisonProjects.length > 0) {
			const projectsToShow = [primaryProject, ...comparisonProjects];
			// Preserve the selection order by mapping through projectsToShow instead of filtering
			return projectsToShow.map((id) => filteredProjects.find((p) => p.id === id)).filter((project) => project !== undefined) as Project[];
		}

		// Default: show only the primary project when no comparisons are selected
		if (primaryProject) {
			const primaryProjectData = filteredProjects.find((p) => p.id === primaryProject);
			return primaryProjectData ? [primaryProjectData] : [];
		}

		// Fallback to all filtered projects if no primary project is selected
		return filteredProjects;
	};

	const displayProjects = getDisplayProjects();

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardHeader />

			<div className="container mx-auto px-6 py-8">
				<div className="flex">
					{/* Fixed Filter Panel - aligned with main content */}
					<div className="fixed left-6 top-[calc(4rem+4rem)] w-80 h-[calc(100vh-10rem)] overflow-y-auto z-10">
						<div className="space-y-6">
							<AddProjectData projects={sampleProjects} />
							<FilterPanel filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
						</div>
					</div>

					{/* Main Content with left margin to account for fixed sidebar */}
					<div className="flex-1 ml-96 space-y-8">
						{/* Sector Performance Analysis */}
						<SectorPerformance projects={sampleProjects} />

						{/* Certification Analysis */}
						<CertificationAnalysis projects={sampleProjects} primaryProject={primaryProject} />

						{/* Project Comparison */}
						<ProjectComparison
							projects={filteredProjects}
							primaryProject={primaryProject}
							comparisonProjects={comparisonProjects}
							onPrimaryProjectChange={handlePrimaryProjectChange}
							onComparisonProjectsChange={handleComparisonChange}
						/>

						{/* Chart Type Selector */}
						<ChartTypeSelector
							chartType={chartType}
							selectedKPI1={selectedKPI1}
							selectedKPI2={selectedKPI2}
							embodiedCarbonBreakdown={embodiedCarbonBreakdown}
							valueType={valueType}
							onChartTypeChange={setChartType}
							onKPI1Change={setSelectedKPI1}
							onKPI2Change={setSelectedKPI2}
							onEmbodiedCarbonBreakdownChange={setEmbodiedCarbonBreakdown}
							onValueTypeChange={setValueType}
						/>

						{/* Charts Section */}
						<ChartSection
							projects={displayProjects}
							chartType={chartType}
							selectedKPI1={selectedKPI1}
							selectedKPI2={selectedKPI2}
							embodiedCarbonBreakdown={embodiedCarbonBreakdown}
							valueType={valueType}
							isComparingToSelf={compareToSelf}
							selectedRibaStages={selectedRibaStages}
						/>

						{/* Projects Portfolio */}
						<ProjectPortfolio projects={displayProjects} isComparingToSelf={compareToSelf} selectedRibaStages={selectedRibaStages} primaryProject={primaryProject} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Index;
