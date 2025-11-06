import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, AlertTriangle } from "lucide-react";
import { WizardData } from "../L11-AddWizard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StageKey } from "@/components/Key/KeyStage";
import { TooltipField } from "../ui/tooltip-field";
import { Unit } from "../ui/unit";

interface RibaStageProps {
  stageNumber: string;
  stageData: Partial<WizardData["RIBA Stage"][StageKey]>;
  projectGia: string;
  onDataUpdate: (data: WizardData["RIBA Stage"][StageKey]) => void;
  onSave: () => void;
  onSaveAndExit: () => void;
  onCancel: () => void;
  currentStep: string;
  completedSteps: string[];
  stageCompletionData?: {
    [key: string]: { completed: boolean; date?: string };
  };
}

export const AddRIBAStage = ({
  stageNumber,
  stageData,
  projectGia,
  onDataUpdate,
  onSave,
  onSaveAndExit,
  onCancel,
  currentStep,
  completedSteps,
  stageCompletionData,
}: RibaStageProps) => {
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    onDataUpdate({
      ...stageData,
      [field]: value,
    });
  };

  const structuralMaterials = [
    "Reinforced Concrete (in-situ)",
    "Precast Concrete",
    "Cross Laminated Timber (CLT)",
    "Glulam Timber Frame",
    "Light Timber Frame (stud construction)",
    "Light Gauge Steel Frame",
    "Masonry (loadbearing blockwork or brick)",
    "Concrete + Steel Hybrid",
    "Timber + Steel Hybrid",
    "Concrete + Timber Hybrid",
    "Steel + Masonry Hybrid",
    "Other (please specify)",
  ];

  const renewableTypes = ["PV", "Wind"];

  const energyMethods = ["IES - CIBSE TM54", "PHPP", "Benchmark", "Other"];

  return (
    <div className="flex flex-col h-[75vh]">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TooltipField
              label="Update GIA (only if different)"
              tooltip="Enter a stage-specific GIA below only if it differs from the project GIA"
            >
              <div className="relative">
                <Input
                  placeholder={`Enter value (e.g. 6,500) - Project GIA: ${
                    projectGia || "N/A"
                  }`}
                  value={stageData["Updated GIA"] || ""}
                  onChange={(e) =>
                    handleInputChange("Updated GIA", e.target.value)
                  }
                  type="number"
                  min="1"
                  className="pr-8"
                />
                <Unit>m²</Unit>
              </div>
            </TooltipField>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Operational Energy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-500 py-0 px-6">
              Operational Energy
            </h3>

            <TooltipField
              label="Energy measurement method"
              tooltip="Provide the methodology used for measuring operational energy"
            >
              <Select
                value={stageData["Method Energy Measurement"] || ""}
                onValueChange={(value) =>
                  handleInputChange("Method Energy Measurement", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Confirm method" />
                </SelectTrigger>
                <SelectContent>
                  {energyMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="Operational energy: Total"
              tooltip="Enter both regulated and unregulated energy (do not use Part L figures here)"
            >
              <div className="relative">
                <Input
                  placeholder="Enter value (e.g. 65)"
                  value={stageData["Operational Energy Total"] || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "Operational Energy Total",
                      e.target.value
                    )
                  }
                  type="number"
                  min="0"
                  max="150"
                  className="pr-20"
                />
                <Unit>kWh/m²/yr</Unit>
              </div>
            </TooltipField>

            <TooltipField
              label="Operational energy: Part L"
              tooltip="Enter regulated operational energy use (Part L)"
            >
              <div className="relative">
                <Input
                  placeholder="Enter value (e.g. 45)"
                  value={stageData["Operational Energy Part L"] || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "Operational Energy Part L",
                      e.target.value
                    )
                  }
                  type="number"
                  min="0"
                  max="150"
                  className="pr-20"
                />
                <Unit>kWh/m²/yr</Unit>
              </div>
            </TooltipField>

            <TooltipField
              label="Operational energy: Gas"
              tooltip="Enter gas energy use; enter 0 if no gas is used on site"
            >
              <div className="relative">
                <Input
                  placeholder="Enter value (e.g. 35)"
                  value={stageData["Operational Energy Gas"] || ""}
                  onChange={(e) =>
                    handleInputChange("Operational Energy Gas", e.target.value)
                  }
                  type="number"
                  min="0"
                  max="150"
                  className="pr-20"
                />
                <Unit>kWh/m²/yr</Unit>
              </div>
            </TooltipField>

            <TooltipField
              label="Space heating demand"
              tooltip="Enter the building's total space heating demand"
            >
              <div className="relative">
                <Input
                  placeholder="Enter value (e.g. 35)"
                  value={stageData["Space Heating Demand"] || ""}
                  onChange={(e) =>
                    handleInputChange("Space Heating Demand", e.target.value)
                  }
                  type="number"
                  min="0"
                  className="pr-20"
                />
                <Unit>kWh/m²/yr</Unit>
              </div>
            </TooltipField>

            <TooltipField
              label="Renewable energy type"
              tooltip="Select the type of renewable energy (e.g. PV, wind)"
            >
              <Select
                value={stageData["Renewable Energy Type"] || ""}
                onValueChange={(value) =>
                  handleInputChange("Renewable Energy Type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose renewable type (e.g. PV)" />
                </SelectTrigger>
                <SelectContent>
                  {renewableTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="Renewable energy generation"
              tooltip="Enter the annual renewable energy generated per m² GIA"
            >
              <div className="relative">
                <Input
                  placeholder="Enter value (e.g. 5,000)"
                  value={stageData["Total Renewable Energy Generation"] || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "Total Renewable Energy Generation",
                      e.target.value
                    )
                  }
                  type="number"
                  min="0"
                  className="pr-16"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                  kWh/yr
                </div>
              </div>
            </TooltipField>
          </div>

          {/* Embodied Carbon */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-500 py-0 px-6">
              Embodied Carbon
            </h3>

            <TooltipField
              label="Structural frame material"
              tooltip="Select the dominant material used in the structural frame"
            >
              <Select
                value={stageData["Structural Frame Materials"] || ""}
                onValueChange={(value) =>
                  handleInputChange("Structural Frame Materials", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {structuralMaterials.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipField>

            <TooltipField
              label="Upfront carbon"
              tooltip="Enter embodied carbon for stages A1–A5"
            >
              <div className="relative">
                <Input
                  placeholder="Enter value (e.g. 600)"
                  value={stageData["Upfront Carbon"] || ""}
                  onChange={(e) =>
                    handleInputChange("Upfront Carbon", e.target.value)
                  }
                  type="number"
                  min="0"
                  max="1500"
                  className="pr-24"
                />
                <Unit>kgCO₂e/m²</Unit>
              </div>
            </TooltipField>

            <TooltipField
              label="Total embodied carbon"
              tooltip="Enter total embodied carbon for life cycle stages A1–C4"
            >
              <div className="relative">
                <Input
                  placeholder="Enter value (e.g. 900)"
                  value={stageData["Total Embodied Carbon"] || ""}
                  onChange={(e) =>
                    handleInputChange("Total Embodied Carbon", e.target.value)
                  }
                  type="number"
                  min="0"
                  max="1500"
                  className="pr-24"
                />
                <Unit>kgCO₂e/m²</Unit>
              </div>
            </TooltipField>

            <TooltipField
              label="Biogenic carbon"
              tooltip="Enter total biogenic carbon (use a negative number)"
            >
              <div className="relative">
                <Input
                  placeholder="Enter value (e.g. -150)"
                  value={stageData["Biogenic Carbon"] || ""}
                  onChange={(e) =>
                    handleInputChange("Biogenic Carbon", e.target.value)
                  }
                  type="number"
                  min="-600"
                  max="0"
                  className="pr-24"
                />
                <Unit>
                  kgCO<sub>2</sub>e/m<sup>2</sup>
                </Unit>
              </div>
            </TooltipField>

            <TooltipField
              label="Embodied carbon scope clarifications"
              tooltip="Specify scope, life cycle modules, and whether using RICS V1 or V2 etc."
            >
              <Textarea
                placeholder="e.g. A1–A5 only"
                value={stageData["Embodied Carbon Scope Clarifications"] || ""}
                onChange={(e) =>
                  handleInputChange(
                    "Embodied Carbon Scope Clarifications",
                    e.target.value
                  )
                }
                maxLength={300}
                className="resize-none"
              />
            </TooltipField>
          </div>

          {/* Ecology & Biodiversity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-500 py-0 px-6">
              Ecology & Biodiversity
            </h3>

            <TooltipField
              label="Biodiversity net gain"
              tooltip="Enter the predicted Biodiversity Net Gain percentage"
            >
              <div className="relative">
                <Input
                  placeholder="Enter value (e.g. 10)"
                  value={stageData["Biodiversity Net Gain"] || ""}
                  onChange={(e) =>
                    handleInputChange("Biodiversity Net Gain", e.target.value)
                  }
                  type="number"
                  min="0"
                  max="200"
                  className="pr-8"
                />
                <Unit>%</Unit>
              </div>
            </TooltipField>

            <TooltipField
              label="Habitat units gained"
              tooltip="Enter the number of habitat units gained"
            >
              <Input
                placeholder="Enter value (e.g. 13)"
                value={stageData["Habitats Units Gained"] || ""}
                onChange={(e) =>
                  handleInputChange("Habitats Units Gained", e.target.value)
                }
                type="number"
                min="0"
                max="50"
              />
            </TooltipField>

            <TooltipField
              label="Urban greening factor"
              tooltip="Enter Urban Greening Factor score, if applicable"
            >
              <Input
                placeholder="Enter value (e.g. 0.3)"
                value={stageData["Urban Greening Factor"] || ""}
                onChange={(e) =>
                  handleInputChange("Urban Greening Factor", e.target.value)
                }
                type="number"
                step="0.1"
                min="0"
                max="10"
              />
            </TooltipField>

            <TooltipField
              label="Additional notes"
              tooltip="Add any clarifications relating to biodiversity"
            >
              <Textarea
                placeholder="Add clarification"
                value={
                  stageData["General Biodiversity Clarification Notes"] || ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "General Biodiversity Clarification Notes",
                    e.target.value
                  )
                }
                maxLength={300}
                className="resize-none"
              />
            </TooltipField>
          </div>
        </div>
      </div>

      {/* Fixed footer buttons */}
      <div className="my-4 pt-4 border-t bg-background">
        <div className="flex justify-between">
          <AlertDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Are you sure you want to cancel?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  All unsaved work will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                <AlertDialogAction onClick={onCancel}>
                  Discard changes and exit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-2">
            <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Save</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Project data saved successfully
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={() => {
                      onSave();
                      setShowSaveDialog(false);
                    }}
                  >
                    OK
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
              <AlertDialogTrigger asChild>
                <Button>Save & Exit</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Save progress and exit?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep editing</AlertDialogCancel>
                  <AlertDialogAction onClick={onSaveAndExit}>
                    Yes, Save & Exit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};
