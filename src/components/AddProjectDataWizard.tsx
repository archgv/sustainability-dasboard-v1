import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Project } from '@/types/project';
import { ProjectSelectionScreen } from './wizard/ProjectSelectionScreen';
import { ProjectDataScreen } from './wizard/ProjectDataScreen';
import { RibaStageScreen } from './wizard/RibaStageScreen';

interface AddProjectDataWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  projects: Project[];
}

export type WizardStep = 
  | 'project-selection'
  | 'project-data'
  | 'riba-1'
  | 'riba-2'
  | 'riba-3'
  | 'riba-4'
  | 'riba-5'
  | 'riba-6'
  | 'riba-7';

export interface WizardData {
  selectedProjectId: string;
  projectData: {
    // Section B - Project Overview (user input)
    pcYear: string;
    operationalEnergyExisting: string;
    gia: string;
    buildingLifespan: string;
    paidScope: string;
    sustainabilityConsultant: string;
    sustainabilityChampion: string;
    missionStatement: string;
    
    // Section C - Certifications (user input)
    breeam: string;
    leed: string;
    well: string;
    fitwel: string;
    passivhaus: string;
    uknzcbs: string;
    nabers: string;
    otherCertification: string;
  };
  ribaStages: {
    [key: string]: {
      // Stage-specific data
      giaUpdate?: string;
      energyMeasurementMethod: string;
      operationalEnergyTotal: string;
      operationalEnergyPartL: string;
      operationalEnergyGas: string;
      spaceHeatingDemand: string;
      renewableEnergyType: string;
      renewableEnergyGeneration: string;
      structuralFrameMaterial: string;
      upfrontCarbon: string;
      totalEmbodiedCarbon: string;
      biogenicCarbon: string;
      embodiedCarbonScope: string;
      biodiversityNetGain: string;
      habitatUnits: string;
      urbanGreeningFactor: string;
      additionalNotes: string;
    };
  };
}

export const AddProjectDataWizard = ({ isOpen, onClose, onSave, projects }: AddProjectDataWizardProps) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('project-selection');
  const [wizardData, setWizardData] = useState<WizardData>({
    selectedProjectId: '',
    projectData: {
      pcYear: '',
      operationalEnergyExisting: '',
      gia: '',
      buildingLifespan: '',
      paidScope: '',
      sustainabilityConsultant: '',
      sustainabilityChampion: '',
      missionStatement: '',
      breeam: '',
      leed: '',
      well: '',
      fitwel: '',
      passivhaus: '',
      uknzcbs: '',
      nabers: '',
      otherCertification: '',
    },
    ribaStages: {}
  });

  const stepOrder: WizardStep[] = [
    'project-selection',
    'project-data',
    'riba-1',
    'riba-2',
    'riba-3',
    'riba-4',
    'riba-5',
    'riba-6',
    'riba-7'
  ];

  const getCurrentStepIndex = () => stepOrder.indexOf(currentStep);
  const isFirstStep = () => getCurrentStepIndex() === 0;
  const isLastStep = () => getCurrentStepIndex() === stepOrder.length - 1;

  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    onSave(wizardData);
    onClose();
  };

  const selectedProject = projects.find(p => p.id === wizardData.selectedProjectId);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'project-selection':
        return (
          <ProjectSelectionScreen
            projects={projects}
            selectedProjectId={wizardData.selectedProjectId}
            onProjectSelect={(projectId) => updateWizardData({ selectedProjectId: projectId })}
            onNext={goToNextStep}
            onCancel={onClose}
          />
        );
      
      case 'project-data':
        return (
          <ProjectDataScreen
            selectedProject={selectedProject}
            projectData={wizardData.projectData}
            onDataUpdate={(data) => updateWizardData({ projectData: data })}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            onSaveAndExit={handleSave}
          />
        );
      
      default:
        // RIBA stage screens
        if (currentStep.startsWith('riba-')) {
          const stageNumber = currentStep.split('-')[1];
          const stageData = wizardData.ribaStages[currentStep] || {};
          
          return (
            <RibaStageScreen
              stageNumber={stageNumber}
              stageData={stageData}
              projectGia={wizardData.projectData.gia}
              onDataUpdate={(data) => {
                const updatedRibaStages = {
                  ...wizardData.ribaStages,
                  [currentStep]: data
                };
                updateWizardData({ ribaStages: updatedRibaStages });
              }}
              onNext={goToNextStep}
              onBack={goToPreviousStep}
              onSaveAndExit={handleSave}
              isLastStep={isLastStep()}
            />
          );
        }
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {renderCurrentStep()}
      </DialogContent>
    </Dialog>
  );
};