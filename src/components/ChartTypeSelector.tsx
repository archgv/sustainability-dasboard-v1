
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { availableKPIs } from '@/types/project';

export type ChartType = 'compare-scatter' | 'compare-bubble' | 'single-bar' | 'single-timeline';

interface ChartTypeSelectorProps {
  chartType: ChartType;
  selectedKPI1: string;
  selectedKPI2: string;
  onChartTypeChange: (value: ChartType) => void;
  onKPI1Change: (value: string) => void;
  onKPI2Change: (value: string) => void;
}

export const ChartTypeSelector = ({
  chartType,
  selectedKPI1,
  selectedKPI2,
  onChartTypeChange,
  onKPI1Change,
  onKPI2Change
}: ChartTypeSelectorProps) => {
  const showKPI2 = chartType === 'compare-scatter' || chartType === 'compare-bubble';

  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="chart-type" className="text-sm font-medium text-gray-700 mb-2 block">
            Chart Type
          </Label>
          <Select value={chartType} onValueChange={onChartTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compare-scatter">Compare two KPIs (scatter)</SelectItem>
              <SelectItem value="compare-bubble">Compare two KPIs (bubble)</SelectItem>
              <SelectItem value="single-bar">Single KPI across projects (bar chart)</SelectItem>
              <SelectItem value="single-timeline">Single KPI over time (timeline)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="kpi1" className="text-sm font-medium text-gray-700 mb-2 block">
            KPI 1
          </Label>
          <Select value={selectedKPI1} onValueChange={onKPI1Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select first KPI" />
            </SelectTrigger>
            <SelectContent>
              {availableKPIs.map((kpi) => (
                <SelectItem key={kpi.key} value={kpi.key}>
                  {kpi.label} ({kpi.unit})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showKPI2 && (
          <div>
            <Label htmlFor="kpi2" className="text-sm font-medium text-gray-700 mb-2 block">
              KPI 2
            </Label>
            <Select value={selectedKPI2} onValueChange={onKPI2Change}>
              <SelectTrigger>
                <SelectValue placeholder="Select second KPI" />
              </SelectTrigger>
              <SelectContent>
                {availableKPIs.map((kpi) => (
                  <SelectItem key={kpi.key} value={kpi.key}>
                    {kpi.label} ({kpi.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </Card>
  );
};
