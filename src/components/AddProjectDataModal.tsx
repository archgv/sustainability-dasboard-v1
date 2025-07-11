
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface AddProjectDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const AddProjectDataModal = ({ isOpen, onClose, onSave }: AddProjectDataModalProps) => {
  const [formData, setFormData] = useState({
    projectNo: '',
    projectName: '',
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Add Project Data
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Project Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Project Information</h3>
            
            <div>
              <Label htmlFor="projectNo">Project No.</Label>
              <Input
                id="projectNo"
                value={formData.projectNo}
                onChange={(e) => handleInputChange('projectNo', e.target.value)}
                placeholder="Enter project number"
              />
            </div>

            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="Enter project name"
              />
            </div>

            <div>
              <Label htmlFor="projectLocation">Project Location</Label>
              <Input
                id="projectLocation"
                value={formData.projectLocation}
                onChange={(e) => handleInputChange('projectLocation', e.target.value)}
                placeholder="Enter project location"
              />
            </div>

            <div>
              <Label htmlFor="hbDiscipline">H&B Discipline</Label>
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
            </div>

            <div>
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                value={formData.sector}
                onChange={(e) => handleInputChange('sector', e.target.value)}
                placeholder="Enter sector"
              />
            </div>

            <div>
              <Label htmlFor="eiScope">EI Scope</Label>
              <Select value={formData.eiScope} onValueChange={(value) => handleInputChange('eiScope', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select EI scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sustainabilityConsultant">Sustainability Consultant</Label>
              <Input
                id="sustainabilityConsultant"
                value={formData.sustainabilityConsultant}
                onChange={(e) => handleInputChange('sustainabilityConsultant', e.target.value)}
                placeholder="Enter consultant name"
              />
            </div>

            <div>
              <Label htmlFor="sustainabilityChampion">Sustainability Champion</Label>
              <Input
                id="sustainabilityChampion"
                value={formData.sustainabilityChampion}
                onChange={(e) => handleInputChange('sustainabilityChampion', e.target.value)}
                placeholder="Enter champion name"
              />
            </div>

            <div>
              <Label htmlFor="projectType">Project Type</Label>
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-build">New Build</SelectItem>
                  <SelectItem value="retrofit">Retrofit</SelectItem>
                  <SelectItem value="retrofit-extension">Retrofit + Extension</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Technical Data */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Technical Data</h3>

            {formData.projectType === 'retrofit' && (
              <div>
                <Label htmlFor="existingOperationalEnergy">Existing Operational Energy (kWh/m²/year)</Label>
                <Input
                  id="existingOperationalEnergy"
                  type="number"
                  min="0"
                  max="500"
                  value={formData.existingOperationalEnergy}
                  onChange={(e) => handleInputChange('existingOperationalEnergy', e.target.value)}
                  placeholder="0-500"
                />
              </div>
            )}

            <div>
              <Label htmlFor="gia">GIA (m²)</Label>
              <Input
                id="gia"
                type="number"
                min="0"
                value={formData.gia}
                onChange={(e) => handleInputChange('gia', e.target.value)}
                placeholder="Enter GIA"
              />
            </div>

            <div>
              <Label htmlFor="pcDate">PC Date (Year)</Label>
              <Input
                id="pcDate"
                type="number"
                value={formData.pcDate}
                onChange={(e) => handleInputChange('pcDate', e.target.value)}
                placeholder="Enter year only"
              />
            </div>

            <div>
              <Label htmlFor="ribaStage">RIBA Stage</Label>
              <Select value={formData.ribaStage} onValueChange={(value) => handleInputChange('ribaStage', value)}>
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
            </div>

            <div>
              <Label htmlFor="upfrontCarbon">Upfront Carbon (kgCO2e/m²)</Label>
              <Input
                id="upfrontCarbon"
                type="number"
                min="0"
                max="1500"
                value={formData.upfrontCarbon}
                onChange={(e) => handleInputChange('upfrontCarbon', e.target.value)}
                placeholder="0-1500"
              />
            </div>

            <div>
              <Label htmlFor="totalEmbodiedCarbon">Total Embodied Carbon (kgCO2e/m²)</Label>
              <Input
                id="totalEmbodiedCarbon"
                type="number"
                min="0"
                max="1500"
                value={formData.totalEmbodiedCarbon}
                onChange={(e) => handleInputChange('totalEmbodiedCarbon', e.target.value)}
                placeholder="0-1500"
              />
            </div>

            <div>
              <Label htmlFor="refrigerantType">Refrigerant Type</Label>
              <Input
                id="refrigerantType"
                value={formData.refrigerantType}
                onChange={(e) => handleInputChange('refrigerantType', e.target.value)}
                placeholder="Enter refrigerant type"
              />
            </div>

            <div>
              <Label htmlFor="operationalEnergyTotal">Operational Energy: Total (kWh/m²/yr)</Label>
              <Input
                id="operationalEnergyTotal"
                type="number"
                min="0"
                max="150"
                value={formData.operationalEnergyTotal}
                onChange={(e) => handleInputChange('operationalEnergyTotal', e.target.value)}
                placeholder="0-150"
              />
            </div>

            <div>
              <Label htmlFor="operationalEnergyGas">Operational Energy: Gas (kWh/m²/yr)</Label>
              <Input
                id="operationalEnergyGas"
                type="number"
                min="0"
                max="150"
                value={formData.operationalEnergyGas}
                onChange={(e) => handleInputChange('operationalEnergyGas', e.target.value)}
                placeholder="0-150"
              />
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-semibold text-gray-900">Certifications & Environmental</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="breeam">BREEAM</Label>
                <Select value={formData.breeam} onValueChange={(value) => handleInputChange('breeam', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outstanding">Outstanding</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="very-good">Very Good</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="pass">Pass</SelectItem>
                    <SelectItem value="unclassified">Unclassified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="leed">LEED</Label>
                <Select value={formData.leed} onValueChange={(value) => handleInputChange('leed', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="certified">Certified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="biodiversityNetGain">Biodiversity Net Gain (%)</Label>
                <Input
                  id="biodiversityNetGain"
                  type="number"
                  value={formData.biodiversityNetGain}
                  onChange={(e) => handleInputChange('biodiversityNetGain', e.target.value)}
                  placeholder="Enter percentage"
                />
              </div>

              <div>
                <Label htmlFor="habitatUnitsGained">Habitat Units Gained</Label>
                <Input
                  id="habitatUnitsGained"
                  type="number"
                  value={formData.habitatUnitsGained}
                  onChange={(e) => handleInputChange('habitatUnitsGained', e.target.value)}
                  placeholder="Enter units"
                />
              </div>
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
