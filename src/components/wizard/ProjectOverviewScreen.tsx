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

interface ProjectOverviewScreenProps {
  selectedProject?: Project;
  projectData: any;
  onDataUpdate: (data: any) => void;
  onSave: () => void;
  onSaveAndExit: () => void;
  onCancel: () => void;
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

export const ProjectOverviewScreen = ({
  selectedProject,
  projectData,
  onDataUpdate,
  onSave,
  onSaveAndExit,
  onCancel
}: ProjectOverviewScreenProps) => {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

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
    <div className="max-h-[75vh] overflow-y-auto space-y-6">
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

        {/* Footer buttons within scrollable area */}
        <div className="pt-6 border-t">
          <div className="flex justify-between">
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  Cancel
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Are you sure you want to cancel?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    All unsaved work will be lost.
                  </AlertDialogDescription>
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
                  <Button variant="outline">
                    Save
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Project data saved successfully</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={() => { onSave(); setShowSaveDialog(false); }}>OK</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                <AlertDialogTrigger asChild>
                  <Button>
                    Save & Exit
                  </Button>
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
    </div>
  );
};