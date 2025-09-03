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

  // Helper function to populate wizard data with existing project data
  const populateWizardDataFromProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    // Extract completion year from completionDate
    const pcYear = project.completionDate ? new Date(project.completionDate).getFullYear().toString() : '';
    
    // Map certification values to wizard format
    const mapCertificationValue = (value: string) => {
      if (!value || value === 'N/A') return '';
      return value.toLowerCase().replace(' ', '-');
    };

    const updatedProjectData = {
      ...wizardData.projectData,
      pcYear,
      gia: project.gia?.toString() || '',
      breeam: mapCertificationValue(project.breeam || ''),
      leed: mapCertificationValue(project.leed || ''),
      well: mapCertificationValue(project.well || ''),
      nabers: project.nabers?.includes('Star') ? 'yes' : '',
      passivhaus: project.passivhaus ? 'passivhaus' : '',
      operationalEnergyExisting: project.existingBuildingEnergy?.toString() || '',
    };

    // Create RIBA stage 7 data from existing project data
    const ribaStage7Data = {
      giaUpdate: project.gia?.toString() || '',
      energyMeasurementMethod: '',
      operationalEnergyTotal: project.operationalEnergyTotal?.toString() || '',
      operationalEnergyPartL: project.operationalEnergyPartL?.toString() || '',
      operationalEnergyGas: project.operationalEnergyGas?.toString() || '',
      spaceHeatingDemand: project.spaceHeatingDemand?.toString() || '',
      renewableEnergyType: '',
      renewableEnergyGeneration: project.renewableEnergyGeneration?.toString() || '',
      structuralFrameMaterial: '',
      upfrontCarbon: project.upfrontCarbon?.toString() || '',
      totalEmbodiedCarbon: project.totalEmbodiedCarbon?.toString() || '',
      biogenicCarbon: project.biogenicCarbon?.toString() || '',
      embodiedCarbonScope: '',
      biodiversityNetGain: project.biodiversityNetGain?.toString() || '',
      habitatUnits: project.habitatUnits?.toString() || '',
      urbanGreeningFactor: project.urbanGreeningFactor?.toString() || '',
      additionalNotes: '',
    };

    setWizardData(prev => ({
      ...prev,
      selectedProjectId: projectId,
      projectData: updatedProjectData,
      ribaStages: {
        ...prev.ribaStages,
        'riba-7': ribaStage7Data
      }
    }));
  };

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

  const handleProjectSelect = (projectId: string) => {
    populateWizardDataFromProject(projectId);
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
            onProjectSelect={handleProjectSelect}
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
              currentStep={currentStep}
              completedSteps={[]}
              stageCompletionData={{
                'riba-1': { completed: true, date: '10.01.2025' },
                'riba-2': { completed: true, date: '12.06.2025' }
              }}
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