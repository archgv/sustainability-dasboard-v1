import { Project } from '@/types/project';
import { WizardProgressIndicator } from './WizardProgressIndicator';

interface ProjectDataScreenProps {
  selectedProject: Project | null;
  projectData?: any;
  currentStep: string;
  completedSteps: string[];
  stageCompletionData?: { [key: string]: { completed: boolean; date?: string } };
  onDataUpdate?: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
  onSaveAndExit?: () => void;
  isLastStep?: boolean;
}

export const ProjectDataScreen = ({
  selectedProject,
  projectData,
  currentStep,
  completedSteps,
  stageCompletionData = {},
  onDataUpdate,
  onNext,
  onBack,
  onSaveAndExit,
  isLastStep
}: ProjectDataScreenProps) => {

  return (
    <div className="space-y-6">
      <WizardProgressIndicator 
        currentStep={currentStep}
        completedSteps={completedSteps}
        stageCompletionData={stageCompletionData}
      />
      
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {selectedProject?.projectName || 'Project Data Entry'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Location: {selectedProject?.projectLocation || 'Unknown'}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {selectedProject?.projectType || 'Unknown Type'}
          </span>
          <p className="text-sm text-gray-600">
            Sector: {selectedProject?.primarySector || 'Unknown'}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Project Data Entry
          </h3>
          <p className="text-gray-600">
            Data entry interface for RIBA stages will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};