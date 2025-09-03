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
  // No visual progress indicator needed since tabs provide navigation context
  return null;
};