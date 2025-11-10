import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Project } from "../Key/project";
import { KPIOptions } from "../Key/KeyKPI";
import { getSectorColor, getSectorBenchmarkColor } from "../Key/KeySector";
import { formatNumber } from "@/lib/utils";
import {
  benchmarkUpfrontCarbon,
  benchmarkOperationalEnergy,
} from "@/data/benchmarkData";
import { chartColors } from "../Key/KeyColor";
import { generateNiceTicks } from "../Util/UtilTick";
import {
  getResponsiveContainerProps,
  getChartProps,
  getCartesianGridProps,
  getYAxisProps,
  getXAxisProps,
  getTooltipContainerStyle,
  getUnit,
} from "../Util/ChartConfig";
import { getGIA, getProjectCurrrentStage } from "../Util/UtilProject";
import { getProjectData } from "../Util/UtilChart";

interface SingleTimeProps {
  projects: Project[];
  selectedKPI1: string;
  valueType: string;
  isComparingToSelf?: boolean;
  selectedSubSector: string;
}

export const SingleTime = ({
  projects,
  selectedKPI1,
  valueType,
  isComparingToSelf = false,
  selectedSubSector,
}: SingleTimeProps) => {
  const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);

  const chartData = projects
    .map((project) => {
      const projectCurrentStage = getProjectCurrrentStage(project);

      const kpiValues = Object.fromEntries(
        KPIOptions.map(({ key }) => {
          const multiplier = valueType === "total" ? getGIA(project) : 1;
          const value = Number(projectCurrentStage[key]) * multiplier;
          return [key, value];
        })
      );

      const displayName =
        isComparingToSelf && project["Current RIBA Stage"]
          ? `${project["Project Name"]} (RIBA ${project["Current RIBA Stage"]})`
          : project["Project Name"];

      // Extract year only from completion date
      const completionYear = project["PC Year"];

      return {
        id: project["id"],
        "Project Name": project["Project Name"],
        "Primary Sector": project["Primary Sector"],
        "Current RIBA Stage": project["Current RIBA Stage"],
        "Structural Frame Materials":
          projectCurrentStage?.["Structural Frame Materials"],
        displayName,
        completionYear,
        ...kpiValues,
      };
    })
    .sort((a, b) => a.completionYear - b.completionYear);

  // Get UKNZCBS benchmark data for timeline - ONLY for Upfront Carbon and Operational Energy with per sqm
  const showBenchmarkUpfrontCarbon =
    valueType === "average" &&
    selectedKPI1 === "Upfront Carbon" &&
    chartData.length > 0;
  const showBenchmarkOperationalEnergy =
    valueType === "average" &&
    selectedKPI1 === "Operational Energy" &&
    chartData.length > 0;

  // Create UKNZCBS benchmark data for upfront carbon
  const createUpfrontBenchmarkData = () => {
    if (!showBenchmarkUpfrontCarbon || !projects[0] || !selectedSubSector) {
      return { newBuildData: [], retrofitData: [] };
    }

    const sectorData =
      benchmarkUpfrontCarbon[
        projects[0]["Primary Sector"] as keyof typeof benchmarkUpfrontCarbon
      ];
    if (!sectorData) {
      return { newBuildData: [], retrofitData: [] };
    }

    const subSectorData =
      sectorData[selectedSubSector as keyof typeof sectorData];
    if (!subSectorData) {
      return { newBuildData: [], retrofitData: [] };
    }

    // Create benchmark lines from 2025 to 2050
    const years = Array.from({ length: 26 }, (_, i) => 2025 + i);

    const newBuildData = years
      .map((year) => ({
        completionYear: year,
        benchmarkValue:
          subSectorData["New Build"][
            year as keyof (typeof subSectorData)["New Build"]
          ],
        benchmarkType: "New Build",
      }))
      .filter((item) => item.benchmarkValue !== undefined);

    const retrofitData = subSectorData["Retrofit"]
      ? years
          .map((year) => ({
            completionYear: year,
            benchmarkValue:
              subSectorData["Retrofit"][
                year as keyof (typeof subSectorData)["Retrofit"]
              ],
            benchmarkType: "Retrofit",
          }))
          .filter((item) => item.benchmarkValue !== undefined)
      : [];

    return { newBuildData, retrofitData };
  };

  const upfrontBenchmarkData = createUpfrontBenchmarkData();

  // Create operational energy benchmark data for timeline
  const createOperationalEnergyBenchmarkData = () => {
    const sectorData =
      benchmarkOperationalEnergy[
        projects[0]["Primary Sector"] as keyof typeof benchmarkOperationalEnergy
      ];
    const subSectorData =
      sectorData[selectedSubSector as keyof typeof sectorData];
    if (
      !showBenchmarkOperationalEnergy ||
      !projects[0] ||
      !selectedSubSector ||
      !sectorData ||
      !subSectorData
    ) {
      return { newBuildData: [], retrofitData: [] };
    }

    // Only include years from 2025 onwards for operational energy benchmarks
    const benchmarkYears = Array.from({ length: 26 }, (_, i) => 2025 + i);

    const newBuildData = benchmarkYears
      .map((year) => {
        const newBuildValues = subSectorData["New Build"];
        const value = newBuildValues?.[year as keyof typeof newBuildValues];

        return {
          completionYear: year,
          benchmarkValue: value,
        };
      })
      .filter(
        (item) =>
          item.benchmarkValue !== undefined && item.benchmarkValue !== null
      );

    const retrofitData = benchmarkYears
      .map((year) => {
        const retrofitValues = subSectorData["Retrofit"];
        const value = retrofitValues?.[year as keyof typeof retrofitValues];

        return {
          completionYear: year,
          benchmarkValue: value,
        };
      })
      .filter(
        (item) =>
          item.benchmarkValue !== undefined && item.benchmarkValue !== null
      );

    return { newBuildData, retrofitData };
  };

  const operationalEnergyBenchmarkData = createOperationalEnergyBenchmarkData();
  const benchmarkColor = projects[0]
    ? getSectorBenchmarkColor(projects[0]["Primary Sector"])
    : "#1E9F5A";

  // Determine graph range based on project data
  const projectYears = chartData.map((p) => p.completionYear);
  const minProjectYear = Math.min(...projectYears);
  const maxProjectYear = Math.max(...projectYears);

  // Set X-axis domain to start at 2020 (or earlier project year) and extend to 2050
  const xAxisDomain = [Math.min(2020, minProjectYear), 2050];
  const xAxisTicks = [
    2020, 2022, 2024, 2026, 2028, 2030, 2032, 2034, 2036, 2038, 2040, 2042,
    2044, 2046, 2048, 2050,
  ];

  return (
    <ResponsiveContainer {...getResponsiveContainerProps()}>
      <LineChart data={chartData} {...getChartProps()}>
        <CartesianGrid {...getCartesianGridProps()} />
        <XAxis
          {...getXAxisProps("Single Time", kpi1Config, valueType)}
          dataKey="completionYear"
          type="number"
          scale="linear"
          domain={xAxisDomain}
          ticks={xAxisTicks}
          tickFormatter={(value) => value.toString()}
          tick={{ fill: chartColors.dark, fontSize: 12 }}
        />
        <YAxis
          {...getYAxisProps("Single Time", kpi1Config, valueType)}
          tickFormatter={(value) => formatNumber(value)}
          ticks={(() => {
            const maxValue = Math.max(
              ...chartData.map((p) => Math.abs(p[selectedKPI1] || 0)),
              ...(showBenchmarkUpfrontCarbon &&
              upfrontBenchmarkData.newBuildData
                ? upfrontBenchmarkData.newBuildData.map((b) => b.benchmarkValue)
                : []),
              ...(showBenchmarkUpfrontCarbon &&
              upfrontBenchmarkData.retrofitData
                ? upfrontBenchmarkData.retrofitData.map((b) => b.benchmarkValue)
                : []),
              ...(showBenchmarkOperationalEnergy &&
              operationalEnergyBenchmarkData.newBuildData
                ? operationalEnergyBenchmarkData.newBuildData.map(
                    (b) => b.benchmarkValue || 0
                  )
                : []),
              ...(showBenchmarkOperationalEnergy &&
              operationalEnergyBenchmarkData.retrofitData
                ? operationalEnergyBenchmarkData.retrofitData.map(
                    (b) => b.benchmarkValue || 0
                  )
                : [])
            );
            return generateNiceTicks(maxValue * 1.1);
          })()}
        />
        <Tooltip
          contentStyle={getTooltipContainerStyle()}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const projectData = payload.find(
                (p) => p.dataKey === selectedKPI1
              );
              const year = parseInt(label as string);

              // Find benchmark values for this year
              let newBuildBenchmark = null;
              let retrofitBenchmark = null;

              if (showBenchmarkUpfrontCarbon) {
                newBuildBenchmark = upfrontBenchmarkData.newBuildData.find(
                  (d) => d.completionYear === year
                )?.benchmarkValue;
                retrofitBenchmark = upfrontBenchmarkData.retrofitData.find(
                  (d) => d.completionYear === year
                )?.benchmarkValue;
              } else if (showBenchmarkOperationalEnergy) {
                newBuildBenchmark =
                  operationalEnergyBenchmarkData.newBuildData.find(
                    (d) => d.completionYear === year
                  )?.benchmarkValue;
                retrofitBenchmark =
                  operationalEnergyBenchmarkData.retrofitData.find(
                    (d) => d.completionYear === year
                  )?.benchmarkValue;
              }

              return (
                <div
                  className="bg-white p-3 border rounded-lg shadow-lg"
                  style={{
                    backgroundColor: "white",
                    borderColor: chartColors.primary,
                  }}
                >
                  <p
                    className="font-semibold"
                    style={{ color: chartColors.dark }}
                  >
                    Year: {label}
                  </p>
                  {projectData && (
                    <>
                      <p
                        className="text-sm"
                        style={{ color: chartColors.dark }}
                      >
                        {projectData.payload.id}{" "}
                        {projectData.payload.displayName}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: chartColors.dark }}
                      >
                        {kpi1Config.key}:{" "}
                        {formatNumber(projectData.value as number)}{" "}
                        {getUnit(kpi1Config, valueType)}
                      </p>
                    </>
                  )}
                  {(newBuildBenchmark || retrofitBenchmark) && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      {newBuildBenchmark && (
                        <p
                          className="text-sm"
                          style={{ color: benchmarkColor }}
                        >
                          New Build: {formatNumber(newBuildBenchmark)}{" "}
                          {getUnit(kpi1Config, valueType)}
                        </p>
                      )}
                      {retrofitBenchmark && (
                        <p
                          className="text-sm"
                          style={{ color: benchmarkColor }}
                        >
                          Retrofit: {formatNumber(retrofitBenchmark)}{" "}
                          {getUnit(kpi1Config, valueType)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          }}
        />

        {/* Project data as scatter points */}
        <Line
          type="monotone"
          dataKey={selectedKPI1}
          stroke="transparent"
          strokeWidth={0}
          dot={false}
          name={kpi1Config.key || selectedKPI1}
          legendType="none"
        />

        {/* Render dots with sector colors */}
        {chartData.map((project, index) => {
          const sectorColor = getSectorColor(project["Primary Sector"]);
          return (
            <Line
              key={`dot-${index}`}
              type="monotone"
              dataKey={selectedKPI1}
              data={[project]}
              stroke="transparent"
              strokeWidth={0}
              dot={{ fill: sectorColor, strokeWidth: 2, r: 6 }}
              legendType="none"
            />
          );
        })}

        {/* UKNZCBS upfront carbon benchmark lines */}
        {showBenchmarkUpfrontCarbon &&
          upfrontBenchmarkData.newBuildData.length > 0 && (
            <Line
              type="monotone"
              dataKey="benchmarkValue"
              data={upfrontBenchmarkData.newBuildData}
              stroke={benchmarkColor}
              strokeWidth={2}
              strokeDasharray="10 5"
              dot={false}
              name="New Build Benchmark"
              connectNulls={false}
              label={({ x, y, index }) => {
                const isLast =
                  index === upfrontBenchmarkData.newBuildData.length - 1;
                if (!isLast) return null;
                return (
                  <text
                    x={x}
                    y={y - 20}
                    textAnchor="middle"
                    fill={benchmarkColor}
                    fontSize={12}
                    fontWeight="bold"
                  >
                    New Build
                  </text>
                );
              }}
            />
          )}

        {showBenchmarkUpfrontCarbon &&
          upfrontBenchmarkData.retrofitData.length > 0 && (
            <Line
              type="monotone"
              dataKey="benchmarkValue"
              data={upfrontBenchmarkData.retrofitData}
              stroke={benchmarkColor}
              strokeWidth={2}
              strokeDasharray="2 2"
              dot={false}
              name="Retrofit Benchmark"
              connectNulls={false}
              label={({ x, y, index }) => {
                const isLast =
                  index === upfrontBenchmarkData.retrofitData.length - 1;
                if (!isLast) return null;
                return (
                  <text
                    x={x}
                    y={y + 20}
                    textAnchor="middle"
                    fill={benchmarkColor}
                    fontSize={12}
                    fontWeight="bold"
                  >
                    Retrofit
                  </text>
                );
              }}
            />
          )}

        {/* UKNZCBS operational energy benchmark lines */}
        {showBenchmarkOperationalEnergy &&
          operationalEnergyBenchmarkData.newBuildData.length > 0 && (
            <Line
              type="monotone"
              dataKey="benchmarkValue"
              data={operationalEnergyBenchmarkData.newBuildData}
              stroke={benchmarkColor}
              strokeWidth={2}
              strokeDasharray="10 5"
              dot={false}
              name="New Build Benchmark"
              connectNulls={false}
              label={({ x, y, index, value, dataIndex, viewBox, ...props }) => {
                const { data } = props; // not always passed, so use operationalEnergyBenchmarkData if needed
                const isLast =
                  index ===
                  operationalEnergyBenchmarkData.newBuildData.length - 1;
                if (!isLast) return null;
                return (
                  <text
                    x={x}
                    y={y + 20} // move text slightly above the dot
                    textAnchor="middle"
                    fill={benchmarkColor}
                    fontSize={12}
                    fontWeight="bold"
                  >
                    New Build
                  </text>
                );
              }}
            />
          )}

        {showBenchmarkOperationalEnergy &&
          operationalEnergyBenchmarkData.retrofitData.length > 0 && (
            <Line
              type="monotone"
              dataKey="benchmarkValue"
              data={operationalEnergyBenchmarkData.retrofitData}
              stroke={benchmarkColor}
              strokeWidth={2}
              strokeDasharray="2 2"
              dot={false}
              name="Retrofit Benchmark"
              connectNulls={false}
              label={({ x, y, index, value, dataIndex, viewBox, ...props }) => {
                const { data } = props; // not always passed, so use operationalEnergyBenchmarkData if needed
                const isLast =
                  index ===
                  operationalEnergyBenchmarkData.retrofitData.length - 1;
                if (!isLast) return null;
                return (
                  <text
                    x={x}
                    y={y - 20} // move text slightly above the dot
                    textAnchor="middle"
                    fill={benchmarkColor}
                    fontSize={12}
                    fontWeight="bold"
                  >
                    Retrofit
                  </text>
                );
              }}
            />
          )}
      </LineChart>
    </ResponsiveContainer>
  );
};
