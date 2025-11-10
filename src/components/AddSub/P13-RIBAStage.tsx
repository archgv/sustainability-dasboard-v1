import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WizardData } from "../L11-AddWizard";
import { StageKey } from "@/components/Key/KeyStage";
import { TooltipField } from "../ui/tooltip-field";
import { Unit } from "../ui/unit";
import { z } from "zod";

const operationalEnergySchema = z.object({
  "Operational Energy": z.string().refine(
    (val) => {
      if (!val || val === "") return true; // Allow empty
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 500;
    },
    { message: "Operational Energy must be between 0-500 kWh/m²/yr" }
  ),
});

interface RibaStageProps {
  stageNumber: string;
  stageData: Partial<WizardData["RIBA Stage"][StageKey]>;
  projectGia: string;
  onDataUpdate: (data: WizardData["RIBA Stage"][StageKey]) => void;
  onValidationChange?: (isValid: boolean, errorMessage?: string) => void;
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
  onValidationChange,
  currentStep,
  completedSteps,
  stageCompletionData,
}: RibaStageProps) => {
  const [validationError, setValidationError] = useState<string>("");

  const validateOperationalEnergy = (value: string) => {
    const result = operationalEnergySchema.safeParse({
      "Operational Energy": value,
    });

    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "";
      setValidationError(errorMessage);
      onValidationChange?.(false, errorMessage);
      return false;
    } else {
      setValidationError("");
      onValidationChange?.(true);
      return true;
    }
  };

  useEffect(() => {
    if (stageData["Operational Energy"]) {
      validateOperationalEnergy(stageData["Operational Energy"]);
    } else {
      setValidationError("");
      onValidationChange?.(true);
    }
  }, [stageData["Operational Energy"]]);

  const handleInputChange = (field: string, value: string) => {
    onDataUpdate({
      ...stageData,
      [field]: value,
    });

    if (field === "Operational Energy") {
      validateOperationalEnergy(value);
    }
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

  const epcRating = ["A", "B", "C", "D", "E", "F", "G"];

  const embodiedMethod = [
    "Benchmark",
    "OneClick LCA",
    "H\\B:ERT",
    "Other LCA tool",
  ];

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TooltipField
            label="Update GIA (only if different)"
            tooltip='Enter a stage specific GIA below, if the value is different to the GIA indicated in the "Overview" tab'
          >
            <div className="relative">
              <Input
                placeholder={`Enter alternative value, curently ${
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
              value={stageData["Energy Measurement Method"] || ""}
              onValueChange={(value) =>
                handleInputChange("Energy Measurement Method", value)
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
            label="Operational energy"
            tooltip="Enter both regulated and unregulated energy (do not use Part L figures here)"
          >
            <div className="relative">
              <Input
                placeholder="Enter value (e.g. 65)"
                value={stageData["Operational Energy"] || ""}
                onChange={(e) =>
                  handleInputChange("Operational Energy", e.target.value)
                }
                type="number"
                min="0"
                max="500"
                className={`pr-20 ${
                  validationError
                    ? "border-2 border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              <Unit>kWh/m²/yr</Unit>
            </div>
          </TooltipField>

          <TooltipField
            label="Operational energy: Part L"
            tooltip="Enter regulated and unregulated operational energy use (Part L)"
          >
            <div className="relative">
              <Input
                placeholder="Enter value (e.g. 45)"
                value={stageData["Operational Energy Part L"] || ""}
                onChange={(e) =>
                  handleInputChange("Operational Energy Part L", e.target.value)
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
            tooltip="Enter the building's space heating demand"
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
                value={stageData["Renewable Energy Generation"] || ""}
                onChange={(e) =>
                  handleInputChange(
                    "Renewable Energy Generation",
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

          <TooltipField label="EPC rating" tooltip="???">
            <Select
              value={stageData["Method Energy Measurement"] || ""}
              onValueChange={(value) =>
                handleInputChange("Method Energy Measurement", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="EPC rating" />
              </SelectTrigger>
              <SelectContent>
                {epcRating.map((rating) => (
                  <SelectItem key={rating} value={rating}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipField>
        </div>

        {/* Embodied Carbon */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-500 py-0 px-6">
            Embodied Carbon
          </h3>

          <TooltipField
            label="Carbon measurement method"
            tooltip="Provide the methodology used for measuring the embodied carbon"
          >
            <Select
              value={stageData["Method Energy Measurement"] || ""}
              onValueChange={(value) =>
                handleInputChange("Method Energy Measurement", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Embodied carbon measurement method" />
              </SelectTrigger>
              <SelectContent>
                {embodiedMethod.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipField>

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
            label="Embodied carbon"
            tooltip="Enter embodied carbon for life cycle stages A1–C4"
          >
            <div className="relative">
              <Input
                placeholder="Enter value (e.g. 900)"
                value={stageData["Embodied Carbon"] || ""}
                onChange={(e) =>
                  handleInputChange("Embodied Carbon", e.target.value)
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
            tooltip="Enter biogenic carbon (use a negative number)"
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
            label="Carbon scope clarifications"
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
  );
};
