import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/types/project';

interface AddProjectDataModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: Project) => void;
	projects: Project[];
}

export const AddProjectDataModal = ({ isOpen, onClose, onSave, projects }: AddProjectDataModalProps) => {
	const [selectedProjectId, setSelectedProjectId] = useState('');
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		id: '',
		'Project Name': '',
		'Project Location': '',
		'Primary Sector': '',
		'Project Type': '',
		'Studio Discipline': '',
		'Operational Energy Existing Building': '',
		'GIA': '',
		'PC Date': '',

		'EI Team Scope': '',
		'External Consultants': '',
		'Sustianability Champion Name': '',

		'BREEAM': '',
		'LEED': '',
		'WELL': '',
		'NABERS': '',
		'Passivhaus or EnePHit': '',
		'UKNZCBS': '',

		'Current RIBA Stage': '',

		'RIBA Stage': {
			'1': {
				'Operational Energy Total': '',
				'Operational Energy Part L': '',
				'Operational Energy Gas': '',

				'Space Heating Demand': '',
				'Total Renewable Energy Generation': '',

				'Upfront Carbon': '',
				'Total Embodied Carbon': '',

				'Biodiversity Net Gain': '',
				'Habitats Units Gained': '',
				'Urban Greening Factor': '',
			},
			'2': {
				'Operational Energy Total': '',
				'Operational Energy Part L': '',
				'Operational Energy Gas': '',

				'Space Heating Demand': '',
				'Total Renewable Energy Generation': '',

				'Upfront Carbon': '',
				'Total Embodied Carbon': '',

				'Biodiversity Net Gain': '',
				'Habitats Units Gained': '',
				'Urban Greening Factor': '',
			},
			'3': {
				'Operational Energy Total': '',
				'Operational Energy Part L': '',
				'Operational Energy Gas': '',

				'Space Heating Demand': '',
				'Total Renewable Energy Generation': '',

				'Upfront Carbon': '',
				'Total Embodied Carbon': '',

				'Biodiversity Net Gain': '',
				'Habitats Units Gained': '',
				'Urban Greening Factor': '',
			},
			'4': {
				'Operational Energy Total': '',
				'Operational Energy Part L': '',
				'Operational Energy Gas': '',

				'Space Heating Demand': '',
				'Total Renewable Energy Generation': '',

				'Upfront Carbon': '',
				'Total Embodied Carbon': '',

				'Biodiversity Net Gain': '',
				'Habitats Units Gained': '',
				'Urban Greening Factor': '',
			},
			'5': {
				'Operational Energy Total': '',
				'Operational Energy Part L': '',
				'Operational Energy Gas': '',

				'Space Heating Demand': '',
				'Total Renewable Energy Generation': '',

				'Upfront Carbon': '',
				'Total Embodied Carbon': '',

				'Biodiversity Net Gain': '',
				'Habitats Units Gained': '',
				'Urban Greening Factor': '',
			},
			'6': {
				'Operational Energy Total': '',
				'Operational Energy Part L': '',
				'Operational Energy Gas': '',

				'Space Heating Demand': '',
				'Total Renewable Energy Generation': '',

				'Upfront Carbon': '',
				'Total Embodied Carbon': '',

				'Biodiversity Net Gain': '',
				'Habitats Units Gained': '',
				'Urban Greening Factor': '',
			},
			'7': {
				'Operational Energy Total': '',
				'Operational Energy Part L': '',
				'Operational Energy Gas': '',

				'Space Heating Demand': '',
				'Total Renewable Energy Generation': '',

				'Upfront Carbon': '',
				'Total Embodied Carbon': '',

				'Biodiversity Net Gain': '',
				'Habitats Units Gained': '',
				'Urban Greening Factor': '',
			},
		},

		'Operational Energy Total': '',
		'Operational Energy Part L': '',
		'Operational Energy Gas': '',

		'Space Heating Demand': '',
		'Total Renewable Energy Generation': '',

		'Upfront Carbon': '',
		'Total Embodied Carbon': '',

		'Biodiversity Net Gain': '',
		'Habitats Units Gained': '',
		'Urban Greening Factor': '',
	});

	const handleProjectSelect = (projectId: string) => {
		setSelectedProjectId(projectId);
		const project = projects.find((p) => p.id === projectId);

		if (project) {
			// Map project data to form fields
			const getSectorFromTypology = (typology: string) => {
				const sectorMap: { [key: string]: string } = {
					'residential': 'residential',
					'educational': 'education',
					'healthcare': 'healthcare',
					'infrastructure': 'infrastructure',
					'CCC': 'ccc',
					'ccc': 'ccc',
					'office': 'workplace',
					'retail': 'workplace',
					'mixed-use': 'workplace',
				};
				return sectorMap[typology] || 'workplace';
			};

			const getBreeamRating = (rating: string) => {
				const ratingMap: { [key: string]: string } = {
					'Outstanding': 'outstanding',
					'Excellent': 'excellent',
					'Very Good': 'very-good',
					'Good': 'good',
					'Pass': 'pass',
					'Unclassified': 'unclassified',
				};
				return ratingMap[rating] || 'not-targetted';
			};

			const getLeedRating = (rating: string) => {
				const ratingMap: { [key: string]: string } = {
					'Platinum': 'platinum',
					'Gold': 'gold',
					'Silver': 'silver',
					'Certified': 'certified',
				};
				return ratingMap[rating] || 'not-targetted';
			};

			const getWellRating = (rating: string) => {
				return rating && rating !== 'N/A' ? 'yes' : 'not-targetted';
			};

			setFormData({
				id: project.id,
				'Project Name': project['Project Name'],
				'Project Location': project['Project Location'] || '',
				'Primary Sector': getSectorFromTypology(project['Primary Sector']),
				'Project Type': project['Project Type'] || '',
				'Studio Discipline': '',

				'Operational Energy Existing Building': project['Operational Energy Existing Building']?.toString() || '',
				'GIA': project['GIA']?.toString() || '',
				'PC Date': project['PC Date'] ? new Date(project['PC Date']).getFullYear().toString() : '',

				'EI Team Scope': '',
				'External Consultants': '',
				'Sustianability Champion Name': '',

				'BREEAM': getBreeamRating(project['BREEAM'] || ''),
				'LEED': getLeedRating(project['LEED'] || ''),
				'WELL': getWellRating(project['WELL'] || ''),

				'Passivhaus or EnePHit': project['Passivhaus or EnePHit'] ? 'yes' : 'not-targetted',
				'UKNZCBS': project['UKNZCBS'] ? 'yes' : 'not-targetted',
				'NABERS': project['NABERS'] && project['NABERS'] !== 'N/A' ? 'yes' : 'not-targetted',

				'Current RIBA Stage': project['Current RIBA Stage'] || '',

				'RIBA Stage': {
					'1': {
						'Operational Energy Total': project['RIBA Stage']['1']['Operational Energy Total']?.toString() || '',
						'Operational Energy Part L': project['RIBA Stage']['1']['Operational Energy Part L']?.toString() || '',
						'Operational Energy Gas': project['RIBA Stage']['1']['Operational Energy Gas']?.toString() || '',

						'Space Heating Demand': project['RIBA Stage']['1']['Space Heating Demand']?.toString() || '',
						'Total Renewable Energy Generation': project['RIBA Stage']['1']['Total Renewable Energy Generation']?.toString() || '',

						'Upfront Carbon': project['RIBA Stage']['1']['Upfront Carbon']?.toString() || '',
						'Total Embodied Carbon': project['RIBA Stage']['1']['Total Embodied Carbon']?.toString() || '',

						'Biodiversity Net Gain': project['RIBA Stage']['1']['Biodiversity Net Gain']?.toString() || '',
						'Habitats Units Gained': project['RIBA Stage']['1']['Habitats Units Gained']?.toString() || '',
						'Urban Greening Factor': project['RIBA Stage']['1']['Urban Greening Factor']?.toString() || '',
					},
					'2': {
						'Operational Energy Total': project['RIBA Stage']['2']['Operational Energy Total']?.toString() || '',
						'Operational Energy Part L': project['RIBA Stage']['2']['Operational Energy Part L']?.toString() || '',
						'Operational Energy Gas': project['RIBA Stage']['2']['Operational Energy Gas']?.toString() || '',

						'Space Heating Demand': project['RIBA Stage']['2']['Space Heating Demand']?.toString() || '',
						'Total Renewable Energy Generation': project['RIBA Stage']['2']['Total Renewable Energy Generation']?.toString() || '',

						'Upfront Carbon': project['RIBA Stage']['2']['Upfront Carbon']?.toString() || '',
						'Total Embodied Carbon': project['RIBA Stage']['2']['Total Embodied Carbon']?.toString() || '',

						'Biodiversity Net Gain': project['RIBA Stage']['2']['Biodiversity Net Gain']?.toString() || '',
						'Habitats Units Gained': project['RIBA Stage']['2']['Habitats Units Gained']?.toString() || '',
						'Urban Greening Factor': project['RIBA Stage']['2']['Urban Greening Factor']?.toString() || '',
					},
					'3': {
						'Operational Energy Total': project['RIBA Stage']['3']['Operational Energy Total']?.toString() || '',
						'Operational Energy Part L': project['RIBA Stage']['3']['Operational Energy Part L']?.toString() || '',
						'Operational Energy Gas': project['RIBA Stage']['3']['Operational Energy Gas']?.toString() || '',

						'Space Heating Demand': project['RIBA Stage']['3']['Space Heating Demand']?.toString() || '',
						'Total Renewable Energy Generation': project['RIBA Stage']['3']['Total Renewable Energy Generation']?.toString() || '',

						'Upfront Carbon': project['RIBA Stage']['3']['Upfront Carbon']?.toString() || '',
						'Total Embodied Carbon': project['RIBA Stage']['3']['Total Embodied Carbon']?.toString() || '',

						'Biodiversity Net Gain': project['RIBA Stage']['3']['Biodiversity Net Gain']?.toString() || '',
						'Habitats Units Gained': project['RIBA Stage']['3']['Habitats Units Gained']?.toString() || '',
						'Urban Greening Factor': project['RIBA Stage']['3']['Urban Greening Factor']?.toString() || '',
					},
					'4': {
						'Operational Energy Total': project['RIBA Stage']['4']['Operational Energy Total']?.toString() || '',
						'Operational Energy Part L': project['RIBA Stage']['4']['Operational Energy Part L']?.toString() || '',
						'Operational Energy Gas': project['RIBA Stage']['4']['Operational Energy Gas']?.toString() || '',

						'Space Heating Demand': project['RIBA Stage']['4']['Space Heating Demand']?.toString() || '',
						'Total Renewable Energy Generation': project['RIBA Stage']['4']['Total Renewable Energy Generation']?.toString() || '',

						'Upfront Carbon': project['RIBA Stage']['4']['Upfront Carbon']?.toString() || '',
						'Total Embodied Carbon': project['RIBA Stage']['4']['Total Embodied Carbon']?.toString() || '',

						'Biodiversity Net Gain': project['RIBA Stage']['4']['Biodiversity Net Gain']?.toString() || '',
						'Habitats Units Gained': project['RIBA Stage']['4']['Habitats Units Gained']?.toString() || '',
						'Urban Greening Factor': project['RIBA Stage']['4']['Urban Greening Factor']?.toString() || '',
					},
					'5': {
						'Operational Energy Total': project['RIBA Stage']['5']['Operational Energy Total']?.toString() || '',
						'Operational Energy Part L': project['RIBA Stage']['5']['Operational Energy Part L']?.toString() || '',
						'Operational Energy Gas': project['RIBA Stage']['5']['Operational Energy Gas']?.toString() || '',

						'Space Heating Demand': project['RIBA Stage']['5']['Space Heating Demand']?.toString() || '',
						'Total Renewable Energy Generation': project['RIBA Stage']['5']['Total Renewable Energy Generation']?.toString() || '',

						'Upfront Carbon': project['RIBA Stage']['5']['Upfront Carbon']?.toString() || '',
						'Total Embodied Carbon': project['RIBA Stage']['5']['Total Embodied Carbon']?.toString() || '',

						'Biodiversity Net Gain': project['RIBA Stage']['5']['Biodiversity Net Gain']?.toString() || '',
						'Habitats Units Gained': project['RIBA Stage']['5']['Habitats Units Gained']?.toString() || '',
						'Urban Greening Factor': project['RIBA Stage']['5']['Urban Greening Factor']?.toString() || '',
					},
					'6': {
						'Operational Energy Total': project['RIBA Stage']['6']['Operational Energy Total']?.toString() || '',
						'Operational Energy Part L': project['RIBA Stage']['6']['Operational Energy Part L']?.toString() || '',
						'Operational Energy Gas': project['RIBA Stage']['6']['Operational Energy Gas']?.toString() || '',

						'Space Heating Demand': project['RIBA Stage']['6']['Space Heating Demand']?.toString() || '',
						'Total Renewable Energy Generation': project['RIBA Stage']['6']['Total Renewable Energy Generation']?.toString() || '',

						'Upfront Carbon': project['RIBA Stage']['6']['Upfront Carbon']?.toString() || '',
						'Total Embodied Carbon': project['RIBA Stage']['6']['Total Embodied Carbon']?.toString() || '',

						'Biodiversity Net Gain': project['RIBA Stage']['6']['Biodiversity Net Gain']?.toString() || '',
						'Habitats Units Gained': project['RIBA Stage']['6']['Habitats Units Gained']?.toString() || '',
						'Urban Greening Factor': project['RIBA Stage']['6']['Urban Greening Factor']?.toString() || '',
					},
					'7': {
						'Operational Energy Total': project['RIBA Stage']['7']['Operational Energy Total']?.toString() || '',
						'Operational Energy Part L': project['RIBA Stage']['7']['Operational Energy Part L']?.toString() || '',
						'Operational Energy Gas': project['RIBA Stage']['7']['Operational Energy Gas']?.toString() || '',

						'Space Heating Demand': project['RIBA Stage']['7']['Space Heating Demand']?.toString() || '',
						'Total Renewable Energy Generation': project['RIBA Stage']['7']['Total Renewable Energy Generation']?.toString() || '',

						'Upfront Carbon': project['RIBA Stage']['7']['Upfront Carbon']?.toString() || '',
						'Total Embodied Carbon': project['RIBA Stage']['7']['Total Embodied Carbon']?.toString() || '',

						'Biodiversity Net Gain': project['RIBA Stage']['7']['Biodiversity Net Gain']?.toString() || '',
						'Habitats Units Gained': project['RIBA Stage']['7']['Habitats Units Gained']?.toString() || '',
						'Urban Greening Factor': project['RIBA Stage']['7']['Urban Greening Factor']?.toString() || '',
					},
				},

				'Operational Energy Total': project['Operational Energy Total']?.toString() || '',
				'Operational Energy Part L': project['Operational Energy Part L']?.toString() || '',
				'Operational Energy Gas': project['Operational Energy Gas']?.toString() || '',

				'Space Heating Demand': project['Space Heating Demand']?.toString() || '',
				'Total Renewable Energy Generation': project['Total Renewable Energy Generation']?.toString() || '',

				'Upfront Carbon': project['Upfront Carbon']?.toString() || '',
				'Total Embodied Carbon': project['Total Embodied Carbon']?.toString() || '',

				'Biodiversity Net Gain': project['Biodiversity Net Gain']?.toString() || '',
				'Habitats Units Gained': project['Habitats Units Gained']?.toString() || '',
				'Urban Greening Factor': project['Urban Greening Factor']?.toString() || '',
			});
		}
		setOpen(false);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		const project: Project = {
			id: selectedProjectId,
			'Project Name': formData['Project Name'],
			'Project Location': formData['Project Location'],
			'Primary Sector': formData['Primary Sector'] as Project['Primary Sector'],
			'Project Type': formData['Project Type'] as Project['Project Type'],
			'Studio Discipline': formData['Studio Discipline'],
			'PC Date': formData['PC Date'],

			'GIA': formData['GIA'] ? Number(formData['GIA']) : undefined,
			'Operational Energy Existing Building': formData['Operational Energy Existing Building'] ? Number(formData['Operational Energy Existing Building']) : undefined,

			'BREEAM': formData['BREEAM'],
			'LEED': formData['LEED'],
			'WELL': formData['WELL'],
			'Passivhaus or EnePHit': formData['Passivhaus or EnePHit'],
			'NABERS': formData['NABERS'],
			'UKNZCBS': formData['UKNZCBS'],

			'Current RIBA Stage': formData['Current RIBA Stage'] as Project['Current RIBA Stage'],

			'RIBA Stage': {
				'1': {
					'Operational Energy Total': Number(formData['RIBA Stage']['1']['Operational Energy Total']),
					'Operational Energy Part L': Number(formData['RIBA Stage']['1']['Operational Energy Gas']),
					'Operational Energy Gas': Number(formData['RIBA Stage']['1']['Space Heating Demand']),

					'Space Heating Demand': Number(formData['RIBA Stage']['1']['Space Heating Demand']),
					'Total Renewable Energy Generation': Number(formData['RIBA Stage']['1']['Total Renewable Energy Generation']),
					'Upfront Carbon': Number(formData['RIBA Stage']['1']['Upfront Carbon']),
					'Total Embodied Carbon': Number(formData['RIBA Stage']['1']['Total Embodied Carbon']),

					'Biodiversity Net Gain': Number(formData['RIBA Stage']['1']['Biodiversity Net Gain']),
					'Habitats Units Gained': Number(formData['RIBA Stage']['1']['Habitats Units Gained']),
					'Urban Greening Factor': Number(formData['RIBA Stage']['1']['Urban Greening Factor']),
				},
				'2': {
					'Operational Energy Total': Number(formData['RIBA Stage']['2']['Operational Energy Total']),
					'Operational Energy Part L': Number(formData['RIBA Stage']['2']['Operational Energy Gas']),
					'Operational Energy Gas': Number(formData['RIBA Stage']['2']['Space Heating Demand']),

					'Space Heating Demand': Number(formData['RIBA Stage']['2']['Space Heating Demand']),
					'Total Renewable Energy Generation': Number(formData['RIBA Stage']['2']['Total Renewable Energy Generation']),
					'Upfront Carbon': Number(formData['RIBA Stage']['2']['Upfront Carbon']),
					'Total Embodied Carbon': Number(formData['RIBA Stage']['2']['Total Embodied Carbon']),

					'Biodiversity Net Gain': Number(formData['RIBA Stage']['2']['Biodiversity Net Gain']),
					'Habitats Units Gained': Number(formData['RIBA Stage']['2']['Habitats Units Gained']),
					'Urban Greening Factor': Number(formData['RIBA Stage']['2']['Urban Greening Factor']),
				},
				'3': {
					'Operational Energy Total': Number(formData['RIBA Stage']['3']['Operational Energy Total']),
					'Operational Energy Part L': Number(formData['RIBA Stage']['3']['Operational Energy Gas']),
					'Operational Energy Gas': Number(formData['RIBA Stage']['3']['Space Heating Demand']),

					'Space Heating Demand': Number(formData['RIBA Stage']['3']['Space Heating Demand']),
					'Total Renewable Energy Generation': Number(formData['RIBA Stage']['3']['Total Renewable Energy Generation']),
					'Upfront Carbon': Number(formData['RIBA Stage']['3']['Upfront Carbon']),
					'Total Embodied Carbon': Number(formData['RIBA Stage']['3']['Total Embodied Carbon']),

					'Biodiversity Net Gain': Number(formData['RIBA Stage']['3']['Biodiversity Net Gain']),
					'Habitats Units Gained': Number(formData['RIBA Stage']['3']['Habitats Units Gained']),
					'Urban Greening Factor': Number(formData['RIBA Stage']['3']['Urban Greening Factor']),
				},
				'4': {
					'Operational Energy Total': Number(formData['RIBA Stage']['4']['Operational Energy Total']),
					'Operational Energy Part L': Number(formData['RIBA Stage']['4']['Operational Energy Gas']),
					'Operational Energy Gas': Number(formData['RIBA Stage']['4']['Space Heating Demand']),

					'Space Heating Demand': Number(formData['RIBA Stage']['4']['Space Heating Demand']),
					'Total Renewable Energy Generation': Number(formData['RIBA Stage']['4']['Total Renewable Energy Generation']),
					'Upfront Carbon': Number(formData['RIBA Stage']['4']['Upfront Carbon']),
					'Total Embodied Carbon': Number(formData['RIBA Stage']['4']['Total Embodied Carbon']),

					'Biodiversity Net Gain': Number(formData['RIBA Stage']['4']['Biodiversity Net Gain']),
					'Habitats Units Gained': Number(formData['RIBA Stage']['4']['Habitats Units Gained']),
					'Urban Greening Factor': Number(formData['RIBA Stage']['4']['Urban Greening Factor']),
				},
				'5': {
					'Operational Energy Total': Number(formData['RIBA Stage']['5']['Operational Energy Total']),
					'Operational Energy Part L': Number(formData['RIBA Stage']['5']['Operational Energy Gas']),
					'Operational Energy Gas': Number(formData['RIBA Stage']['5']['Space Heating Demand']),

					'Space Heating Demand': Number(formData['RIBA Stage']['5']['Space Heating Demand']),
					'Total Renewable Energy Generation': Number(formData['RIBA Stage']['5']['Total Renewable Energy Generation']),
					'Upfront Carbon': Number(formData['RIBA Stage']['5']['Upfront Carbon']),
					'Total Embodied Carbon': Number(formData['RIBA Stage']['5']['Total Embodied Carbon']),

					'Biodiversity Net Gain': Number(formData['RIBA Stage']['5']['Biodiversity Net Gain']),
					'Habitats Units Gained': Number(formData['RIBA Stage']['5']['Habitats Units Gained']),
					'Urban Greening Factor': Number(formData['RIBA Stage']['5']['Urban Greening Factor']),
				},
				'6': {
					'Operational Energy Total': Number(formData['RIBA Stage']['6']['Operational Energy Total']),
					'Operational Energy Part L': Number(formData['RIBA Stage']['6']['Operational Energy Gas']),
					'Operational Energy Gas': Number(formData['RIBA Stage']['6']['Space Heating Demand']),

					'Space Heating Demand': Number(formData['RIBA Stage']['6']['Space Heating Demand']),
					'Total Renewable Energy Generation': Number(formData['RIBA Stage']['6']['Total Renewable Energy Generation']),
					'Upfront Carbon': Number(formData['RIBA Stage']['6']['Upfront Carbon']),
					'Total Embodied Carbon': Number(formData['RIBA Stage']['6']['Total Embodied Carbon']),

					'Biodiversity Net Gain': Number(formData['RIBA Stage']['6']['Biodiversity Net Gain']),
					'Habitats Units Gained': Number(formData['RIBA Stage']['6']['Habitats Units Gained']),
					'Urban Greening Factor': Number(formData['RIBA Stage']['6']['Urban Greening Factor']),
				},
				'7': {
					'Operational Energy Total': Number(formData['RIBA Stage']['7']['Operational Energy Total']),
					'Operational Energy Part L': Number(formData['RIBA Stage']['7']['Operational Energy Gas']),
					'Operational Energy Gas': Number(formData['RIBA Stage']['7']['Space Heating Demand']),

					'Space Heating Demand': Number(formData['RIBA Stage']['7']['Space Heating Demand']),
					'Total Renewable Energy Generation': Number(formData['RIBA Stage']['7']['Total Renewable Energy Generation']),
					'Upfront Carbon': Number(formData['RIBA Stage']['7']['Upfront Carbon']),
					'Total Embodied Carbon': Number(formData['RIBA Stage']['7']['Total Embodied Carbon']),

					'Biodiversity Net Gain': Number(formData['RIBA Stage']['7']['Biodiversity Net Gain']),
					'Habitats Units Gained': Number(formData['RIBA Stage']['7']['Habitats Units Gained']),
					'Urban Greening Factor': Number(formData['RIBA Stage']['7']['Urban Greening Factor']),
				},
			},

			'Operational Energy Total': Number(formData['Operational Energy Total']),
			'Operational Energy Part L': Number(formData['Operational Energy Part L']),
			'Operational Energy Gas': Number(formData['Operational Energy Gas']),

			'Space Heating Demand': Number(formData['Space Heating Demand']),
			'Total Renewable Energy Generation': Number(formData['Total Renewable Energy Generation']),
			'Upfront Carbon': Number(formData['Upfront Carbon']),
			'Total Embodied Carbon': Number(formData['Total Embodied Carbon']),

			'Biodiversity Net Gain': Number(formData['Biodiversity Net Gain']),
			'Habitats Units Gained': Number(formData['Habitats Units Gained']),
			'Urban Greening Factor': Number(formData['Urban Greening Factor']),
		};

		onSave(project);
		onClose();
	};

	const TooltipField = ({ label, tooltip, children }: { label: string; tooltip?: string; children: React.ReactNode }) => (
		<div>
			<Label className="flex items-center gap-1">
				{label}
				{tooltip && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<HelpCircle className="h-3 w-3 text-gray-400" />
							</TooltipTrigger>
							<TooltipContent>
								<p className="max-w-xs">{tooltip}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</Label>
			{children}
		</div>
	);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-6xl h-[95vh] overflow-hidden">
				<DialogHeader>
					<DialogTitle>Add Project Data</DialogTitle>
				</DialogHeader>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
					{/* Project Information */}
					<div className="space-y-4">
						<h3 className="font-semibold text-gray-900">Project Information</h3>

						<TooltipField label="Project Name & Number">
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
										{selectedProjectId ? projects.find((p) => p.id === selectedProjectId)?.['Project Name'] || '' : 'Select or search project...'}
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
													<CommandItem key={project.id} value={project['Project Name']} onSelect={() => handleProjectSelect(project.id)}>
														<Check className={cn('mr-2 h-4 w-4', selectedProjectId === project.id ? 'opacity-100' : 'opacity-0')} />
														{project['Project Name']}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</TooltipField>

						<TooltipField label="Project Location">
							<Input value={formData['Project Location']} onChange={(e) => handleInputChange('projectLocation', e.target.value)} placeholder="Enter project location" />
						</TooltipField>

						<TooltipField label="H&B Discipline">
							<Select value={formData['Studio Discipline']} onValueChange={(value) => handleInputChange('hbDiscipline', value)}>
								<SelectTrigger>
									<SelectValue placeholder="Select discipline" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="masterplan">Masterplan</SelectItem>
									<SelectItem value="architecture">Architecture</SelectItem>
									<SelectItem value="interior">Interior</SelectItem>
								</SelectContent>
							</Select>
						</TooltipField>

						<TooltipField label="Primary Sector" tooltip="">
							<Select value={formData['Primary Sector']} onValueChange={(value) => handleInputChange('sector', value)} required>
								<SelectTrigger>
									<SelectValue placeholder="Select sector" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="residential">Residential</SelectItem>
									<SelectItem value="education">Education</SelectItem>
									<SelectItem value="healthcare">Healthcare</SelectItem>
									<SelectItem value="infrastructure">Infrastructure</SelectItem>
									<SelectItem value="ccc">CCC</SelectItem>
									<SelectItem value="workplace">Workplace</SelectItem>
								</SelectContent>
							</Select>
						</TooltipField>

						<TooltipField label="EI Team: Paid Scope" tooltip="Does the Environmental Intelligence team have a paid scope?">
							<Select value={formData['EI Team Scope']} onValueChange={(value) => handleInputChange('eiScope', value)} required>
								<SelectTrigger>
									<SelectValue placeholder="Select scope" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="yes">Yes</SelectItem>
									<SelectItem value="no">No</SelectItem>
								</SelectContent>
							</Select>
						</TooltipField>

						<TooltipField label="External Sustainability Consultant" tooltip="Enter Company name of external sustainability consultant if one is appointed?">
							<Input value={formData['External Consultants']} onChange={(e) => handleInputChange('sustainabilityConsultant', e.target.value)} placeholder="Enter company name" required />
						</TooltipField>

						<TooltipField label="Sustainability Champion Name" tooltip="Name of the internal sustainability champion.">
							<Input
								value={formData['Sustianability Champion Name']}
								onChange={(e) => handleInputChange('sustainabilityChampion', e.target.value)}
								placeholder="Enter champion name"
								required
							/>
						</TooltipField>

						<TooltipField label="Project Type" tooltip="Is this a new build, retrofit, or extension?">
							<Select value={formData['Project Type']} onValueChange={(value) => handleInputChange('projectType', value)} required>
								<SelectTrigger>
									<SelectValue placeholder="Select project type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="new-build">New Build</SelectItem>
									<SelectItem value="retrofit">Retrofit</SelectItem>
									<SelectItem value="retrofit-extension">Retrofit + Extension</SelectItem>
								</SelectContent>
							</Select>
						</TooltipField>
					</div>

					{/* Technical Data */}
					<div className="space-y-4">
						<h3 className="font-semibold text-gray-900">Technical Data</h3>

						{(formData['Project Type'] === 'retrofit' || formData['Project Type'] === 'retrofit-extension') && (
							<TooltipField label="Existing Operational Energy (kWh/m²/year)" tooltip="Annual operational energy of the existing building (if retained).">
								<Input
									type="number"
									min="0"
									max="500"
									value={formData['Operational Energy Existing Building']}
									onChange={(e) => handleInputChange('existingOperationalEnergy', e.target.value)}
									placeholder="0-500"
								/>
							</TooltipField>
						)}

						<TooltipField label="GIA (m²)">
							<Input type="number" min="0" value={formData['GIA']} onChange={(e) => handleInputChange('GIA', e.target.value)} placeholder="Enter GIA" required />
						</TooltipField>

						<TooltipField label="PC Date (Year)" tooltip="Expected or actual practical completion year.">
							<Input type="number" value={formData['PC Date']} onChange={(e) => handleInputChange('PC Date', e.target.value)} placeholder="Enter year only" required />
						</TooltipField>

						<TooltipField label="RIBA Stage" tooltip="Current RIBA Plan of Work stage for the project.">
							<Select value={formData['Current RIBA Stage']} onValueChange={(value) => handleInputChange('Current RIBA Stage', value)} required>
								<SelectTrigger>
									<SelectValue placeholder="Select RIBA stage" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="stage-1">RIBA Stage 1</SelectItem>
									<SelectItem value="stage-2">RIBA Stage 2</SelectItem>
									<SelectItem value="stage-3">RIBA Stage 3</SelectItem>
									<SelectItem value="stage-4">RIBA Stage 4</SelectItem>
									<SelectItem value="stage-5">RIBA Stage 5</SelectItem>
									<SelectItem value="stage-6">RIBA Stage 6</SelectItem>
									<SelectItem value="stage-7">RIBA Stage 7</SelectItem>
								</SelectContent>
							</Select>
						</TooltipField>

						<TooltipField label="Upfront Carbon (kgCO₂e/m²)" tooltip="Embodied carbon for stages A1–A5">
							<Input type="number" min="0" max="1500" value={formData['Upfront Carbon']} onChange={(e) => handleInputChange('upfrontCarbon', e.target.value)} placeholder="0-1500" />
						</TooltipField>

						<TooltipField label="Total Embodied Carbon (kgCO₂e/m²)" tooltip="Total embodied carbon for life cycle stages A1–C4.">
							<Input
								type="number"
								min="0"
								max="1500"
								value={formData['Total Embodied Carbon']}
								onChange={(e) => handleInputChange('totalEmbodiedCarbon', e.target.value)}
								placeholder="0-1500"
							/>
						</TooltipField>

						<TooltipField label="Operational Energy: Total (kWh/m²/year)">
							<Input
								type="number"
								min="0"
								max="150"
								value={formData['Operational Energy Total']}
								onChange={(e) => handleInputChange('operationalEnergyTotal', e.target.value)}
								placeholder="0-150"
								required
							/>
						</TooltipField>

						<TooltipField label="Operational Energy: Gas (kWh/m²/year)">
							<Input
								type="number"
								min="0"
								max="150"
								value={formData['Operational Energy Gas']}
								onChange={(e) => handleInputChange('operationalEnergyGas', e.target.value)}
								placeholder="0-150"
								required
							/>
						</TooltipField>
					</div>

					{/* Energy & Environmental Data */}
					<div className="space-y-4">
						<h3 className="font-semibold text-gray-900">Energy & Environmental</h3>

						<TooltipField label="Space Heating Demand (kWh/m²/year)">
							<Input
								type="number"
								min="0"
								max="150"
								value={formData['Space Heating Demand']}
								onChange={(e) => handleInputChange('spaceHeatingDemand', e.target.value)}
								placeholder="0-150"
								required
							/>
						</TooltipField>

						<TooltipField label="Renewable Energy Generation (kWh/m²/year)">
							<Input
								type="number"
								min="0"
								max="150"
								value={formData['Total Renewable Energy Generation']}
								onChange={(e) => handleInputChange('renewableEnergyGeneration', e.target.value)}
								placeholder="0-150"
								required
							/>
						</TooltipField>

						<TooltipField label="Biodiversity Net Gain (%)" tooltip="Predicted Biodiversity Net Gain percentage.">
							<Input
								type="number"
								min="0"
								max="200"
								value={formData['Biodiversity Net Gain']}
								onChange={(e) => handleInputChange('biodiversityNetGain', e.target.value)}
								placeholder="Up to 200%"
							/>
						</TooltipField>

						<TooltipField label="Habitat Units Gained" tooltip="Number of habitat units gained.">
							<Input
								type="number"
								min="0"
								max="50"
								value={formData['Habitats Units Gained']}
								onChange={(e) => handleInputChange('habitatUnitsGained', e.target.value)}
								placeholder="0-50"
							/>
						</TooltipField>

						<TooltipField label="Urban Greening Factor" tooltip="Urban Greening Factor score, if applicable.">
							<Input
								type="number"
								min="0"
								max="10"
								step="0.1"
								value={formData['Urban Greening Factor']}
								onChange={(e) => handleInputChange('urbanGreeningFactor', e.target.value)}
								placeholder="0-10"
							/>
						</TooltipField>
					</div>

					{/* Certifications */}
					<div className="space-y-4 md:col-span-2 lg:col-span-3">
						<h3 className="font-semibold text-gray-900">Certifications</h3>

						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
							<TooltipField label="BREEAM">
								<Select value={formData['BREEAM']} onValueChange={(value) => handleInputChange('breeam', value)} required>
									<SelectTrigger>
										<SelectValue placeholder="Select rating" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="not-targetted">Not Targetted</SelectItem>
										<SelectItem value="to-be-determined">To Be Determined</SelectItem>
										<SelectItem value="outstanding">Outstanding</SelectItem>
										<SelectItem value="excellent">Excellent</SelectItem>
										<SelectItem value="very-good">Very Good</SelectItem>
										<SelectItem value="good">Good</SelectItem>
										<SelectItem value="pass">Pass</SelectItem>
										<SelectItem value="unclassified">Unclassified</SelectItem>
									</SelectContent>
								</Select>
							</TooltipField>

							<TooltipField label="LEED">
								<Select value={formData['LEED']} onValueChange={(value) => handleInputChange('leed', value)} required>
									<SelectTrigger>
										<SelectValue placeholder="Select rating" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="not-targetted">Not Targetted</SelectItem>
										<SelectItem value="to-be-determined">To Be Determined</SelectItem>
										<SelectItem value="platinum">Platinum</SelectItem>
										<SelectItem value="gold">Gold</SelectItem>
										<SelectItem value="silver">Silver</SelectItem>
										<SelectItem value="certified">Certified</SelectItem>
									</SelectContent>
								</Select>
							</TooltipField>

							<TooltipField label="WELL">
								<Select value={formData['WELL']} onValueChange={(value) => handleInputChange('well', value)} required>
									<SelectTrigger>
										<SelectValue placeholder="Select rating" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="not-targetted">Not Targetted</SelectItem>
										<SelectItem value="to-be-determined">To Be Determined</SelectItem>
										<SelectItem value="yes">Yes</SelectItem>
									</SelectContent>
								</Select>
							</TooltipField>

							<TooltipField label="NABERS">
								<Select value={formData['NABERS']} onValueChange={(value) => handleInputChange('nabers', value)} required>
									<SelectTrigger>
										<SelectValue placeholder="Select rating" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="not-targetted">Not Targetted</SelectItem>
										<SelectItem value="to-be-determined">To Be Determined</SelectItem>
										<SelectItem value="yes">Yes</SelectItem>
									</SelectContent>
								</Select>
							</TooltipField>

							<TooltipField label="Passivhaus or EnePHit">
								<Select value={formData['Passivhaus or EnePHit']} onValueChange={(value) => handleInputChange('passivhausOrEnephit', value)} required>
									<SelectTrigger>
										<SelectValue placeholder="Select rating" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="not-targetted">Not Targetted</SelectItem>
										<SelectItem value="to-be-determined">To Be Determined</SelectItem>
										<SelectItem value="yes">Yes</SelectItem>
									</SelectContent>
								</Select>
							</TooltipField>

							<TooltipField label="UKNZCBS">
								<Select value={formData['UKNZCBS']} onValueChange={(value) => handleInputChange('uknzcbs', value)} required>
									<SelectTrigger>
										<SelectValue placeholder="Select rating" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="not-targetted">Not Targetted</SelectItem>
										<SelectItem value="to-be-determined">To Be Determined</SelectItem>
										<SelectItem value="yes">Yes</SelectItem>
									</SelectContent>
								</Select>
							</TooltipField>
						</div>
					</div>
				</div>

				<div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save Project Data</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
