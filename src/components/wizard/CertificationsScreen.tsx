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
        {/* Certifications */}
        <div className="space-y-4">          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TooltipField
              label="BREEAM"
              tooltip="Select status or the targeted BREEAM rating"
              required={true}
            >
              <Select
                value={projectData.breeam || ''}
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
              required={true}
            >
              <Select
                value={projectData.leed || ''}
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
              required={true}
            >
              <Select
                value={projectData.well || ''}
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
              required={true}
            >
              <Select
                value={projectData.fitwel || ''}
                onValueChange={(value) => handleInputChange('fitwel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-targeted">Not targeted</SelectItem>
                  <SelectItem value="to-be-determined">To be determined</SelectItem>
                  <SelectItem value="3-stars">3 stars</SelectItem>
                  <SelectItem value="2-stars">2 stars</SelectItem>
                  <SelectItem value="1-star">1 star</SelectItem>
                  <SelectItem value="not-certified">Not certified</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="Passivhaus or EnePHit"
              tooltip="Indicate if targeting Passivhaus or EnePHit"
              required={true}
            >
              <Select
                value={projectData.passivhaus || ''}
                onValueChange={(value) => handleInputChange('passivhaus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Indicate if targeting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-targeted">Not targeted</SelectItem>
                  <SelectItem value="to-be-determined">To be determined</SelectItem>
                  <SelectItem value="passivhaus">Passivhaus</SelectItem>
                  <SelectItem value="enerphit">EnePHit</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="UKNZCBS"
              tooltip="Indicate if targeting UKNZCBS. Ensure the PC year above is correct"
              required={true}
            >
              <Select
                value={projectData.uknzcbs || ''}
                onValueChange={(value) => handleInputChange('uknzcbs', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Indicate if targeting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-targeted">Not targeted</SelectItem>
                  <SelectItem value="to-be-determined">To be determined</SelectItem>
                  <SelectItem value="yes-2025">Yes - 2025</SelectItem>
                  <SelectItem value="yes-2026">Yes - 2026</SelectItem>
                  <SelectItem value="yes-2027">Yes - 2027</SelectItem>
                  <SelectItem value="yes-2028">Yes - 2028</SelectItem>
                  <SelectItem value="yes-2029">Yes - 2029</SelectItem>
                  <SelectItem value="yes-2030">Yes - 2030</SelectItem>
                  <SelectItem value="yes-2031">Yes - 2031</SelectItem>
                  <SelectItem value="yes-2032">Yes - 2032</SelectItem>
                  <SelectItem value="yes-2033">Yes - 2033</SelectItem>
                  <SelectItem value="yes-2034">Yes - 2034</SelectItem>
                  <SelectItem value="yes-2035">Yes - 2035</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="NABERS"
              tooltip="Select status or the targeted NABERS rating"
              required={true}
            >
              <Select
                value={projectData.nabers || ''}
                onValueChange={(value) => handleInputChange('nabers', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-targeted">Not targeted</SelectItem>
                  <SelectItem value="to-be-determined">To be determined</SelectItem>
                  <SelectItem value="1-star">1 Star</SelectItem>
                  <SelectItem value="2-stars">2 Stars</SelectItem>
                  <SelectItem value="3-stars">3 Stars</SelectItem>
                  <SelectItem value="4-stars">4 Stars</SelectItem>
                  <SelectItem value="5-stars">5 Stars</SelectItem>
                  <SelectItem value="6-stars">6 Stars</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>
          </div>

          <TooltipField
            label="Other certification"
            tooltip="Insert name of other certification and target"
          >
            <Input
              placeholder="Add details"
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