import { Card } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Zap,
  Leaf,
  FileText,
  House,
  Hourglass,
} from "lucide-react";
import { Project } from "@/components/Key/project";

interface PortfolioProps {
  projects: Project[];
  isComparingToSelf?: boolean;
  selectedRibaStages?: string[];
  primaryProject?: string;
}

export const Portfolio = ({
  projects,
  isComparingToSelf = false,
  selectedRibaStages = [],
  primaryProject = "",
}: PortfolioProps) => {
  // Format numbers with commas
  const formatNumber = (num: number) => {
    if (num == null || isNaN(num as number)) return "";
    return num.toLocaleString();
  };

  const currrentStageProject = (project) =>
    project["RIBA Stage"][project["View RIBA Stage"]];

  return (
    <Card className="shadow-inner rounded-tl-[40px] rounded-tr-[40px] rounded-bl-none rounded-br-none pb-20">
      <div className="flex items-center justify-between mb-2">
        <h2 className="">
          {isComparingToSelf ? "Project RIBA Stages" : "Project Portfolio"}
        </h2>
        <div className="text-sm text-gray-300 pr-10">
          Showing {formatNumber(projects.length)}{" "}
          {isComparingToSelf ? "stages" : "projects"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, index) => {
          return (
            <Card
              key={project.id}
              className="px-8 pb-8 hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-4">
                {project["id"]} {project["Project Name"]}
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-sm text-gray-600">
                    Primary sector: {project["Primary Sector"]}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-sm text-gray-600">
                    Location: {project["Project Location"]}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  {/* <Calendar className="h-4 w-4 mr-2" /> */}
                  <span className="text-sm text-gray-600">
                    PC year: {project["PC Year"]}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  {/* <FileText className="h-4 w-4 mr-2" /> */}
                  <span className="text-sm text-gray-600">
                    RIBA stage: {project["Current RIBA Stage"]}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">
                    Type: {project["Project Type"]}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    GIA: {formatNumber(project["GIA"] || 0)} m²
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    Embodied Carbon:{" "}
                    {formatNumber(
                      currrentStageProject(project)["Embodied Carbon"]
                    )}{" "}
                    kgCO<sub>2</sub>e/m²
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    Operational Energy:{" "}
                    {formatNumber(
                      currrentStageProject(project)["Operational Energy"]
                    )}{" "}
                    kWh/m²/yr
                  </span>
                </div>

                {project["Project Type"] === "Retrofit" &&
                  project["Operational Energy Existing Building"] && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        Existing Building Energy:{" "}
                        {formatNumber(
                          project["Operational Energy Existing Building"]
                        )}{" "}
                        kWh/m²/yr
                      </span>
                    </div>
                  )}
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};
