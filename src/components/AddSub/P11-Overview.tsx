import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/components/Key/project";
import { WizardData } from "../L11-AddWizard";
import { StageKeys } from "../Key/KeyStage";
import { TooltipField } from "../ui/tooltip-field";

interface ProjectOverviewProps {
  selectedProject?: Project;
  projectData: WizardData;
  onDataUpdate: (data: WizardData) => void;
}

export const AddOverview = ({
  selectedProject,
  projectData,
  onDataUpdate,
}: ProjectOverviewProps) => {
  const handleInputChange = (field: string, value: string) => {
    onDataUpdate({
      ...projectData,
      [field]: value,
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i - 5);
  const stages = StageKeys;

  if (!selectedProject) {
    return null;
  }

  console.log(projectData["Current RIBA Stage"]);
  console.log(Object.keys(projectData));
  console.log(
    typeof projectData["Current RIBA Stage"],
    projectData["Current RIBA Stage"]
  );

  return (
    <div className="space-y-6">
      {/* Project Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-x-[72px] gap-y-4 bg-muted/30 p-4 rounded-[32px] p-6">
          <div>
            <Label className="text-sm font-medium">Project Location</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedProject["Project Location"]}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Primary sector</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedProject["Primary Sector"]}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Sub sector</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedProject["Sub Sector"]}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Project Type</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedProject["Project Type"]}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Heritage project</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedProject["Heritage Project"]}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Studio discipline</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedProject["Studio Discipline"]}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Neighbourhood</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedProject["Neighbourhood"]}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Project lead</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedProject["Project Lead"]}
            </p>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TooltipField
            label="Current RIBA Stage"
            tooltip="Current RIBA Stage"
            required={true}
          >
            <Select
              value={projectData["Current RIBA Stage"] || ""}
              onValueChange={(value) =>
                handleInputChange("Current RIBA Stage", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Current RIBA Stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage.toString()}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="PC year"
            tooltip="Enter the expected or actual Practical Completion year"
            required={true}
          >
            <Select
              value={projectData["PC Year"] || ""}
              onValueChange={(value) => handleInputChange("PC Year", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="Construction start year"
            tooltip="Enter the construction start year. This is essential as it identifies the associated UKNZCBS benchmark dataset"
            required={true}
          >
            <Select
              value={projectData["Construction Start Year"] || ""}
              onValueChange={(value) =>
                handleInputChange("Construction Start Year", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select construction start year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="Operational energy of existing building"
            tooltip="Enter the annual operational energy of the existing building (if retained)"
          >
            <div className="relative">
              <Input
                placeholder="Enter value (e.g. 130)"
                value={
                  projectData["Operational Energy Existing Building"] || ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "Operational Energy Existing Building",
                    e.target.value
                  )
                }
                type="number"
                min="0"
                max="500"
                className="pr-20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                kWh/m²/yr
              </div>
            </div>
          </TooltipField>

          <TooltipField
            label="GIA of proposed development"
            tooltip="Enter the Gross Internal Area (GIA) of the proposed development"
            required={true}
          >
            <div className="relative">
              <Input
                placeholder="Enter m² (e.g. 9,800 m²)"
                value={projectData["GIA"] || ""}
                onChange={(e) => handleInputChange("GIA", e.target.value)}
                type="number"
                min="1"
                className="pr-12"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                m²
              </div>
            </div>
          </TooltipField>

          <TooltipField
            label="Building lifespan"
            tooltip="Enter the anticipated building lifespan"
            required={true}
          >
            <Select
              value={projectData["Building Lifespan"] || ""}
              onValueChange={(value) =>
                handleInputChange("Building Lifespan", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Enter years (e.g. 60)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">60 years</SelectItem>
                <SelectItem value="100">100 years</SelectItem>
                <SelectItem value="120">120 years</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="EI team: paid scope"
            tooltip="Indicate whether the Environmental Intelligence team has a paid scope"
            required={true}
          >
            <Select
              value={projectData["EI Team Scope"] || ""}
              onValueChange={(value) =>
                handleInputChange("EI Team Scope", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </TooltipField>

          <TooltipField
            label="Sustainability consultant"
            tooltip="Enter the company name of the appointed external sustainability consultant (if applicable)"
          >
            <Input
              placeholder="Enter company name"
              value={projectData["External Consultants"] || ""}
              onChange={(e) =>
                handleInputChange("External Consultants", e.target.value)
              }
            />
          </TooltipField>
        </div>
      </div>
    </div>
  );
};
