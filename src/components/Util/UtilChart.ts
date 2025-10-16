import { Project } from "../Key/project";
import { KPIOptions } from "../Key/KeyKPI";
import {
  totalEmbodiedCarbonBenchmarks,
  uknzcbsBenchmarks,
  uknzcbsOperationalEnergyBenchmarks,
} from "@/data/benchmarkData";
import { getGIA, getProjectCurrrentStage } from "../Util/UtilProject";

export const getChartTitle = (
  chartType: string,
  valueType: string,
  selectedKPI1: string,
  selectedKPI2: string
): string => {
  const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);
  const kpi2Config = KPIOptions.find((kpi) => kpi.key === selectedKPI2);
  const valueTypeLabel = valueType === "average" ? "per m²" : "total";

  switch (chartType) {
    case "Compare Two":
      return `${kpi1Config?.label} vs ${kpi2Config?.label} (${valueTypeLabel})`;
    case "Single Project":
      return `${kpi1Config?.label} by project (${valueTypeLabel})`;
    case "Single Time":
      return `${kpi1Config?.label} over time (${valueTypeLabel})`;
    default:
      return "Chart";
  }
};

export const hasBenchmarks = (projects: Project[]): boolean => {
  if (projects.length === 0) return false;
  return !!totalEmbodiedCarbonBenchmarks[
    projects[0]["Primary Sector"] as keyof typeof totalEmbodiedCarbonBenchmarks
  ];
};

export const getAvailableSubSectors = (
  projects: Project[],
  selectedKPI1: string
): string[] => {
  if (projects.length === 0) return [];

  // Check both upfront carbon and operational energy benchmarks
  if (selectedKPI1 === "Upfront Carbon") {
    const sectorData =
      uknzcbsBenchmarks[
        projects[0]["Primary Sector"] as keyof typeof uknzcbsBenchmarks
      ];
    return sectorData ? Object.keys(sectorData) : [];
  } else if (selectedKPI1 === "Operational Energy Total") {
    const sectorData =
      uknzcbsOperationalEnergyBenchmarks[
        projects[0][
          "Primary Sector"
        ] as keyof typeof uknzcbsOperationalEnergyBenchmarks
      ];
    return sectorData ? Object.keys(sectorData) : [];
  }

  return [];
};

export const getProjectData = (
  projects: Project[],
  valueType: string,
  selectedKPI1: string,
  selectedKPI2: string = ""
): Project[] => {
  return valueType === "average"
    ? projects
    : projects.map((project) => ({
        ...project,
        [selectedKPI1]:
          getProjectCurrrentStage(project)[selectedKPI1] * getGIA(project),
        [selectedKPI2]: selectedKPI2
          ? getProjectCurrrentStage(project)[selectedKPI2] * getGIA(project)
          : undefined,
      }));
};
