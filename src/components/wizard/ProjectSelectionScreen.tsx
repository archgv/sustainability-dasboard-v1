import { useState } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/types/project';

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
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">Add Project Data</DialogTitle>
      </DialogHeader>

      {/* Progress indicator */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            1
          </div>
          <span className="ml-2 text-sm font-medium">Project</span>
        </div>
        <div className="flex-1 h-px bg-muted mx-4"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
            2
          </div>
          <span className="ml-2 text-sm text-muted-foreground">Project Data</span>
        </div>
        <div className="flex-1 h-px bg-muted mx-4"></div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
            3-9
          </div>
          <span className="ml-2 text-sm text-muted-foreground">RIBA Stages</span>
        </div>
      </div>

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
                        <div>
                          <div className="font-medium">{project.id}</div>
                          <div className="text-sm text-muted-foreground">{project.name}</div>
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

      <div className="flex justify-between pt-6">
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
  );
};