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
    return num.toLocaleString();
  };

  const currrentStageProject = (project) =>
    project["RIBA Stage"][project["Current RIBA Stage"]];

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
                {project["Project Name"] || "ERROR"}
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  {/* <House className="h-4 w-4 mr-2" /> */}
                  <span className="text-sm text-gray-600">
                    Primary sector: {project["Primary Sector"] || "ERROR"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  {/* <MapPin className="h-4 w-4 mr-2" /> */}
                  <span className="text-sm text-gray-600">
                    Location: {project["Project Location"]}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  {/* <Calendar className="h-4 w-4 mr-2" /> */}
                  <span className="text-sm text-gray-600">
                    PC date:{" "}
                    {project["Current RIBA Stage"] === "7"
                      ? `${new Date(project["PC Date"]).getFullYear()}`
                      : `${new Date(project["PC Date"]).getFullYear()}`}
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
                    Type:{" "}
                    {project["Project Type"] === "New Build"
                      ? "New Build"
                      : "Retrofit"}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    GIA: {formatNumber(project["GIA"] || 0)} m²
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  {/* <Leaf className="h-4 w-4 mr-2 text-green-600" /> */}
                  <span className="font-medium">
                    Embodied Carbon:{" "}
                    {formatNumber(
                      currrentStageProject(project)["Total Embodied Carbon"]
                    )}{" "}
                    kgCO<sup>2</sup>e/m²
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  {/* <Zap className="h-4 w-4 mr-2 text-blue-600" /> */}
                  <span className="font-medium">
                    Operational Energy:{" "}
                    {formatNumber(
                      currrentStageProject(project)["Operational Energy Total"]
                    )}{" "}
                    kWh/m²/yr
                  </span>
                </div>

                {project["Project Type"] === "Retrofit" &&
                  project["Operational Energy Existing Building"] && (
                    <div className="text-sm text-gray-600">
                      {/* <Zap className="h-4 w-4 mr-2 text-orange-600" /> */}
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
