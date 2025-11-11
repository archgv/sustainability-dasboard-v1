import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { AddProjectDataWizard } from "./L11-AddWizard";
import { Project } from "@/components/Key/project";
import { exportToExcel } from "./Util/UtilExcel";

import { WizardData } from "./L11-AddWizard";
import { sampleProjects } from "@/data/sampleData";

interface AddProjectDataProps {
  projects: Project[];
}

export const AddProjectData = ({ projects }: AddProjectDataProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveProjectData = (data: WizardData) => {
    console.log("Saving project data:", data);
    // Implementation would handle saving the data
  };

  return (
    <>
      <Card className="p-2">
        <Button
          className="rounded-full w-full h-[50px] border-0 shadow-inner bg-gray-50"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-24 w-24 mr-2" />
          <h2 className="hover:text-white p-0 m-0">Add Project Data</h2>
        </Button>

        <AddProjectDataWizard
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProjectData}
          projects={projects}
        />
      </Card>

      <div className="flex items-center justify-center gap-2 mt-6 mb-2">
        <div className="text-md text-gray-300">Total Projects</div>
        <div className="text-2xl font-bold text-pink-300">
          {sampleProjects.length}
        </div>

        <Button
          className="rounded-full w-16 h-10 shadow-inner bg-gray-50 ml-2"
          variant="outline"
          onClick={() => exportToExcel(sampleProjects)}
        >
          <Download className="h-5 w-5 mb-0.5" />
        </Button>
      </div>
    </>
  );
};
