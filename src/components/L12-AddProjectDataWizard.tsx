import { useState } from 'react';
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project, StageKey, StageKeys } from '@/types/project';
import { ProjectSelectionScreen } from './AddProjectWizard/P00-Selection';
import { ProjectOverviewScreen } from './AddProjectWizard/P11-Overview';
import { CertificationsScreen } from './AddProjectWizard/P12-Certifications';
import { RibaStageScreen } from './AddProjectWizard/P13-RibaStage';

interface AddProjectDataWizardProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: WizardData) => void;
	projects: Project[];
}

export type WizardStep = 'project-selection' | 'project-overview' | 'certifications' | 'riba-1' | 'riba-2' | 'riba-3' | 'riba-4' | 'riba-5' | 'riba-6' | 'riba-7';

export interface WizardData {
	selectedProjectId: string;
	projectData: {
		// Section B - Project Overview (user input)

		'Operational Energy Existing Building'?: string;
		'GIA'?: string;
		'Building Lifespan'?: string;
		'PC Date'?: string;

		'EI Team Scope'?: string;
		'External Consultants'?: string;
		'Sustianability Champion Name'?: string;
		'Mission Statement'?: string;

		'BREEAM': string;
		'LEED': string;
		'WELL': string;
		'Fitwell'?: string;
		'Passivhaus or EnePHit': string;
		'UKNZCBS'?: string;
		'NABERS': string;
		'Other Cerification'?: string;

		'Current RIBA Stage': string;
	};
	'RIBA Stage': {
		[key: string]: {
			// Stage-specific data
			'Updated GIA'?: string;
			'Method Energy Measurement'?: string;

			'Operational Energy Total': string;
			'Operational Energy Part L': string;
			'Operational Energy Gas': string;

			'Space Heating Demand': string;
			'Renewable Energy Type'?: string;
			'Total Renewable Energy Generation': string;
			'Structural Frame Materials'?: string;

			'Upfront Carbon': string;
			'Total Embodied Carbon': string;
			'Biogenic Carbon'?: string;
			'Embodied Carbon Scope Clarifications'?: string;

			'Biodiversity Net Gain': string;
			'Habitats Units Gained': string;
			'Urban Greening Factor': string;
			'General Biodiversity Clarification Notes'?: string;
		};
	};
}

export const AddProjectDataWizard = ({ isOpen, onClose, onSave, projects }: AddProjectDataWizardProps) => {
	const [currentStep, setCurrentStep] = useState<WizardStep>('project-selection');
	const [activeTab, setActiveTab] = useState<string>('project-overview');
	const [wizardData, setWizardData] = useState<WizardData>({
		selectedProjectId: '',
		projectData: {
			'Operational Energy Existing Building': '',
			'GIA': '',
			'Building Lifespan': '',
			'PC Date': '',

			'EI Team Scope': '',
			'External Consultants': '',
			'Sustianability Champion Name': '',
			'Mission Statement': '',

			'BREEAM': '',
			'LEED': '',
			'WELL': '',
			'Fitwell': '',
			'Passivhaus or EnePHit': '',
			'UKNZCBS': '',
			'NABERS': '',
			'Other Cerification': '',

			'Current RIBA Stage': '',
		},
		'RIBA Stage': {},
	});

	// Reset wizard to initial state when dialog opens
	const resetWizard = () => {
		setCurrentStep('project-selection');
		setActiveTab('project-overview');
		setWizardData({
			selectedProjectId: '',
			projectData: {
				'Operational Energy Existing Building': '',
				'GIA': '',
				'Building Lifespan': '',
				'PC Date': '',

				'EI Team Scope': '',
				'External Consultants': '',
				'Sustianability Champion Name': '',
				'Mission Statement': '',

				'BREEAM': '',
				'LEED': '',
				'WELL': '',
				'Fitwell': '',
				'Passivhaus or EnePHit': '',
				'UKNZCBS': '',
				'NABERS': '',
				'Other Cerification': '',

				'Current RIBA Stage': '',
			},
			'RIBA Stage': {},
		});
	};

	// Reset when dialog opens
	React.useEffect(() => {
		if (isOpen) {
			resetWizard();
		}
	}, [isOpen]);

	// Helper function to populate wizard data with existing project data
	const populateWizardDataFromProject = (projectId: string) => {
		const project = projects.find((p) => p.id === projectId);
		if (!project) return;

		// Map certification values to wizard format
		const mapCertificationValue = (value: string) => {
			if (!value || value === 'N/A') return '';
			return value.toLowerCase().replace(' ', '-');
		};

		const updatedProjectData = {
			...wizardData.projectData,

			'Operational Energy Existing Building': project['Operational Energy Existing Building']?.toString() || '',
			'GIA': project['GIA']?.toString() || '',
			'PC Date': project['PC Date'] ? new Date(project['PC Date']).getFullYear().toString() : '',

			'BREEAM': mapCertificationValue(project['BREEAM'] || ''),
			'LEED': mapCertificationValue(project['LEED'] || ''),
			'WELL': mapCertificationValue(project['WELL'] || ''),
			'Passivhaus or EnePHit': project['Passivhaus or EnePHit'] ? 'passivhaus' : '',
			'NABERS': project['NABERS']?.includes('Star') ? 'yes' : '',
		};

		const mapStageData = (stage: Project['RIBA Stage'][StageKey]) => ({
			'Updated GIA': stage?.['Updated GIA']?.toString() || '',
			'Method Energy Measurement': stage?.['Method Energy Measurement']?.toString() || '',

			'Operational Energy Total': stage?.['Operational Energy Total']?.toString() || '',
			'Operational Energy Part L': stage?.['Operational Energy Part L']?.toString() || '',
			'Operational Energy Gas': stage?.['Operational Energy Gas']?.toString() || '',

			'Space Heating Demand': stage?.['Space Heating Demand']?.toString() || '',
			'Renewable Energy Type': stage?.['Renewable Energy Type'] || '',
			'Total Renewable Energy Generation': stage?.['Total Renewable Energy Generation']?.toString() || '',
			'Structural Frame Materials': stage?.['Structural Frame Materials'] || '',

			'Upfront Carbon': stage?.['Upfront Carbon']?.toString() || '',
			'Total Embodied Carbon': stage?.['Total Embodied Carbon']?.toString() || '',
			'Biogenic Carbon': stage?.['Biogenic Carbon']?.toString() || '',
			'Embodied Carbon Scope Clarifications': stage?.['Embodied Carbon Scope Clarifications'] || '',

			'Biodiversity Net Gain': stage?.['Biodiversity Net Gain']?.toString() || '',
			'Habitats Units Gained': stage?.['Habitats Units Gained']?.toString() || '',
			'Urban Greening Factor': stage?.['Urban Greening Factor']?.toString() || '',
			'General Biodiversity Clarification Notes': stage?.['General Biodiversity Clarification Notes'] || '',
		});

		// Build all stages dynamically
		const ribaStagesData: WizardData['RIBA Stage'] = StageKeys.reduce((acc, key) => {
			acc[key] = mapStageData(project['RIBA Stage']?.[key]);
			return acc;
		}, {} as WizardData['RIBA Stage']);

		setWizardData((prev) => ({
			...prev,
			selectedProjectId: projectId,
			projectData: updatedProjectData,
			'RIBA Stage': {
				...prev['RIBA Stage'],
				...ribaStagesData,
			},
		}));

		// Move to tabbed interface after project selection
		setCurrentStep('project-overview');
	};

	const updateWizardData = (updates: Partial<WizardData>) => {
		setWizardData((prev) => ({ ...prev, ...updates }));
	};

	const handleProjectSelect = (projectId: string) => {
		populateWizardDataFromProject(projectId);
	};

	const handleSave = () => {
		console.log('Saving data for current tab:', activeTab);
		// Individual save without closing
	};

	const handleSaveAndExit = () => {
		onSave(wizardData);
		resetWizard();
		onClose();
	};

	const handleCancel = () => {
		resetWizard();
		onClose();
	};

	const selectedProject = projects.find((p) => p.id === wizardData.selectedProjectId);

	const renderCurrentStep = () => {
		if (currentStep === 'project-selection') {
			return (
				<ProjectSelectionScreen
					projects={projects}
					selectedProjectId={wizardData.selectedProjectId}
					onProjectSelect={handleProjectSelect}
					onNext={() => setCurrentStep('project-overview')}
					onCancel={onClose}
				/>
			);
		}

		// Tabbed interface for all other steps
		return (
			<div className="space-y-4">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">Project Data - {selectedProject?.['Project Name']}</DialogTitle>
				</DialogHeader>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full h-12 grid-cols-9">
						<TabsTrigger value="project-overview" className="text-center">
							<div className="flex flex-col">
								<span>Overview</span>
							</div>
						</TabsTrigger>
						<TabsTrigger value="certifications" className="text-center">
							<div className="flex flex-col">
								<span>Certifications</span>
							</div>
						</TabsTrigger>
						<TabsTrigger value="1" className="text-center">
							<div className="flex flex-col">
								<span>1</span>
							</div>
						</TabsTrigger>
						<TabsTrigger value="2" className="text-center">
							<div className="flex flex-col">
								<span>2</span>
							</div>
						</TabsTrigger>
						<TabsTrigger value="3" className="text-center">
							<div className="flex flex-col">
								<span>3</span>
							</div>
						</TabsTrigger>
						<TabsTrigger value="4" className="text-center">
							<div className="flex flex-col">
								<span>4</span>
							</div>
						</TabsTrigger>
						<TabsTrigger value="5" className="text-center">
							<div className="flex flex-col">
								<span>5</span>
							</div>
						</TabsTrigger>
						<TabsTrigger value="6" className="text-center">
							<div className="flex flex-col">
								<span>6</span>
							</div>
						</TabsTrigger>
						<TabsTrigger value="7" className="text-center">
							<div className="flex flex-col">
								<span>7</span>
							</div>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="project-overview">
						<ProjectOverviewScreen
							selectedProject={selectedProject}
							projectData={wizardData.projectData}
							onDataUpdate={(data) => updateWizardData({ projectData: data })}
							onSave={handleSave}
							onSaveAndExit={handleSaveAndExit}
							onCancel={handleCancel}
						/>
					</TabsContent>

					<TabsContent value="certifications">
						<CertificationsScreen
							projectData={wizardData.projectData}
							onDataUpdate={(data) => updateWizardData({ projectData: data })}
							onSave={handleSave}
							onSaveAndExit={handleSaveAndExit}
							onCancel={handleCancel}
						/>
					</TabsContent>

					{StageKeys.map((stage) => (
						<TabsContent key={stage} value={stage}>
							<RibaStageScreen
								stageNumber={stage.split('-')[1]}
								stageData={wizardData['RIBA Stage'][stage] || {}}
								projectGia={wizardData.projectData['GIA']}
								onDataUpdate={(data) => {
									const updatedRibaStages = {
										...wizardData['RIBA Stage'],
										[stage]: data,
									};
									updateWizardData({
										'RIBA Stage': updatedRibaStages,
									});
								}}
								onSave={handleSave}
								onSaveAndExit={handleSaveAndExit}
								onCancel={handleCancel}
								currentStep={stage as WizardStep}
								completedSteps={[]}
								stageCompletionData={{
									'riba-1': {
										completed: true,
										date: '10.01.2025',
									},
									'riba-2': {
										completed: true,
										date: '12.06.2025',
									},
								}}
							/>
						</TabsContent>
					))}
				</Tabs>
			</div>
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={() => {}}>
			<DialogContent className="max-w-4xl max-h-[90vh]" hideCloseButton={true} preventOutsideClick={true}>
				{renderCurrentStep()}
			</DialogContent>
		</Dialog>
	);
};
