import { Project } from "../Key/project";
import { KPIOptions } from "../Key/KeyKPI";
import {
  benchmarkEmbodiedCarbon,
  benchmarkUpfrontCarbon,
} from "@/data/benchmarkData";
import { getChartTitle, getProjectData } from "./UtilChart";
import { getUnit } from "./ChartConfig";
import { getGIA } from "./UtilProject";

interface ExportCSVOptions {
  projects: Project[];
  chartType: string;
  selectedKPI1: string;
  selectedKPI2: string;
  valueType: string;
  isComparingToSelf?: boolean;
  showEmbodiedCarbonBenchmarks: boolean;
  selectedSubSector: string;
}

export const exportChartToCSV = (options: ExportCSVOptions) => {
  const {
    projects,
    chartType,
    selectedKPI1,
    selectedKPI2,
    valueType,
    isComparingToSelf = false,
    showEmbodiedCarbonBenchmarks,
    selectedSubSector,
  } = options;

  const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);
  const kpi2Config = KPIOptions.find((kpi) => kpi.key === selectedKPI2);

  const chartTitle = getChartTitle(
    chartType,
    selectedKPI1,
    selectedKPI2,
    valueType
  );
  let csvContent = `${chartTitle}\n\n`;

  const transformedProjects = getProjectData(
    projects,
    valueType,
    selectedKPI1,
    selectedKPI2
  );

  // CSV headers
  const headers = [
    "Project Name",
    `${kpi1Config.key} (${getUnit(kpi1Config, valueType, true)})`,
  ];

  // For Embodied Carbon charts, include biogenic carbon column
  if (chartType === "Single Project" && selectedKPI1 === "Embodied Carbon") {
    headers.push(`Biogenic (${getUnit(kpi1Config, valueType, true)})`);
  }

  if (chartType === "Compare Two") {
    headers.push(
      `${kpi2Config?.key} (${getUnit(kpi2Config, valueType, true)})`
    );
    headers.push("Building Area (m²)");
  }
  if (chartType === "Single Time") {
    headers.push("Completion Year");
  }
  csvContent += headers.join(",") + "\n";

  // CSV data rows
  transformedProjects.forEach((project) => {
    const baseId = project.id.split("-")[0];
    const displayName =
      isComparingToSelf && project["View RIBA Stage"]
        ? `${project["Project Name"]} (RIBA ${project["View RIBA Stage"]})`
        : project["Project Name"];

    const row = [
      `"${displayName}"`,
      (project[selectedKPI1 as keyof Project] as number)?.toString() || "0",
    ];

    // For Embodied Carbon charts, add biogenic carbon as negative value
    if (chartType === "Single Project" && selectedKPI1 === "Embodied Carbon") {
      const biogenicValue = project["Biogenic Carbon"] || 0;
      const finalBiogenicValue =
        valueType === "total"
          ? -Math.abs(biogenicValue * getGIA(project))
          : -Math.abs(biogenicValue);
      row.push(finalBiogenicValue.toString());
    }

    if (chartType === "Compare Two") {
      row.push(
        (project[selectedKPI2 as keyof Project] as number)?.toString() || "0"
      );
    }
    if (chartType === "Single Time") {
      row.push(project["PC Year"].toString());
    }

    csvContent += row.join(",") + "\n";
  });

  // Add benchmark data to CSV if available
  const getBenchmarkDataForCSV = () => {
    // Get UKNZCBS benchmark data for upfront carbon
    if (
      selectedKPI1 === "Upfront Carbon" &&
      selectedSubSector &&
      valueType === "average" &&
      projects.length > 0
    ) {
      const primaryProject = projects[0];
      const primarySector = primaryProject["Primary Sector"];

      // Get the PC year from the primary project to determine benchmark year
      let benchmarkYear = primaryProject["PC Year"] || 2025;
      if (benchmarkYear < 2025) benchmarkYear = 2025;

      // Get benchmark values for this sector and sub-sector
      const sectorData =
        benchmarkUpfrontCarbon[
          primarySector as keyof typeof benchmarkUpfrontCarbon
        ];
      if (!sectorData) return { lines: [], title: "" };

      const subSectorData =
        sectorData[selectedSubSector as keyof typeof sectorData];
      if (!subSectorData) return { lines: [], title: "" };

      const newBuildValue =
        subSectorData["New Build"]?.[
          benchmarkYear as keyof (typeof subSectorData)["New Build"]
        ];
      const retrofitValue =
        subSectorData["Retrofit"]?.[
          benchmarkYear as keyof (typeof subSectorData)["Retrofit"]
        ];

      const benchmarkLines = [];
      if (newBuildValue !== undefined) {
        benchmarkLines.push({
          name: `New Build (PC ${benchmarkYear})`,
          value: newBuildValue,
        });
      }
      if (retrofitValue !== undefined) {
        benchmarkLines.push({
          name: `Retrofit (PC ${benchmarkYear})`,
          value: retrofitValue,
        });
      }

      return {
        lines: benchmarkLines,
        title: `UKNZCBS: ${selectedSubSector}`,
      };
    }

    // Get benchmark data for total embodied carbon
    if (
      showEmbodiedCarbonBenchmarks &&
      selectedKPI1 === "Embodied Carbon" &&
      valueType === "average" &&
      projects.length > 0
    ) {
      // Get benchmark values for this sector
      const sectorBenchmarks =
        benchmarkEmbodiedCarbon[
          projects[0]["Primary Sector"] as keyof typeof benchmarkEmbodiedCarbon
        ];

      if (!sectorBenchmarks) return { lines: [], title: "" };

      const benchmarkLines = Object.entries(sectorBenchmarks).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      return {
        lines: benchmarkLines,
        title: `Benchmarks: ${projects[0]["Primary Sector"]}`,
      };
    }

    return { lines: [], title: "" };
  };

  const benchmarkData = getBenchmarkDataForCSV();
  if (benchmarkData.lines.length > 0) {
    csvContent += `\n${benchmarkData.title}\n`;
    csvContent += "Benchmark Name,Value\n";
    benchmarkData.lines.forEach((benchmark) => {
      csvContent += `"${benchmark.name}",${benchmark.value}\n`;
    });
  }

  // Download CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chart-data-${selectedKPI1}-${valueType}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
