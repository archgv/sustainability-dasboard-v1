import { Progress } from '@/components/ui/progress';

interface WizardProgressIndicatorProps {
  currentStep: string;
  completedSteps?: string[];
  stageCompletionData?: { [key: string]: { completed: boolean; date?: string } };
}

export const WizardProgressIndicator = ({ 
  currentStep, 
  completedSteps = [], 
  stageCompletionData = {} 
}: WizardProgressIndicatorProps) => {
  const steps = [
    { id: 'project-selection', label: 'Select project', short: 'Project' },
    { id: 'project-data', label: 'Project level data', short: 'Data' },
    { id: 'riba-1', label: 'RIBA stage 0-1', short: 'Stage 0-1', stage: true },
    { id: 'riba-2', label: 'RIBA stage 2', short: 'Stage 2', stage: true },
    { id: 'riba-3', label: 'RIBA stage 3', short: 'Stage 3', stage: true },
    { id: 'riba-4', label: 'RIBA stage 4', short: 'Stage 4', stage: true },
    { id: 'riba-5', label: 'RIBA stage 5', short: 'Stage 5', stage: true },
    { id: 'riba-6', label: 'RIBA stage 6', short: 'Stage 6', stage: true },
    { id: 'riba-7', label: 'RIBA stage 7', short: 'Stage 7', stage: true },
  ];

  const getStepStatus = (stepId: string) => {
    if (stepId === currentStep) return 'current';
    if (completedSteps.includes(stepId)) return 'completed';
    return 'incomplete';
  };

  const getStepClasses = (status: string, isStage: boolean = false) => {
    switch (status) {
      case 'completed':
        return 'w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium';
      case 'current':
        return 'w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium';
      case 'incomplete':
      default:
        return 'w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs';
    }
  };

  const getConnectorClasses = (fromStep: string, toStep: string) => {
    const fromStatus = getStepStatus(fromStep);
    const toStatus = getStepStatus(toStep);
    
    if (fromStatus === 'completed' && (toStatus === 'completed' || toStatus === 'current')) {
      return 'flex-1 h-px bg-primary mx-1';
    }
    return 'flex-1 h-px bg-muted mx-1';
  };

  const getStageCompletionInfo = (stepId: string) => {
    const stageData = stageCompletionData[stepId];
    if (stageData?.completed && stageData.date) {
      return stageData.date;
    }
    return getStepStatus(stepId) === 'incomplete' ? 'Incomplete' : '';
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={getStepClasses(getStepStatus(step.id), step.stage)}>
                {getStepStatus(step.id) === 'completed' ? (
                  '✓'
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-1 text-center">
                <div className={`text-xs font-medium ${
                  getStepStatus(step.id) === 'incomplete' 
                    ? 'text-muted-foreground' 
                    : 'text-foreground'
                }`}>
                  {step.short}
                </div>
                {step.stage && (
                  <div className={`text-xs ${
                    getStepStatus(step.id) === 'completed' 
                      ? 'text-primary' 
                      : getStepStatus(step.id) === 'incomplete'
                      ? 'text-destructive'
                      : 'text-foreground'
                  }`}>
                    {getStageCompletionInfo(step.id)}
                  </div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={getConnectorClasses(step.id, steps[index + 1].id)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};