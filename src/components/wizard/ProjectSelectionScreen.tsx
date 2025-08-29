import { useState } from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardProgressIndicator } from './WizardProgressIndicator';

interface ProjectSelectionScreenProps {
  projects: Project[];
  selectedProjectId: string;
  onProjectSelect: (projectId: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

export const ProjectSelectionScreen = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  onNext,
  onCancel
}: ProjectSelectionScreenProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleProjectSelect = (projectId: string) => {
    onProjectSelect(projectId);
    setOpen(false);
  };

  const handleNext = () => {
    if (selectedProjectId) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <WizardProgressIndicator 
        currentStep="project-selection"
        completedSteps={[]}
        stageCompletionData={{}}
      />
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Project
        </h2>
        <p className="text-gray-600">
          Choose a project to add or edit data
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedProjectId
                  ? projects.find(p => p.id === selectedProjectId)?.projectName || ''
                  : "Select a project to edit..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput 
                  placeholder="Search projects..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>
                  <CommandGroup>
                    {filteredProjects.map((project) => (
                      <CommandItem
                        key={project.id}
                        value={project.projectName}
                        onSelect={() => handleProjectSelect(project.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProjectId === project.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {project.projectName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!selectedProjectId}
            className="flex-1"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};