import { useState } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface RibaStageScreenProps {
  stageNumber: string;
  stageData: any;
  projectGia: string;
  onDataUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  onSaveAndExit: () => void;
  isLastStep: boolean;
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

export const RibaStageScreen = ({
  stageNumber,
  stageData,
  projectGia,
  onDataUpdate,
  onNext,
  onBack,
  onSaveAndExit,
  isLastStep
}: RibaStageScreenProps) => {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showBackDialog, setShowBackDialog] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    onDataUpdate({
      ...stageData,
      [field]: value
    });
  };

  const structuralMaterials = [
    'Reinforced Concrete (in-situ)',
    'Precast Concrete',
    'Cross Laminated Timber (CLT)',
    'Glulam Timber Frame',
    'Light Timber Frame (stud construction)',
    'Light Gauge Steel Frame',
    'Masonry (loadbearing blockwork or brick)',
    'Concrete + Steel Hybrid',
    'Timber + Steel Hybrid',
    'Concrete + Timber Hybrid',
    'Steel + Masonry Hybrid',
    'Other (please specify)'
  ];

  const renewableTypes = [
    'Solar',
    'Wind',
    'Geothermal',
    'Biomass',
    'Hydro'
  ];

  const energyMethods = [
    'IES - CIBSE TM54',
    'PHPP',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">RIBA Stage {stageNumber} Data</DialogTitle>
      </DialogHeader>

      {/* Progress indicator */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            ✓
          </div>
          <span className="ml-2 text-sm font-medium">Project</span>
        </div>
        <div className="flex-1 h-px bg-primary mx-4"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            ✓
          </div>
          <span className="ml-2 text-sm font-medium">Project Data</span>
        </div>
        <div className="flex-1 h-px bg-primary mx-4"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {stageNumber}
          </div>
          <span className="ml-2 text-sm font-medium">RIBA Stage {stageNumber}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy & Operational Data */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">
            Energy & Operational Data
          </h3>
          
          <TooltipField
            label="Update GIA (only if different)"
            tooltip="Enter a stage-specific GIA below only if it differs from the project GIA"
          >
            <Input
              placeholder={`Enter GIA (e.g. 6,500) - Project GIA: ${projectGia || 'N/A'} m²`}
              value={stageData.giaUpdate || ''}
              onChange={(e) => handleInputChange('giaUpdate', e.target.value)}
              type="number"
              min="1"
            />
          </TooltipField>

          <TooltipField
            label="Energy measurement method"
            tooltip="Provide the methodology used for measuring operational energy"
          >
            <Select
              value={stageData.energyMeasurementMethod || ''}
              onValueChange={(value) => handleInputChange('energyMeasurementMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Confirm method" />
              </SelectTrigger>
              <SelectContent>
                {energyMethods.map(method => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="Operational energy: Total"
            tooltip="Enter both regulated and unregulated energy (do not use Part L figures here)"
          >
            <Input
              placeholder="Enter kWh/m²/yr (e.g. 65)"
              value={stageData.operationalEnergyTotal || ''}
              onChange={(e) => handleInputChange('operationalEnergyTotal', e.target.value)}
              type="number"
              min="0"
              max="150"
            />
          </TooltipField>

          <TooltipField
            label="Operational energy: Part L"
            tooltip="Enter regulated operational energy use (Part L)"
          >
            <Input
              placeholder="Enter kWh/m²/yr (e.g. 45)"
              value={stageData.operationalEnergyPartL || ''}
              onChange={(e) => handleInputChange('operationalEnergyPartL', e.target.value)}
              type="number"
              min="0"
              max="150"
            />
          </TooltipField>

          <TooltipField
            label="Operational energy: Gas"
            tooltip="Enter gas energy use; enter 0 if no gas is used on site"
          >
            <Input
              placeholder="Enter kWh/m²/yr (e.g. 35)"
              value={stageData.operationalEnergyGas || ''}
              onChange={(e) => handleInputChange('operationalEnergyGas', e.target.value)}
              type="number"
              min="0"
              max="150"
            />
          </TooltipField>

          <TooltipField
            label="Space heating demand"
            tooltip="Enter the building's total space heating demand"
          >
            <Input
              placeholder="Enter kWh/m²/yr (e.g. 35)"
              value={stageData.spaceHeatingDemand || ''}
              onChange={(e) => handleInputChange('spaceHeatingDemand', e.target.value)}
              type="number"
              min="0"
            />
          </TooltipField>

          <TooltipField
            label="Renewable energy type"
            tooltip="Select the type of renewable energy (e.g. PV, wind)"
          >
            <Select
              value={stageData.renewableEnergyType || ''}
              onValueChange={(value) => handleInputChange('renewableEnergyType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose renewable type (e.g. PV)" />
              </SelectTrigger>
              <SelectContent>
                {renewableTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="Renewable energy generation"
            tooltip="Enter the total annual renewable energy generated for the whole building (not per m² GIA)"
          >
            <Input
              placeholder="Enter kWh/yr (e.g. 5,000)"
              value={stageData.renewableEnergyGeneration || ''}
              onChange={(e) => handleInputChange('renewableEnergyGeneration', e.target.value)}
              type="number"
              min="0"
            />
          </TooltipField>
        </div>

        {/* Carbon & Environmental Data */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">
            Carbon & Environmental Data
          </h3>

          <TooltipField
            label="Structural frame material"
            tooltip="Select the dominant material used in the structural frame"
          >
            <Select
              value={stageData.structuralFrameMaterial || ''}
              onValueChange={(value) => handleInputChange('structuralFrameMaterial', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {structuralMaterials.map(material => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="Upfront carbon"
            tooltip="Enter embodied carbon for stages A1–A5"
          >
            <Input
              placeholder="Enter kgCO2e/m² (e.g. 600)"
              value={stageData.upfrontCarbon || ''}
              onChange={(e) => handleInputChange('upfrontCarbon', e.target.value)}
              type="number"
              min="0"
              max="1500"
            />
          </TooltipField>

          <TooltipField
            label="Total embodied carbon"
            tooltip="Enter total embodied carbon for life cycle stages A1–C4"
          >
            <Input
              placeholder="Enter kgCO2e/m² (e.g. 900)"
              value={stageData.totalEmbodiedCarbon || ''}
              onChange={(e) => handleInputChange('totalEmbodiedCarbon', e.target.value)}
              type="number"
              min="0"
              max="1500"
            />
          </TooltipField>

          <TooltipField
            label="Biogenic carbon"
            tooltip="Enter total biogenic carbon (use a negative number)"
          >
            <Input
              placeholder="Enter kgCO2e/m² (e.g. -150)"
              value={stageData.biogenicCarbon || ''}
              onChange={(e) => handleInputChange('biogenicCarbon', e.target.value)}
              type="number"
              min="-600"
              max="0"
            />
          </TooltipField>

          <TooltipField
            label="Embodied carbon scope clarifications"
            tooltip="Specify scope, life cycle modules, and whether using RICS V1 or V2 etc."
          >
            <Textarea
              placeholder="e.g. A1–A5 only"
              value={stageData.embodiedCarbonScope || ''}
              onChange={(e) => handleInputChange('embodiedCarbonScope', e.target.value)}
              maxLength={300}
              className="resize-none"
            />
          </TooltipField>

          <TooltipField
            label="Biodiversity net gain"
            tooltip="Enter the predicted Biodiversity Net Gain percentage"
          >
            <Input
              placeholder="Enter % value (e.g. 10%)"
              value={stageData.biodiversityNetGain || ''}
              onChange={(e) => handleInputChange('biodiversityNetGain', e.target.value)}
              type="number"
              min="0"
              max="200"
            />
          </TooltipField>

          <TooltipField
            label="Habitat units gained"
            tooltip="Enter the number of habitat units gained"
          >
            <Input
              placeholder="Enter value (e.g. 13)"
              value={stageData.habitatUnits || ''}
              onChange={(e) => handleInputChange('habitatUnits', e.target.value)}
              type="number"
              min="0"
              max="50"
            />
          </TooltipField>

          <TooltipField
            label="Urban greening factor"
            tooltip="Enter Urban Greening Factor score, if applicable"
          >
            <Input
              placeholder="Enter value (e.g. 0.3)"
              value={stageData.urbanGreeningFactor || ''}
              onChange={(e) => handleInputChange('urbanGreeningFactor', e.target.value)}
              type="number"
              step="0.1"
              min="0"
              max="10"
            />
          </TooltipField>

          <TooltipField
            label="Additional notes"
            tooltip="Add any clarifications relating to biodiversity"
          >
            <Textarea
              placeholder="Add clarification"
              value={stageData.additionalNotes || ''}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              maxLength={300}
              className="resize-none"
            />
          </TooltipField>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <AlertDialog open={showBackDialog} onOpenChange={setShowBackDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              Back
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Are you sure you want to cancel?
              </AlertDialogTitle>
              <AlertDialogDescription>
                All unsaved data will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, go back</AlertDialogCancel>
              <AlertDialogAction onClick={onBack}>Yes, cancel</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
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
          
          {isLastStep ? (
            <Button onClick={onSaveAndExit}>
              Save Project Data
            </Button>
          ) : (
            <Button onClick={onNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};