import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Project } from '@/components/Key/project';
import { Building2, Calendar, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StageKeys } from './Key/KeyStage';

interface ComparisonProps {
	projects: Project[];
	primaryProject: string;
	comparisonProjects: string[];
	onPrimaryProjectChange: (projectId: string) => void;
	onComparisonProjectsChange: (projectIds: string[], compareToSelf: boolean, ribaStages: string[]) => void;
}

export const Comparison = ({ projects, primaryProject, comparisonProjects, onPrimaryProjectChange, onComparisonProjectsChange }: ComparisonProps) => {
	const [compareToSelf, setCompareToSelf] = useState(false);
	const [selectedRibaStages, setSelectedRibaStages] = useState<string[]>([]);
	const [open, setOpen] = useState(false);

	const handleComparisonToggle = (projectId: string) => {
		const isSelected = comparisonProjects.includes(projectId);
		const newComparisonProjects = isSelected ? comparisonProjects.filter((id) => id !== projectId) : [...comparisonProjects, projectId];

		onComparisonProjectsChange(newComparisonProjects, compareToSelf, selectedRibaStages);
	};

	const handleRibaStageToggle = (stageId: string) => {
		const isSelected = selectedRibaStages.includes(stageId);
		const newSelectedStages = isSelected ? selectedRibaStages.filter((id) => id !== stageId) : [...selectedRibaStages, stageId];

		setSelectedRibaStages(newSelectedStages);
		onComparisonProjectsChange(comparisonProjects, compareToSelf, newSelectedStages);
	};

	const handleCompareToSelfToggle = (checked: boolean) => {
		setCompareToSelf(checked);
		if (checked) {
			onComparisonProjectsChange([], true, selectedRibaStages);
		} else {
			setSelectedRibaStages([]);
			onComparisonProjectsChange(comparisonProjects, false, []);
		}
	};

	const primaryProjectData = projects.find((p) => p.id === primaryProject);

	const getComparisonCount = () => {
		if (compareToSelf) {
			return selectedRibaStages.length;
		}
		return comparisonProjects.length;
	};

	return (
		<Card className="p-6 mb-6">
			<h2>Project Comparison</h2>

			<Card className="grid grid-cols-1 lg:grid-cols-2 gap-6 shadow-inner mt-6 p-2">
				{/* Primary Project Selection */}
				<Card className="px-8">
					<Label className="text-sm font-medium text-gray-700 mb-2 block">Primary Project</Label>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
								{primaryProject ? projects.find((p) => p.id === primaryProject)?.['Project Name'] || '' : 'Select primary project...'}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-full p-0">
							<Command>
								<CommandInput placeholder="Search projects..." />
								<CommandList>
									<CommandEmpty>No project found.</CommandEmpty>
									<CommandGroup>
										{projects.map((project) => (
											<CommandItem
												key={project.id}
												value={project['Project Name']}
												onSelect={() => {
													onPrimaryProjectChange(project.id);
													setOpen(false);
												}}
											>
												<Check className={cn('mr-2 h-4 w-4', primaryProject === project.id ? 'opacity-100' : 'opacity-0')} />
												{project['Project Name']}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>

					{primaryProjectData && (
						<div className="mt-3 px-6 py-4 bg-blue-50 rounded-[20px]">
							<div className="flex items-center gap-2 mb-2">
								<Building2 className="h-4 w-4 text-blue-600" />
								<span className="font-medium text-blue-900">{primaryProjectData['Project Name']}</span>
							</div>
							<div className="flex items-center gap-4 text-sm text-blue-700">
								<div className="flex items-center gap-1">
									<MapPin className="h-3 w-3" />
									{primaryProjectData['Project Location']}
								</div>
								<Badge variant="outline" className="capitalize shadow-inner">
									{primaryProjectData['Primary Sector']}
								</Badge>
								<Badge variant="outline" className="capitalize shadow-inner">
									{primaryProjectData['Project Type']}
								</Badge>
							</div>
						</div>
					)}
				</Card>

				{/* Comparison Selection */}
				<Card className="px-8">
					<Label className="text-sm font-medium text-gray-700 mb-2 block">Compare With ({getComparisonCount()} selected)</Label>

					<div className="mb-4">
						<div className="flex items-center space-x-2">
							<Checkbox id="compare-to-self" checked={compareToSelf} onCheckedChange={handleCompareToSelfToggle} />
							<label htmlFor="compare-to-self" className="text-sm font-medium">
								Self Compare (RIBA Stages)
							</label>
						</div>
					</div>

					{compareToSelf ? (
						/* RIBA Stage Selection */
						<Card className="space-y-2 max-h-64 overflow-y-auto rounded-[38px] shadow-inner px-4 pt-4 pb-0">
							<div className="grid grid-cols-2 gap-x-8 gap-y-2">
								{StageKeys.map((stage) => (
									<div
										key={stage}
										className={`p-3 shadow-inner rounded-full bg-gray-50 cursor-pointer transition-colors ${
											selectedRibaStages.includes(stage) ? ' bg-pink-100' : 'hover:border-gray-300'
										}`}
										onClick={() => handleRibaStageToggle(stage)}
									>
										<div className="flex items-center justify-center">
											<span className="font-medium text-gray-600">RIBA {stage}</span>
										</div>
									</div>
								))}
							</div>
						</Card>
					) : (
						/* Project Selection */
						<div className="space-y-2 max-h-64 overflow-y-auto">
							{projects
								.filter((p) => p.id !== primaryProject)
								.map((project) => (
									<div
										key={project.id}
										className={`py-3 px-6 shadow-inner rounded-[20px] cursor-pointer transition-colors ${comparisonProjects.includes(project.id) ? ' bg-pink-200' : 'bg-gray-50'}`}
										onClick={() => handleComparisonToggle(project.id)}
									>
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium text-gray-900">{project['Project Name']}</p>
												<div className="flex items-center gap-2 mt-1">
													<Badge variant="outline" className="text-xs capitalize">
														{project['Primary Sector']}
													</Badge>
													<Badge variant="outline" className="text-xs capitalize">
														{project['Project Type']}
													</Badge>
													<span className="text-xs text-gray-500">RIBA {project['Current RIBA Stage']}</span>
												</div>
											</div>
											<div className={`w-4 h-4 rounded-full  ${comparisonProjects.includes(project.id) ? 'bg-purple-300' : 'bg-gray-200'}`}>
												{comparisonProjects.includes(project.id) && <div className="w-full h-full flex items-center justify-center"></div>}
											</div>
										</div>
									</div>
								))}
						</div>
					)}
				</Card>
			</Card>
		</Card>
	);
};
