import { useState } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { Project } from '@/types/project';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { WizardProgressIndicator } from './WizardProgressIndicator';

interface ProjectDataScreenProps {
  selectedProject?: Project;
  projectData: any;
  onDataUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveAndExit: () => void;
}

const TooltipField = ({ label, tooltip, required = false, children }: {
  label: string;
  tooltip?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
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

export const ProjectDataScreen = ({
  selectedProject,
  projectData,
  onDataUpdate,
  onNext,
  onBack,
  onSaveAndExit
}: ProjectDataScreenProps) => {
  const [showExitDialog, setShowExitDialog] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    onDataUpdate({
      ...projectData,
      [field]: value
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i - 5);

  if (!selectedProject) {
    return null;
  }

  return (
    <div className="max-h-[85vh] overflow-y-auto space-y-6">
      {/* Sticky header */}
      <div className="sticky top-0 bg-background z-10 pb-4 border-b">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Project Data</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <WizardProgressIndicator 
            currentStep="project-data"
            completedSteps={['project-selection']}
          />
        </div>
      </div>

      {/* Content area */}
      <div className="space-y-6">
        {/* Project Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">
            Project Information
          </h3>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 bg-muted/30 p-4 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Project Name & Number</Label>
              <p className="text-sm text-muted-foreground mt-1">{selectedProject.name}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Project Location</Label>
              <p className="text-sm text-muted-foreground mt-1">{selectedProject.location}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Typology</Label>
              <p className="text-sm text-muted-foreground mt-1">{selectedProject.typology}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Project Type</Label>
              <p className="text-sm text-muted-foreground mt-1">{selectedProject.projectType}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Current RIBA Stage</Label>
              <p className="text-sm text-muted-foreground mt-1">{selectedProject.ribaStage}</p>
            </div>
          </div>
        </div>

        {/* Section B - Project Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">
            Section B - Project Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TooltipField
              label="Year project commenced or will be completed"
              tooltip="When did or will the project commence/complete?"
              required={true}
            >
              <Select
                value={projectData.pcYear || ''}
                onValueChange={(value) => handleInputChange('pcYear', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="Operational energy of existing building"
              tooltip="If there is an existing building, what is the operational energy use?"
            >
              <Input
                placeholder="Enter kWh/m²/yr (e.g. 75)"
                value={projectData.operationalEnergyExisting || ''}
                onChange={(e) => handleInputChange('operationalEnergyExisting', e.target.value)}
                type="number"
                min="0"
                max="300"
              />
            </TooltipField>

            <TooltipField
              label="GIA (Gross Internal Area)"
              tooltip="Enter the total gross internal floor area in square metres"
              required={true}
            >
              <Input
                placeholder="Enter m² (e.g. 6,500)"
                value={projectData.gia || ''}
                onChange={(e) => handleInputChange('gia', e.target.value)}
                type="number"
                min="1"
              />
            </TooltipField>

            <TooltipField
              label="Building lifespan"
              tooltip="Enter the anticipated building lifespan"
              required={true}
            >
              <Select
                value={projectData.buildingLifespan || ''}
                onValueChange={(value) => handleInputChange('buildingLifespan', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lifespan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 years</SelectItem>
                  <SelectItem value="100">100 years</SelectItem>
                  <SelectItem value="120">120 years</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="Project paid scope"
              tooltip="What is the project paid scope?"
              required={true}
            >
              <Select
                value={projectData.paidScope || ''}
                onValueChange={(value) => handleInputChange('paidScope', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="architecture-only">Architecture only</SelectItem>
                  <SelectItem value="full-design-team">Full design team</SelectItem>
                  <SelectItem value="partial-services">Partial services</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="External sustainability consultant"
              tooltip="Is there an external sustainability consultant on the project?"
            >
              <Select
                value={projectData.sustainabilityConsultant || ''}
                onValueChange={(value) => handleInputChange('sustainabilityConsultant', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="Sustainability champion"
              tooltip="Is there a sustainability champion on the project?"
            >
              <Select
                value={projectData.sustainabilityChampion || ''}
                onValueChange={(value) => handleInputChange('sustainabilityChampion', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>
          </div>

          <TooltipField
            label="Mission statement"
            tooltip="Add a brief project mission statement relating to sustainability"
          >
            <Textarea
              placeholder="Enter mission statement"
              value={projectData.missionStatement || ''}
              onChange={(e) => handleInputChange('missionStatement', e.target.value)}
              maxLength={300}
              className="resize-none"
            />
          </TooltipField>
        </div>

        {/* Section C - Certifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">
            Section C - Certifications
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TooltipField
              label="BREEAM"
              tooltip="Select BREEAM certification level if applicable"
            >
              <Select
                value={projectData.breeam || ''}
                onValueChange={(value) => handleInputChange('breeam', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="pass">Pass</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="very-good">Very Good</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="outstanding">Outstanding</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="LEED"
              tooltip="Select LEED certification level if applicable"
            >
              <Select
                value={projectData.leed || ''}
                onValueChange={(value) => handleInputChange('leed', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="certified">Certified</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="WELL"
              tooltip="Select WELL certification level if applicable"
            >
              <Select
                value={projectData.well || ''}
                onValueChange={(value) => handleInputChange('well', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="Fitwel"
              tooltip="Select Fitwel certification level if applicable"
            >
              <Select
                value={projectData.fitwel || ''}
                onValueChange={(value) => handleInputChange('fitwel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="1-star">1 Star</SelectItem>
                  <SelectItem value="2-star">2 Star</SelectItem>
                  <SelectItem value="3-star">3 Star</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="Passivhaus"
              tooltip="Select Passivhaus certification if applicable"
            >
              <Select
                value={projectData.passivhaus || ''}
                onValueChange={(value) => handleInputChange('passivhaus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="passivhaus">Passivhaus</SelectItem>
                  <SelectItem value="enerphit">EnerPHit</SelectItem>
                  <SelectItem value="plus">Plus</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="UK Net Zero Carbon Buildings Standard"
              tooltip="Select UK NZCBS certification if applicable"
            >
              <Select
                value={projectData.uknzcbs || ''}
                onValueChange={(value) => handleInputChange('uknzcbs', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="net-zero-carbon">Net Zero Carbon</SelectItem>
                  <SelectItem value="net-zero-carbon-ready">Net Zero Carbon Ready</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="NABERS"
              tooltip="Select NABERS rating if applicable"
            >
              <Select
                value={projectData.nabers || ''}
                onValueChange={(value) => handleInputChange('nabers', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>
          </div>

          <TooltipField
            label="Other certification"
            tooltip="Enter any other relevant certifications"
          >
            <Input
              placeholder="Enter other certifications"
              value={projectData.otherCertification || ''}
              onChange={(e) => handleInputChange('otherCertification', e.target.value)}
            />
          </TooltipField>
        </div>

        {/* Footer buttons within scrollable area */}
        <div className="pt-6 border-t">
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            
            <div className="flex gap-2">
              <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    Save & Exit
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Save Progress and Exit?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to save your progress and exit. All information will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, go back</AlertDialogCancel>
                    <AlertDialogAction onClick={onSaveAndExit}>Yes, Save & Exit</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button onClick={onNext}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};