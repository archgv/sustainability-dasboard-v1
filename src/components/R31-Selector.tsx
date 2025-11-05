import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  KPIMatrix,
  KPIOptionsFiltered,
  KPIKeysFiltered,
  KPIOptions,
} from "./Key/KeyKPI";

interface SelectorProps {
  chartType: string;
  setChartType: (value: string) => void;
  selectedKPI1: string;
  setSelectedKPI1: (value: string) => void;
  selectedKPI2: string;
  setSelectedKPI2: (value: string) => void;
  valueType: string;
  setValueType: (value: string) => void;
}

export const Selector = ({
  chartType,
  setChartType,
  selectedKPI1,
  setSelectedKPI1,
  selectedKPI2,
  setSelectedKPI2,
  valueType,
  setValueType,
}: SelectorProps) => {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div>
            <Label
              htmlFor="chart-type"
              className="text-sm font-medium text-gray-700 mb-4 block pl-6"
            >
              Chart Type
            </Label>
            <Select
              value={chartType}
              onValueChange={(value) => setChartType(value as string)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Compare Two">Compare Two KPIs</SelectItem>
                <SelectItem value="Single Project">
                  Single KPI Across Projects
                </SelectItem>
                <SelectItem value="Single Time">
                  Single KPI Over Time
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[130px]">
            <Label
              htmlFor="value-type"
              className="text-sm font-medium text-gray-700 mb-4 block pl-6"
            >
              Value Type
            </Label>
            <Select
              value={valueType}
              onValueChange={(value) => setValueType(value as string)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Value Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="average">Per m² GIA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <Label htmlFor="kpi1" className=" mb-4 block pl-6">
              KPI 1
            </Label>
            <Select value={selectedKPI1} onValueChange={setSelectedKPI1}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KPIOptionsFiltered.map((kpi) => (
                  <SelectItem key={kpi.key} value={kpi.key}>
                    {kpi.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {chartType === "Compare Two" && (
            <div>
              <Label
                htmlFor="kpi2"
                className="text-sm font-medium mb-4 block pl-6"
              >
                KPI 2
              </Label>
              <Select value={selectedKPI2} onValueChange={setSelectedKPI2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Second KPI" />
                </SelectTrigger>
                <SelectContent>
                  {KPIOptions.filter((kpi) =>
                    KPIMatrix[selectedKPI1]?.includes(kpi.key)
                  ).map((kpi) => (
                    <SelectItem key={kpi.key} value={kpi.key}>
                      {kpi.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
