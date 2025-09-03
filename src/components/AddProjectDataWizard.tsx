import { useState } from 'react';
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project } from '@/types/project';
import { ProjectSelectionScreen } from './wizard/ProjectSelectionScreen';
import { ProjectOverviewScreen } from './wizard/ProjectOverviewScreen';
import { CertificationsScreen } from './wizard/CertificationsScreen';
import { RibaStageScreen } from './wizard/RibaStageScreen';

interface AddProjectDataWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  projects: Project[];
}

export type WizardStep = 
  | 'project-selection'
  | 'project-overview'
  | 'certifications'
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
  const [activeTab, setActiveTab] = useState<string>('project-overview');
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

  // Reset wizard to initial state when dialog opens
  const resetWizard = () => {
    setCurrentStep('project-selection');
    setActiveTab('project-overview');
    setWizardData({
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
  };

  // Reset when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      resetWizard();
    }
  }, [isOpen]);

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

    // Move to tabbed interface after project selection
    setCurrentStep('project-overview');
  };

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  const handleProjectSelect = (projectId: string) => {
    populateWizardDataFromProject(projectId);
  };

  const handleSave = () => {
    console.log('Saving data for current tab:', activeTab);
    // Individual save without closing
  };

  const handleSaveAndExit = () => {
    onSave(wizardData);
    resetWizard();
    onClose();
  };

  const handleCancel = () => {
    resetWizard();
    onClose();
  };

  const selectedProject = projects.find(p => p.id === wizardData.selectedProjectId);

  const renderCurrentStep = () => {
    if (currentStep === 'project-selection') {
      return (
        <ProjectSelectionScreen
          projects={projects}
          selectedProjectId={wizardData.selectedProjectId}
          onProjectSelect={handleProjectSelect}
          onNext={() => setCurrentStep('project-overview')}
          onCancel={onClose}
        />
      );
    }

    // Tabbed interface for all other steps
    return (
      <div className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Project Data - {selectedProject?.name}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="project-overview" className="text-center">
              <div className="flex flex-col">
                <span>Project</span>
                <span>Overview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="text-center">
              <div className="flex flex-col">
                <span>Certifications</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="riba-1" className="text-center">
              <div className="flex flex-col">
                <span>RIBA</span>
                <span>Stage 1</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="riba-2" className="text-center">
              <div className="flex flex-col">
                <span>RIBA</span>
                <span>Stage 2</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="riba-3" className="text-center">
              <div className="flex flex-col">
                <span>RIBA</span>
                <span>Stage 3</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="riba-4" className="text-center">
              <div className="flex flex-col">
                <span>RIBA</span>
                <span>Stage 4</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="riba-5" className="text-center">
              <div className="flex flex-col">
                <span>RIBA</span>
                <span>Stage 5</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="riba-6" className="text-center">
              <div className="flex flex-col">
                <span>RIBA</span>
                <span>Stage 6</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="riba-7" className="text-center">
              <div className="flex flex-col">
                <span>RIBA</span>
                <span>Stage 7</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project-overview">
            <ProjectOverviewScreen
              selectedProject={selectedProject}
              projectData={wizardData.projectData}
              onDataUpdate={(data) => updateWizardData({ projectData: data })}
              onSave={handleSave}
              onSaveAndExit={handleSaveAndExit}
              onCancel={handleCancel}
            />
          </TabsContent>

          <TabsContent value="certifications">
            <CertificationsScreen
              projectData={wizardData.projectData}
              onDataUpdate={(data) => updateWizardData({ projectData: data })}
              onSave={handleSave}
              onSaveAndExit={handleSaveAndExit}
              onCancel={handleCancel}
            />
          </TabsContent>

          {['riba-1', 'riba-2', 'riba-3', 'riba-4', 'riba-5', 'riba-6', 'riba-7'].map((stage) => (
            <TabsContent key={stage} value={stage}>
              <RibaStageScreen
                stageNumber={stage.split('-')[1]}
                stageData={wizardData.ribaStages[stage] || {}}
                projectGia={wizardData.projectData.gia}
                onDataUpdate={(data) => {
                  const updatedRibaStages = {
                    ...wizardData.ribaStages,
                    [stage]: data
                  };
                  updateWizardData({ ribaStages: updatedRibaStages });
                }}
                onSave={handleSave}
                onSaveAndExit={handleSaveAndExit}
                onCancel={handleCancel}
                currentStep={stage as WizardStep}
                completedSteps={[]}
                stageCompletionData={{
                  'riba-1': { completed: true, date: '10.01.2025' },
                  'riba-2': { completed: true, date: '12.06.2025' }
                }}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh]" 
        hideCloseButton={true}
        preventOutsideClick={true}
      >
        {renderCurrentStep()}
      </DialogContent>
    </Dialog>
  );
};