import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface CertificationsScreenProps {
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

export const CertificationsScreen = ({
  projectData,
  onDataUpdate,
  onSave,
  onSaveAndExit,
  onCancel
}: CertificationsScreenProps) => {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    onDataUpdate({
      ...projectData,
      [field]: value
    });
  };

  return (
    <div className="max-h-[75vh] overflow-y-auto space-y-6">
      {/* Content area */}
      <div className="space-y-6">
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
                  <SelectItem value="none">None</SelectItem>
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
                  <SelectItem value="none">None</SelectItem>
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
                  <SelectItem value="none">None</SelectItem>
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
                  <SelectItem value="none">None</SelectItem>
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
                  <SelectItem value="none">None</SelectItem>
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
                  <SelectItem value="none">None</SelectItem>
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
                  <SelectItem value="none">None</SelectItem>
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