import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/components/Key/project";

interface ProjectSelectionProps {
  projects: Project[];
  id: string;
  onProjectSelect: (projectId: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

export const AddSelection = ({
  projects,
  id,
  onProjectSelect,
  onNext,
  onCancel,
}: ProjectSelectionProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectedProject = projects.find((p) => p.id === id);

  const filteredProjects = projects.filter((project) =>
    project["Project Name"].toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleProjectSelect = (projectId: string) => {
    onProjectSelect(projectId);
    setOpen(false);
  };

  const handleNext = () => {
    if (id) {
      onNext();
    }
  };

  return (
    <div className="space-y-4 max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold">
          Add Project Data
        </DialogTitle>
      </DialogHeader>

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
                {selectedProject
                  ? `${selectedProject.id} - ${selectedProject["Project Name"]}`
                  : "Select or search project..."}
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
                        value={`${project.id} ${project["Project Name"]}`}
                        onSelect={() => handleProjectSelect(project.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            id === project.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="w-full">
                          <div className="font-medium">
                            {project["id"]} {project["Project Name"]}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            <div className="flex flex-wrap gap-2">
                              {project["Project Type"] && (
                                <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-xs">
                                  {project["Project Type"]}
                                </span>
                              )}
                              {project["Primary Sector"] && (
                                <span className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-xs">
                                  {project["Primary Sector"]}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-4 text-xs">
                              {/* {project.operationalEnergy && <span>Energy: {project.operationalEnergy} kWh/m²/yr</span>} */}
                              {/* {project.totalEmbodiedCarbon && <span>Total Embodied Carbon: {project.totalEmbodiedCarbon} kgCO2e/m²</span>} */}
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
          <Button onClick={handleNext} disabled={!id}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
