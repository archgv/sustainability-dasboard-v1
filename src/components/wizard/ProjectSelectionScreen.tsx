import { useState } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/types/project';
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

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    project.id.toLowerCase().includes(searchValue.toLowerCase())
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
    <div className="space-y-4 max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">Add Project Data</DialogTitle>
      </DialogHeader>

      <WizardProgressIndicator 
        currentStep="project-selection"
        completedSteps={[]}
      />

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Project <span className="text-destructive">*</span>
          </label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedProject ? `${selectedProject.id} - ${selectedProject.name}` : "Select or search project..."}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search projects..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>No projects found.</CommandEmpty>
                  <CommandGroup>
                    {filteredProjects.map((project) => (
                      <CommandItem
                        key={project.id}
                        value={`${project.id} ${project.name}`}
                        onSelect={() => handleProjectSelect(project.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProjectId === project.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="w-full">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            <div className="flex flex-wrap gap-2">
                              {project.breeam && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">BREEAM: {project.breeam}</span>}
                              {project.leed && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">LEED: {project.leed}</span>}
                              {project.well && <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">WELL: {project.well}</span>}
                              {project.passivhaus && <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs">Passivhaus</span>}
                            </div>
                            <div className="flex gap-4 text-xs">
                              {project.operationalEnergy && <span>Energy: {project.operationalEnergy} kWh/m²/yr</span>}
                              {project.totalEmbodiedCarbon && <span>Carbon: {project.totalEmbodiedCarbon} kgCO2e/m²</span>}
                            </div>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="flex-shrink-0 pt-4 border-t mt-4">
        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!selectedProjectId}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};