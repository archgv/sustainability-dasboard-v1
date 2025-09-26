import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { Project } from '@/components/Key/project';
import { WizardData } from '../L11-AddWizard';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProjectOverviewProps {
	selectedProject?: Project;
	projectData: WizardData['projectData'];
	onDataUpdate: (data: WizardData['projectData']) => void;
	onSave: () => void;
	onSaveAndExit: () => void;
	onCancel: () => void;
}

const TooltipField = ({ label, tooltip, required = false, children }: { label: string; tooltip?: string; required?: boolean; children: React.ReactNode }) => (
	<div className="space-y-2">
		<div className="flex items-center gap-2">
			<Label className="text-sm font-medium">
				{label} {required && <span className="text-destructive">*</span>}
			</Label>
			{tooltip && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
						</TooltipTrigger>
						<TooltipContent className="max-w-xs">
							<p>{tooltip}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
		{children}
	</div>
);

export const AddOverview = ({ selectedProject, projectData, onDataUpdate, onSave, onSaveAndExit, onCancel }: ProjectOverviewProps) => {
	const [showExitDialog, setShowExitDialog] = useState(false);
	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [showSaveDialog, setShowSaveDialog] = useState(false);

	const handleInputChange = (field: string, value: string) => {
		onDataUpdate({
			...projectData,
			[field]: value,
		});
	};

	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 20 }, (_, i) => currentYear + i - 5);

	if (!selectedProject) {
		return null;
	}

	return (
		<div className="flex flex-col h-full max-h-[70vh]">
			{/* Scrollable content area */}
			<div className="flex-1 overflow-y-auto space-y-6 pr-2">
				{/* Project Information */}
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-x-8 gap-y-4 bg-muted/30 p-4 rounded-lg">
						<div>
							<Label className="text-sm font-medium">Project Location</Label>
							<p className="text-sm text-muted-foreground mt-1">{selectedProject['Project Location']}</p>
						</div>

						<div>
							<Label className="text-sm font-medium">Primary sector</Label>
							<p className="text-sm text-muted-foreground mt-1">{selectedProject['Primary Sector']}</p>
						</div>

						<div>
							<Label className="text-sm font-medium">Sub sector</Label>
							<p className="text-sm text-muted-foreground mt-1">{selectedProject['Sub Sector']}</p>
						</div>

						<div>
							<Label className="text-sm font-medium">Project Type</Label>
							<p className="text-sm text-muted-foreground mt-1">{selectedProject['Project Type']}</p>
						</div>

						<div>
							<Label className="text-sm font-medium">Heritage project</Label>
							<p className="text-sm text-muted-foreground mt-1">{selectedProject['Heritage Project']}</p>
						</div>

						<div>
							<Label className="text-sm font-medium">Studio discipline</Label>
							<p className="text-sm text-muted-foreground mt-1">{selectedProject['Studio Discipline']}</p>
						</div>

						<div>
							<Label className="text-sm font-medium">Neighbourhood</Label>
							<p className="text-sm text-muted-foreground mt-1">{selectedProject['Neighbourhood']}</p>
						</div>

						<div>
							<Label className="text-sm font-medium">Current RIBA Stage</Label>
							<p className="text-sm text-muted-foreground mt-1">{selectedProject['Current RIBA Stage']}</p>
						</div>
					</div>
				</div>

				{/* Project Overview */}
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<TooltipField
							label="PC year"
							tooltip="Enter the expected or actual Practical Completion year. Please be as accurate as possible, as UKNZCBS benchmarks are year-specific"
							required={true}
						>
							<Select value={projectData['PC Date'] || ''} onValueChange={(value) => handleInputChange('PC Date', value)}>
								<SelectTrigger>
									<SelectValue placeholder="Select year" />
								</SelectTrigger>
								<SelectContent>
									{years.map((year) => (
										<SelectItem key={year} value={year.toString()}>
											{year}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</TooltipField>

						<TooltipField label="Operational energy of existing building" tooltip="Enter the annual operational energy of the existing building (if retained)">
							<div className="relative">
								<Input
									placeholder="Enter kWh/m²/yr (e.g. 130 kWh/m²/yr)"
									value={projectData['Operational Energy Existing Building'] || ''}
									onChange={(e) => handleInputChange('operationalEnergyExisting', e.target.value)}
									type="number"
									min="0"
									max="500"
									className="pr-20"
								/>
								<div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">kWh/m²/yr</div>
							</div>
						</TooltipField>

						<TooltipField label="GIA of proposed development" tooltip="Enter the Gross Internal Area (GIA) of the proposed development" required={true}>
							<div className="relative">
								<Input
									placeholder="Enter m² (e.g. 9,800 m²)"
									value={projectData['GIA'] || ''}
									onChange={(e) => handleInputChange('gia', e.target.value)}
									type="number"
									min="1"
									className="pr-12"
								/>
								<div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">m²</div>
							</div>
						</TooltipField>

						<TooltipField label="Building lifespan" tooltip="Enter the anticipated building lifespan" required={true}>
							<Select value={projectData['Building Lifespan'] || ''} onValueChange={(value) => handleInputChange('buildingLifespan', value)}>
								<SelectTrigger>
									<SelectValue placeholder="Enter years (e.g. 60)" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="60">60 years</SelectItem>
									<SelectItem value="100">100 years</SelectItem>
									<SelectItem value="120">120 years</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>
						</TooltipField>

						<TooltipField label="EI team: paid scope" tooltip="Indicate whether the Environmental Intelligence team has a paid scope" required={true}>
							<Select value={projectData['EI Team Scope'] || ''} onValueChange={(value) => handleInputChange('paidScope', value)}>
								<SelectTrigger>
									<SelectValue placeholder="Select scope" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="yes">Yes</SelectItem>
									<SelectItem value="no">No</SelectItem>
								</SelectContent>
							</Select>
						</TooltipField>

						<TooltipField label="Sustainability consultant" tooltip="Enter the company name of the appointed external sustainability consultant (if applicable)">
							<Input placeholder="Enter company name" value={projectData['External Consultants'] || ''} onChange={(e) => handleInputChange('sustainabilityConsultant', e.target.value)} />
						</TooltipField>

						<TooltipField label="H&B Sustainability champion" tooltip="Enter the name of the internal sustainability champion on the project team (not a member of the EI team)">
							<Select value={projectData['Sustianability Champion Name'] || ''} onValueChange={(value) => handleInputChange('sustainabilityChampion', value)}>
								<SelectTrigger>
									<SelectValue placeholder="Select name" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="person1">Person 1</SelectItem>
									<SelectItem value="person2">Person 2</SelectItem>
									<SelectItem value="person3">Person 3</SelectItem>
								</SelectContent>
							</Select>
						</TooltipField>
					</div>

					<TooltipField label="Mission statement" tooltip="Add a brief project mission statement relating to sustainability">
						<Textarea
							placeholder="Enter text (max 250 characters)"
							value={projectData['Mission Statement'] || ''}
							onChange={(e) => handleInputChange('missionStatement', e.target.value)}
							maxLength={250}
							className="resize-none"
						/>
					</TooltipField>
				</div>
			</div>

			{/* Fixed footer buttons */}
			<div className="pt-4 border-t bg-background">
				<div className="flex justify-between">
					<AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
						<AlertDialogTrigger asChild>
							<Button variant="outline">Cancel</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle className="flex items-center gap-2">
									<AlertTriangle className="h-5 w-5 text-amber-500" />
									Are you sure you want to cancel?
								</AlertDialogTitle>
								<AlertDialogDescription>All unsaved work will be lost.</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Keep editing</AlertDialogCancel>
								<AlertDialogAction onClick={onCancel}>Discard changes and exit</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>

					<div className="flex gap-2">
						<AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
							<AlertDialogTrigger asChild>
								<Button variant="outline">Save</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Project data saved successfully</AlertDialogTitle>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogAction
										onClick={() => {
											onSave();
											setShowSaveDialog(false);
										}}
									>
										OK
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						<AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
							<AlertDialogTrigger asChild>
								<Button>Save & Exit</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle className="flex items-center gap-2">
										<AlertTriangle className="h-5 w-5 text-amber-500" />
										Save progress and exit?
									</AlertDialogTitle>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Keep editing</AlertDialogCancel>
									<AlertDialogAction onClick={onSaveAndExit}>Yes, Save & Exit</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</div>
		</div>
	);
};
