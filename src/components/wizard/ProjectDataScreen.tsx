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
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">Project Data</DialogTitle>
      </DialogHeader>

      <WizardProgressIndicator 
        currentStep="project-data"
        completedSteps={['project-selection']}
      />

      <div className="space-y-6">
        {/* Project Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">
            Project Information
          </h3>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 bg-muted/30 p-4 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Project Name & Number</Label>
              <Input value={`${selectedProject.id} - ${selectedProject.name}`} disabled className="mt-2" />
            </div>
            <div></div>
            
            <div>
              <Label className="text-sm font-medium">Location</Label>
              <Input value={selectedProject.location || 'N/A'} disabled className="mt-2" />
            </div>
            <div>
              <Label className="text-sm font-medium">Project Type</Label>
              <Input value="N/A" disabled className="mt-2" />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Primary Sector</Label>
              <Input value={selectedProject.typology || 'N/A'} disabled className="mt-2" />
            </div>
            <div>
              <Label className="text-sm font-medium">Heritage Project</Label>
              <Input value="N/A" disabled className="mt-2" />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Sub Sector</Label>
              <Input value="N/A" disabled className="mt-2" />
            </div>
            <div>
              <Label className="text-sm font-medium">Studio Discipline</Label>
              <Input value="N/A" disabled className="mt-2" />
            </div>
            
            <div></div>
            <div>
              <Label className="text-sm font-medium">Neighbourhood</Label>
              <Input value="N/A" disabled className="mt-2" />
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">
            Project Overview
          </h3>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <TooltipField
              label="Operational energy of existing building"
              tooltip="Enter the annual operational energy of the existing building (if retained)"
            >
              <Input
                placeholder="Enter kWh/m²/yr (e.g. 130)"
                value={projectData.operationalEnergyExisting}
                onChange={(e) => handleInputChange('operationalEnergyExisting', e.target.value)}
                type="number"
                min="0"
                max="500"
              />
            </TooltipField>

            <TooltipField
              label="EI team: Paid scope"
              tooltip="Indicate whether the Environmental Intelligence team has a paid scope"
              required
            >
              <Select
                value={projectData.paidScope}
                onValueChange={(value) => handleInputChange('paidScope', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="tbc">TBC</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="GIA of proposed development"
              tooltip="Enter the Gross Internal Area (GIA) of the proposed development"
              required
            >
              <Input
                placeholder="Enter m² (e.g. 9,800)"
                value={projectData.gia}
                onChange={(e) => handleInputChange('gia', e.target.value)}
                type="number"
                min="1"
              />
            </TooltipField>

            <TooltipField
              label="External Sustainability consultant"
              tooltip="Enter the company name of the appointed external sustainability consultant (if applicable)"
            >
              <Input
                placeholder="Enter company name"
                value={projectData.sustainabilityConsultant}
                onChange={(e) => handleInputChange('sustainabilityConsultant', e.target.value)}
              />
            </TooltipField>

            <TooltipField
              label="Building lifespan"
              required
            >
              <Input
                placeholder="Enter years (e.g. 60)"
                value={projectData.buildingLifespan}
                onChange={(e) => handleInputChange('buildingLifespan', e.target.value)}
                type="number"
                min="1"
              />
            </TooltipField>

            <TooltipField
              label="H\B Sustainability champion"
              tooltip="Enter the name of the internal sustainability champion on the project team (not a member of the EI team)"
            >
              <Input
                placeholder="Select name"
                value={projectData.sustainabilityChampion}
                onChange={(e) => handleInputChange('sustainabilityChampion', e.target.value)}
              />
            </TooltipField>

            <TooltipField
              label="PC date"
              tooltip="Enter the expected or actual Practical Completion year. Please be as accurate as possible, as UKNZCBS benchmarks are year-specific"
              required
            >
              <Select
                value={projectData.pcYear}
                onValueChange={(value) => handleInputChange('pcYear', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipField>

            <div></div>

            <div className="col-span-2">
              <TooltipField
                label="Mission statement"
              >
                <Textarea
                  placeholder="Enter text (max 250 characters)"
                  value={projectData.missionStatement}
                  onChange={(e) => handleInputChange('missionStatement', e.target.value)}
                  maxLength={250}
                  className="resize-none"
                />
              </TooltipField>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground border-b pb-2">
          Certifications
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TooltipField
            label="BREEAM"
            tooltip="Select status or the targeted BREEAM rating"
            required
          >
            <Select
              value={projectData.breeam}
              onValueChange={(value) => handleInputChange('breeam', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-targeted">Not targeted</SelectItem>
                <SelectItem value="to-be-determined">To be determined</SelectItem>
                <SelectItem value="outstanding">Outstanding</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="very-good">Very Good</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="unclassified">Unclassified</SelectItem>
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="LEED"
            tooltip="Select status or the targeted LEED rating"
            required
          >
            <Select
              value={projectData.leed}
              onValueChange={(value) => handleInputChange('leed', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-targeted">Not targeted</SelectItem>
                <SelectItem value="to-be-determined">To be determined</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="certified">Certified</SelectItem>
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="WELL"
            tooltip="Select status or the targeted WELL rating"
            required
          >
            <Select
              value={projectData.well}
              onValueChange={(value) => handleInputChange('well', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-targeted">Not targeted</SelectItem>
                <SelectItem value="to-be-determined">To be determined</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="Fitwel"
            tooltip="Select status or the targeted Fitwel rating"
            required
          >
            <Select
              value={projectData.fitwel}
              onValueChange={(value) => handleInputChange('fitwel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-certified">Not certified</SelectItem>
                <SelectItem value="1-star">1 star</SelectItem>
                <SelectItem value="2-stars">2 stars</SelectItem>
                <SelectItem value="3-stars">3 stars</SelectItem>
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="Passivhaus or EnePHit"
            tooltip="Indicate if targeting Passivhaus or EnePHit"
            required
          >
            <Select
              value={projectData.passivhaus}
              onValueChange={(value) => handleInputChange('passivhaus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Indicate if targeting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-targeted">Not targeted</SelectItem>
                <SelectItem value="passivhaus">Passivhaus</SelectItem>
                <SelectItem value="enephis">EnePHit</SelectItem>
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="UKNZCBS"
            tooltip="Indicate if targeting UKNZCBS. Ensure the PC year above is correct"
            required
          >
            <Select
              value={projectData.uknzcbs}
              onValueChange={(value) => handleInputChange('uknzcbs', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Indicate if targeting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-targeted">Not targeted</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={`yes-${year}`}>
                    Yes - {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="NABERS"
            tooltip="Select status or the targeted NABERS rating"
            required
          >
            <Select
              value={projectData.nabers}
              onValueChange={(value) => handleInputChange('nabers', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-targeted">Not targeted</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="Other certification"
            tooltip="Insert name of other certification and target"
          >
            <Input
              placeholder="Add details"
              value={projectData.otherCertification}
              onChange={(e) => handleInputChange('otherCertification', e.target.value)}
            />
          </TooltipField>
        </div>
      </div>

      <div className="flex justify-between pt-6">
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
  );
};