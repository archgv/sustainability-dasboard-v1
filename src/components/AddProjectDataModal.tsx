
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface AddProjectDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const AddProjectDataModal = ({ isOpen, onClose, onSave }: AddProjectDataModalProps) => {
  const [formData, setFormData] = useState({
    projectNameNumber: '',
    projectLocation: '',
    hbDiscipline: '',
    sector: '',
    eiScope: '',
    sustainabilityConsultant: '',
    sustainabilityChampion: '',
    projectType: '',
    existingOperationalEnergy: '',
    gia: '',
    pcDate: '',
    ribaStage: '',
    upfrontCarbon: '',
    totalEmbodiedCarbon: '',
    refrigerantType: '',
    operationalEnergyTotal: '',
    operationalEnergyGas: '',
    spaceHeatingDemand: '',
    renewableEnergyGeneration: '',
    waterUse: '',
    breeam: '',
    leed: '',
    well: '',
    nabers: '',
    passivhausOrEnephit: '',
    uknzcbs: '',
    biodiversityNetGain: '',
    habitatUnitsGained: '',
    urbanGreeningFactor: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Project Data</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Project Information</h3>
            
            <TooltipField label="Project Name & Number">
              <Input
                value={formData.projectNameNumber}
                onChange={(e) => handleInputChange('projectNameNumber', e.target.value)}
                placeholder="e.g. 230151 Green Office Tower"
                required
              />
            </TooltipField>

            <TooltipField label="Project Location">
              <Input
                value={formData.projectLocation}
                onChange={(e) => handleInputChange('projectLocation', e.target.value)}
                placeholder="Enter project location"
              />
            </TooltipField>

            <TooltipField label="H&B Discipline">
              <Select value={formData.hbDiscipline} onValueChange={(value) => handleInputChange('hbDiscipline', value)}>
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
              <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="ccc">CCC</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField label="EI Team: Paid Scope" tooltip="Does the Environmental Intelligence team have a paid scope?">
              <Select value={formData.eiScope} onValueChange={(value) => handleInputChange('eiScope', value)} required>
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
              <Input
                value={formData.sustainabilityConsultant}
                onChange={(e) => handleInputChange('sustainabilityConsultant', e.target.value)}
                placeholder="Enter company name"
                required
              />
            </TooltipField>

            <TooltipField label="Sustainability Champion Name" tooltip="Name of the internal sustainability champion.">
              <Input
                value={formData.sustainabilityChampion}
                onChange={(e) => handleInputChange('sustainabilityChampion', e.target.value)}
                placeholder="Enter champion name"
                required
              />
            </TooltipField>

            <TooltipField label="Project Type" tooltip="Is this a new build, retrofit, or extension?">
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)} required>
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

            {(formData.projectType === 'retrofit' || formData.projectType === 'retrofit-extension') && (
              <TooltipField label="Existing Operational Energy (kWh/m²/year)" tooltip="Annual operational energy of the existing building (if retained).">
                <Input
                  type="number"
                  min="0"
                  max="500"
                  value={formData.existingOperationalEnergy}
                  onChange={(e) => handleInputChange('existingOperationalEnergy', e.target.value)}
                  placeholder="0-500"
                />
              </TooltipField>
            )}

            <TooltipField label="GIA (m²)">
              <Input
                type="number"
                min="0"
                value={formData.gia}
                onChange={(e) => handleInputChange('gia', e.target.value)}
                placeholder="Enter GIA"
                required
              />
            </TooltipField>

            <TooltipField label="PC Date (Year)" tooltip="Expected or actual practical completion year.">
              <Input
                type="number"
                value={formData.pcDate}
                onChange={(e) => handleInputChange('pcDate', e.target.value)}
                placeholder="Enter year only"
                required
              />
            </TooltipField>

            <TooltipField label="RIBA Stage" tooltip="Current RIBA Plan of Work stage for the project.">
              <Select value={formData.ribaStage} onValueChange={(value) => handleInputChange('ribaStage', value)} required>
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
              <Input
                type="number"
                min="0"
                max="1500"
                value={formData.upfrontCarbon}
                onChange={(e) => handleInputChange('upfrontCarbon', e.target.value)}
                placeholder="0-1500"
              />
            </TooltipField>

            <TooltipField label="Total Embodied Carbon (kgCO₂e/m²)" tooltip="Total embodied carbon for life cycle stages A1–C4.">
              <Input
                type="number"
                min="0"
                max="1500"
                value={formData.totalEmbodiedCarbon}
                onChange={(e) => handleInputChange('totalEmbodiedCarbon', e.target.value)}
                placeholder="0-1500"
              />
            </TooltipField>

            <TooltipField label="Refrigerant Type" tooltip="Main refrigerant type used in active systems.">
              <Input
                value={formData.refrigerantType}
                onChange={(e) => handleInputChange('refrigerantType', e.target.value)}
                placeholder="Enter refrigerant type"
              />
            </TooltipField>

            <TooltipField label="Operational Energy: Total (kWh/m²/year)">
              <Input
                type="number"
                min="0"
                max="150"
                value={formData.operationalEnergyTotal}
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
                value={formData.operationalEnergyGas}
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
                value={formData.spaceHeatingDemand}
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
                value={formData.renewableEnergyGeneration}
                onChange={(e) => handleInputChange('renewableEnergyGeneration', e.target.value)}
                placeholder="0-150"
                required
              />
            </TooltipField>

            <TooltipField label="Water Use">
              <Input
                value={formData.waterUse}
                onChange={(e) => handleInputChange('waterUse', e.target.value)}
                placeholder="Enter water usage"
                required
              />
            </TooltipField>

            <TooltipField label="Biodiversity Net Gain (%)" tooltip="Predicted Biodiversity Net Gain percentage.">
              <Input
                type="number"
                min="0"
                max="200"
                value={formData.biodiversityNetGain}
                onChange={(e) => handleInputChange('biodiversityNetGain', e.target.value)}
                placeholder="Up to 200%"
              />
            </TooltipField>

            <TooltipField label="Habitat Units Gained" tooltip="Number of habitat units gained.">
              <Input
                type="number"
                min="0"
                max="50"
                value={formData.habitatUnitsGained}
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
                value={formData.urbanGreeningFactor}
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
                <Select value={formData.breeam} onValueChange={(value) => handleInputChange('breeam', value)} required>
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
                <Select value={formData.leed} onValueChange={(value) => handleInputChange('leed', value)} required>
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
                <Select value={formData.well} onValueChange={(value) => handleInputChange('well', value)} required>
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
                <Select value={formData.nabers} onValueChange={(value) => handleInputChange('nabers', value)} required>
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
                <Select value={formData.passivhausOrEnephit} onValueChange={(value) => handleInputChange('passivhausOrEnephit', value)} required>
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
                <Select value={formData.uknzcbs} onValueChange={(value) => handleInputChange('uknzcbs', value)} required>
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
          <Button onClick={handleSave}>
            Save Project Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
