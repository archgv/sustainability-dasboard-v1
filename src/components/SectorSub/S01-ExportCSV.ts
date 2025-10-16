import { formatNumber } from "@/lib/utils";
import { KPIOption } from "../Key/KeyKPI";
import { getUnit } from "../Util/ChartConfig";

interface SectorStats {
  count: number;
  totalValue: number;
  totalGIA: number;
  minValue: number;
  maxValue: number;
  values: number[];
}

type SectorStatsMap = Record<string, SectorStats>;

interface ExportCSVOptions {
  selectedKPI: string;
  currentKPI: KPIOption;
  valueType: string;
  yearFilter: string;
  sectorStats: SectorStatsMap;
  SectorKeys: string[];
}

const getAverage = (total: number, count: number) => {
  return count > 0 ? Math.round(total / count) : 0;
};

export const exportSectorCSV = (options: ExportCSVOptions) => {
  const {
    selectedKPI,
    currentKPI,
    valueType,
    yearFilter,
    sectorStats,
    SectorKeys,
  } = options;

  console.log("Downloading CSV for sector performance analysis");

  const csvContent =
    [
      "Sector Performance Analysis",
      `KPI: ${currentKPI.key} (${getUnit(currentKPI, valueType, true)})`,
      `Value Type: ${valueType}`,
      `Year Filter: ${yearFilter}`,
      "",
      `Sector,Projects,Average (${getUnit(
        currentKPI,
        valueType,
        true
      )}),Min (${getUnit(currentKPI, valueType, true)}),Max (${getUnit(
        currentKPI,
        valueType,
        true
      )}),Range (${getUnit(currentKPI, valueType, true)})`,
    ].join("\n") + "\n";

  const csvData = SectorKeys.map((sector) => {
    const stats = sectorStats[sector];
    const avg = stats ? getAverage(stats.totalValue, stats.count) : 0;
    const min =
      stats && stats.minValue !== Infinity ? Math.round(stats.minValue) : 0;
    const max =
      stats && stats.maxValue !== -Infinity ? Math.round(stats.maxValue) : 0;
    const range = max - min;
    const count = stats ? stats.count : 0;
    return `${sector},${count},${formatNumber(avg)},${formatNumber(
      min
    )},${formatNumber(max)},${formatNumber(range)}`;
  }).join("\n");

  const fullCsvContent = csvContent + csvData;
  const blob = new Blob([fullCsvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sector-performance-${selectedKPI}-${valueType}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
