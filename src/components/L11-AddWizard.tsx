import { useState } from "react";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/components/Key/project";
import { AddSelection } from "./AddSub/P00-Selection";
import { AddOverview } from "./AddSub/P11-Overview";
import { AddCertifications } from "./AddSub/P12-Certifications";
import { AddRIBAStage } from "./AddSub/P13-RIBAStage";
import { StageKey, StageKeys } from "./Key/KeyStage";

interface AddProjectDataWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: WizardData) => void;
  projects: Project[];
}

export type WizardStep =
  | "project-selection"
  | "project-overview"
  | "certifications"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7";

export interface WizardData {
  id: string;
  "Operational Energy Existing Building"?: string;
  GIA?: string;
  "Building Lifespan"?: string;
  "PC Year"?: string;
  "Construction Start Year"?: string;

  "EI Team Scope"?: string;
  "External Consultants"?: string;
  "Project Lead"?: string;
  "Mission Statement"?: string;

  BREEAM: string;
  LEED: string;
  WELL: string;
  Fitwell?: string;
  Passivhaus: string;
  EnerPHit: string;
  UKNZCBS?: string;
  NABERS: string;
  "Other Cerification"?: string;

  "Current RIBA Stage": string;

  "RIBA Stage": {
    [key: string]: {
      // Stage-specific data
      "Updated GIA"?: string;
      "Method Energy Measurement"?: string;

      "Operational Energy"?: string;
      "Operational Energy Part L"?: string;
      "Operational Energy Gas"?: string;

      "Space Heating Demand"?: string;
      "Renewable Energy Type"?: string;
      "Renewable Energy Generation"?: string;
      "Structural Frame Materials"?: string;

      "Upfront Carbon"?: string;
      "Embodied Carbon"?: string;
      "Biogenic Carbon"?: string;
      "Embodied Carbon Scope Clarifications"?: string;

      "Biodiversity Net Gain"?: string;
      "Habitats Units Gained"?: string;
      "Urban Greening Factor"?: string;
      "General Biodiversity Clarification Notes"?: string;
    };
  };
}

export const AddProjectDataWizard = ({
  isOpen,
  onClose,
  onSave,
  projects,
}: AddProjectDataWizardProps) => {
  const [currentStep, setCurrentStep] =
    useState<WizardStep>("project-selection");
  const [activeTab, setActiveTab] = useState<string>("project-overview");
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    { tab: string; errors: string[] }[]
  >([]);
  const [isFormValid, setIsFormValid] = useState(true);

  React.useEffect(() => {
    setIsFormValid(validationErrors.length === 0);
  }, [validationErrors]);
  const [wizardData, setWizardData] = useState<WizardData>({
    id: "",
    "Operational Energy Existing Building": "",
    GIA: "",
    "Building Lifespan": "",
    "PC Year": "",
    "Construction Start Year": "",

    "EI Team Scope": "",
    "External Consultants": "",
    "Project Lead": "",
    "Mission Statement": "",

    BREEAM: "",
    LEED: "",
    WELL: "",
    Fitwell: "",
    Passivhaus: "",
    EnerPHit: "",
    UKNZCBS: "",
    NABERS: "",
    "Other Cerification": "",

    "Current RIBA Stage": "",

    "RIBA Stage": {},
  });

  // Reset wizard to initial state when dialog opens
  const resetWizard = () => {
    setCurrentStep("project-selection");
    setActiveTab("project-overview");
    setWizardData({
      id: "",
      "Operational Energy Existing Building": "",
      GIA: "",
      "Building Lifespan": "",
      "PC Year": "",
      "Construction Start Year": "",

      "EI Team Scope": "",
      "External Consultants": "",
      "Project Lead": "",
      "Mission Statement": "",

      BREEAM: "",
      LEED: "",
      WELL: "",
      Fitwell: "",
      Passivhaus: "",
      EnerPHit: "",
      UKNZCBS: "",
      NABERS: "",
      "Other Cerification": "",

      "Current RIBA Stage": "",

      "RIBA Stage": {},
    });
  };

  // Reset when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      resetWizard();
    }
  }, [isOpen]);

  // Helper function to populate wizard data with existing project data
  const populateWizardDataFromProject = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    // Map certification values to wizard format
    const mapCertificationValue = (value: string) => {
      if (!value || value === "N/A") return "";
      return value.toLowerCase().replace(" ", "-");
    };

    const mapStageData = (stage: Project["RIBA Stage"][StageKey]) => ({
      "Updated GIA": stage?.["Updated GIA"]?.toString() || "",
      "Method Energy Measurement":
        stage?.["Method Energy Measurement"]?.toString() || "",

      "Operational Energy": stage?.["Operational Energy"]?.toString() || "",
      "Operational Energy Part L":
        stage?.["Operational Energy Part L"]?.toString() || "",
      "Operational Energy Gas":
        stage?.["Operational Energy Gas"]?.toString() || "",

      "Space Heating Demand": stage?.["Space Heating Demand"]?.toString() || "",
      "Renewable Energy Type": stage?.["Renewable Energy Type"] || "",
      "Renewable Energy Generation":
        stage?.["Renewable Energy Generation"]?.toString() || "",
      "Structural Frame Materials": stage?.["Structural Frame Materials"] || "",

      "Upfront Carbon": stage?.["Upfront Carbon"]?.toString() || "",
      "Embodied Carbon": stage?.["Embodied Carbon"]?.toString() || "",
      "Biogenic Carbon": stage?.["Biogenic Carbon"]?.toString() || "",
      "Embodied Carbon Scope Clarifications":
        stage?.["Embodied Carbon Scope Clarifications"] || "",

      "Biodiversity Net Gain":
        stage?.["Biodiversity Net Gain"]?.toString() || "",
      "Habitats Units Gained":
        stage?.["Habitats Units Gained"]?.toString() || "",
      "Urban Greening Factor":
        stage?.["Urban Greening Factor"]?.toString() || "",
      "General Biodiversity Clarification Notes":
        stage?.["General Biodiversity Clarification Notes"] || "",
    });

    // Build all stages dynamically
    const ribaStagesData: WizardData["RIBA Stage"] = StageKeys.reduce(
      (acc, key) => {
        acc[key] = mapStageData(project["RIBA Stage"]?.[key]);
        return acc;
      },
      {} as WizardData["RIBA Stage"]
    );

    setWizardData((prev) => ({
      ...prev,
      id: projectId,
      "Operational Energy Existing Building":
        project["Operational Energy Existing Building"]?.toString() || "",
      GIA: project["GIA"]?.toString() || "",
      "PC Year": project["PC Year"] ? project["PC Year"].toString() : "",
      "Construction Start Year": project["Construction Start Year"]
        ? project["Construction Start Year"].toString()
        : "",

      BREEAM: mapCertificationValue(project["BREEAM"] || ""),
      LEED: mapCertificationValue(project["LEED"] || ""),
      WELL: mapCertificationValue(project["WELL"] || ""),
      Passivhaus: project["Passivhaus"] ? "Passivhaus" : "",
      EnerPHit: project["EnerPHit"] ? "EnerPHit" : "",
      NABERS: project["NABERS"]?.includes("Star") ? "yes" : "",
      "RIBA Stage": {
        ...prev["RIBA Stage"],
        ...ribaStagesData,
      },
    }));

    // Move to tabbed interface after project selection
    setCurrentStep("project-overview");
  };

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  };

  const handleProjectSelect = (projectId: string) => {
    populateWizardDataFromProject(projectId);
  };

  const handleSave = () => {
    console.log("Saving data for current tab:", activeTab);
    // Individual save without closing
  };

  const handleSaveAndExit = () => {
    onSave(wizardData);
    resetWizard();
    onClose();
  };

  const handleCancel = () => {
    resetWizard();
    onClose();
  };

  const selectedProject = projects.find((p) => p.id === wizardData.id);

  const renderCurrentStep = () => {
    if (currentStep === "project-selection") {
      return (
        <div className="p-6">
          <AddSelection
            projects={projects}
            id={wizardData.id}
            onProjectSelect={handleProjectSelect}
            onNext={() => setCurrentStep("project-overview")}
            onCancel={onClose}
          />
        </div>
      );
    }

    // Tabbed interface for all other steps
    return (
      <div className="flex flex-col h-[90vh] overflow-hidden">
        <div className="flex flex-col overflow-hidden px-6 pt-6 pb-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold px-6">
              Project Data - {selectedProject?.["id"]}{" "}
              {selectedProject?.["Project Name"]}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full h-full flex flex-col"
            >
              <TabsList className="flex h-16 gap-2 rounded-full bg-gray-100 p-4 my-4">
                <TabsTrigger
                  value="project-overview"
                  className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
                >
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="certifications"
                  className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
                >
                  <span>Certifications</span>
                </TabsTrigger>

                <div className="flex-[2] flex gap-4 justify-end items-center text-sm">
                  <span>RIBA Stage</span>
                </div>

                {StageKeys.map((key) => (
                  <TabsTrigger
                    value={key}
                    className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
                  >
                    <span>{key}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex-1 overflow-hidden rounded-tl-[32px] rounded-tr-[32px] h-full">
                <TabsContent
                  value="project-overview"
                  className="h-full overflow-y-auto"
                >
                  <AddOverview
                    selectedProject={selectedProject}
                    projectData={wizardData}
                    onDataUpdate={(data) => updateWizardData(data)}
                  />
                </TabsContent>

                <TabsContent
                  value="certifications"
                  className="h-full overflow-y-auto"
                >
                  <AddCertifications
                    projectData={wizardData}
                    onDataUpdate={(data) => updateWizardData(data)}
                  />
                </TabsContent>

                {StageKeys.map((stage) => (
                  <TabsContent
                    key={stage}
                    value={stage}
                    className="h-full overflow-y-auto mt-0"
                  >
                    <AddRIBAStage
                      stageNumber={stage.split("-")[1]}
                      stageData={wizardData["RIBA Stage"][stage] || {}}
                      projectGia={wizardData["GIA"]}
                      onDataUpdate={(data) => {
                        const updatedRibaStages = {
                          ...wizardData["RIBA Stage"],
                          [stage]: data,
                        };
                        updateWizardData({
                          "RIBA Stage": updatedRibaStages,
                        });
                      }}
                      onValidationChange={(isValid, errorMessage) => {
                        const tabName = stage; // use exact tab id

                        setValidationErrors((prev) => {
                          // Remove existing errors for this tab
                          const filtered = prev.filter((e) => e.tab !== tabName);
                          // Add new errors if invalid
                          if (!isValid && errorMessage) {
                            return [
                              ...filtered,
                              { tab: tabName, errors: errorMessage.split("; ") },
                            ];
                          }
                          return filtered;
                        });
                      }}
                      currentStep={stage as WizardStep}
                      completedSteps={[]}
                      stageCompletionData={{
                        "riba-1": {
                          completed: true,
                          date: "10.01.2025",
                        },
                        "riba-2": {
                          completed: true,
                          date: "12.06.2025",
                        },
                      }}
                    />
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="bg-background shadow-inner rounded-full h-[80px] p-4 mt-auto">
          <div className="flex justify-between items-center">
            <AlertDialog
              open={showCancelDialog}
              onOpenChange={setShowCancelDialog}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="lg">
                  Cancel
                </Button>
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
                  <AlertDialogAction onClick={handleCancel}>
                    Discard changes and exit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-2 items-center">
              {validationErrors.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <AlertTriangle className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="h-5 w-5" />
                        Validation Errors
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-4 pt-4">
                        <p className="text-foreground font-medium">
                          Please fix the following errors before saving:
                        </p>
                        <div className="space-y-2">
                          {validationErrors.flatMap((tabError) =>
                            tabError.errors.map((error, errorIndex) => (
                              <div
                                key={`${tabError.tab}-${errorIndex}`}
                                className="flex items-start gap-2"
                              >
                                <Badge
                                  variant="destructive"
                                  className="text-xs px-2 py-0.5 shrink-0"
                                >
                                  {tabError.tab === "project-overview"
                                    ? "Overview"
                                    : tabError.tab === "certifications"
                                    ? "Certifications"
                                    : tabError.tab.includes("-")
                                    ? `RIBA Stage ${tabError.tab.split("-")[1]}`
                                    : `RIBA Stage ${tabError.tab}`}
                                </Badge>
                                <span className="text-muted-foreground text-sm">
                                  {error}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>OK</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <AlertDialog
                open={showSaveDialog}
                onOpenChange={setShowSaveDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={!isFormValid}
                    className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    Save
                  </Button>
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
                        handleSave();
                        setShowSaveDialog(false);
                      }}
                    >
                      OK
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog
                open={showExitDialog}
                onOpenChange={setShowExitDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    size="lg"
                    disabled={!isFormValid}
                    className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    Save & Exit
                  </Button>
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
                    <AlertDialogAction onClick={handleSaveAndExit}>
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

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-4xl"
        hideCloseButton={true}
        preventOutsideClick={true}
      >
        {renderCurrentStep()}
      </DialogContent>
    </Dialog>
  );
};
