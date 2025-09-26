import { useState } from 'react';
import { FilterPanel } from '@/components/L20-Filter';
import { Chart } from '@/components/R32-Chart';
import { Portfolio } from '@/components/R40-Portfolio';
import { DashboardHeader } from '@/components/T00-Header';
import { AddProjectData } from '@/components/L10-Add';
import { Comparison } from '@/components/R30-Comparison';
import { SectorPerformance } from '@/components/R10-Sector';
import { Certification } from '@/components/R20-Certification';
import { sampleProjects } from '@/data/sampleData';
import { Project } from '@/components/Utils/project';
import { Card } from '@/components/ui/card';

const Index = () => {
	const [filteredProjects, setFilteredProjects] = useState(sampleProjects);
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
			{/* <DashboardHeader /> */}

			<div className="container mx-auto">
				{/* <div className="px-36 mx-auto"> */}
				<div className="flex">
					<div className="min-w-96 fixed px-0 top-0 bottom-0 overflow-y-auto pt-0">
						<div className="flex flex-col items-center px-10 pb-10">
							<Card className="p-4 w-[calc(100%+60px)] bg-cyan-100 rounded-tl-none rounded-tr-none rounded-bl-[80px] rounded-br-[80px]">
								<div className="h-24 p-4 flex justify-center">
									<img src="/lovable-uploads/4ce0bfd4-e09c-45a3-bb7c-0a84df6eca91.png" alt="Hawkins Brown" className="h-12 w-auto" />
								</div>
							</Card>
							<Card className="p-0 mt-8 w-full rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[200px] rounded-br-[200px]">
								<AddProjectData projects={sampleProjects} />
								<FilterPanel filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
							</Card>
						</div>
					</div>

					{/* Main Content with left margin to account for fixed sidebar */}
					<div className="flex-1 ml-[460px] mr-10 space-y-8">
						<Card className="p-0 w-[calc(100%+160px)] -ml-[85px] -mr-[80px] bg-pink-300 rounded-tl-none rounded-tr-none rounded-bl-[120px] rounded-br-[120px]">
							<div className="px-24 py-4 flex justify-between text-center items-center">
								<h1 className="text-white text-2xl font-bold">Sustainability Performance Dashboard</h1>
								<p className=" text-rose-100 text-lg">Track environmental KPIs across all architectural projects</p>
							</div>
						</Card>
						<div className="w-full space-y-8">
							{/* Sector Performance Analysis */}
							<SectorPerformance projects={sampleProjects} />

							{/* Certification Analysis */}
							<Certification projects={sampleProjects} />

							{/* Project Comparison */}
							<Comparison
								projects={filteredProjects}
								primaryProject={primaryProject}
								comparisonProjects={comparisonProjects}
								onPrimaryProjectChange={handlePrimaryProjectChange}
								onComparisonProjectsChange={handleComparisonChange}
							/>

							{/* Charts Section */}
							<Chart projects={displayProjects} isComparingToSelf={compareToSelf} selectedRibaStages={selectedRibaStages} />

							{/* Projects Portfolio */}
							<Portfolio projects={displayProjects} isComparingToSelf={compareToSelf} selectedRibaStages={selectedRibaStages} primaryProject={primaryProject} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Index;
