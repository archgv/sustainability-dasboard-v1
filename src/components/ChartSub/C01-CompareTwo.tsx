import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Project } from "../Key/project";
import { KPIOptions } from "../Key/KeyKPI";
import { getSectorColor, getSectorShape } from "@/components/Key/KeySector";
import { formatNumber } from "@/lib/utils";
import { ChartShape } from "../Util/UtilShape";
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

interface CompareTwoProps {
  projects: Project[];
  selectedKPI1: string;
  selectedKPI2: string;
  valueType: string;
  isComparingToSelf?: boolean;
}

export const CompareTwo = ({
  projects,
  selectedKPI1,
  selectedKPI2,
  valueType,
  isComparingToSelf = false,
}: CompareTwoProps) => {
  const kpi1Config = KPIOptions.find((kpi) => kpi.key === selectedKPI1);
  const kpi2Config = KPIOptions.find((kpi) => kpi.key === selectedKPI2);

  // Transform biogenic carbon values to negative for bubble chart display - use sorted projects
  const chartData = projects.map((project) => {
    const projectCurrentStage = getProjectCurrrentStage(project);
    const multiplier = valueType === "total" ? getGIA(project) : 1;
    const projectKPI1 = projectCurrentStage[selectedKPI1] * multiplier;
    const projectKPI2 = projectCurrentStage[selectedKPI2] * multiplier;
    return {
      "Project Name": project["Project Name"],
      "Primary Sector": project["Primary Sector"],
      "Current RIBA Stage": project["Current RIBA Stage"],
      [selectedKPI1]:
        selectedKPI1 === "Biogenic Carbon"
          ? -Math.abs(projectKPI1 || 0)
          : projectKPI1,
      [selectedKPI2]:
        selectedKPI2 === "Biogenic Carbon"
          ? -Math.abs(projectKPI2 || 0)
          : projectKPI2,
    };
  });

  return (
    <ResponsiveContainer {...getResponsiveContainerProps()}>
      <ScatterChart {...getChartProps()}>
        <CartesianGrid {...getCartesianGridProps()} />
        <XAxis
          {...getXAxisProps("Compare Two", kpi1Config, valueType)}
          type="number"
          dataKey={selectedKPI1}
          name={kpi1Config.key || selectedKPI1}
          tick={{ fill: chartColors.dark, fontSize: 12 }}
          tickFormatter={(value) => formatNumber(value)}
          ticks={(() => {
            const maxValue = Math.max(
              ...chartData.map((project) =>
                Math.abs(Number(project[selectedKPI1]) || 0)
              )
            );
            return generateNiceTicks(maxValue * 1.1);
          })()}
        />
        <YAxis
          {...getYAxisProps("Compare Two", kpi2Config, valueType)}
          type="number"
          dataKey={selectedKPI2}
          name={kpi2Config.key || selectedKPI2}
          tickFormatter={(value) => formatNumber(value)}
          ticks={(() => {
            const maxValue = Math.max(
              ...chartData.map((project) =>
                Math.abs(Number(project[selectedKPI1]) || 0)
              )
            );
            return generateNiceTicks(maxValue * 1.1);
          })()}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={getTooltipContainerStyle()}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const project = payload[0].payload;
              const displayName =
                isComparingToSelf && project["Current RIBA Stage"]
                  ? `${project["Project Name"]} (RIBA ${project["Current RIBA Stage"]})`
                  : project["Project Name"];

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
                    {displayName}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: chartColors.darkGreen }}
                  >
                    {project["Primary Sector"]}
                  </p>
                  <p className="text-sm" style={{ color: chartColors.dark }}>
                    {kpi1Config.key}: {formatNumber(project[selectedKPI1])}{" "}
                    {getUnit(kpi1Config, valueType)}
                  </p>
                  <p className="text-sm" style={{ color: chartColors.dark }}>
                    {kpi2Config.key}: {formatNumber(project[selectedKPI2])}{" "}
                    {getUnit(kpi2Config, valueType)}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter
          name="Projects"
          data={chartData}
          fill={chartColors.primary}
          fillOpacity={0.8}
          shape={(props) => {
            const { cx, cy, payload } = props;
            if (!payload) return null;

            const bubbleSize = 8;
            const sectorColor = getSectorColor(payload["Primary Sector"]);
            const shape = getSectorShape(payload["Primary Sector"]);

            return (
              <ChartShape
                cx={cx}
                cy={cy}
                fill={sectorColor}
                shape={shape}
                size={Math.max(16, Math.min(40, bubbleSize * 2))}
              />
            );
          }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
