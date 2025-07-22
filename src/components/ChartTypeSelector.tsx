import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { availableKPIs } from '@/types/project';
export type ChartType = 'compare-bubble' | 'single-bar' | 'single-timeline';
export type EmbodiedCarbonBreakdown = 'none' | 'lifecycle' | 'element';
export type ValueType = 'total' | 'per-sqm';
interface ChartTypeSelectorProps {
  chartType: ChartType;
  selectedKPI1: string;
  selectedKPI2: string;
  embodiedCarbonBreakdown: EmbodiedCarbonBreakdown;
  valueType: ValueType;
  onChartTypeChange: (value: ChartType) => void;
  onKPI1Change: (value: string) => void;
  onKPI2Change: (value: string) => void;
  onEmbodiedCarbonBreakdownChange: (value: EmbodiedCarbonBreakdown) => void;
  onValueTypeChange: (value: ValueType) => void;
}

// KPI compatibility matrix based on the provided matrix
const kpiCompatibilityMatrix: Record<string, string[]> = {
  'upfrontCarbon': ['totalEmbodiedCarbon', 'refrigerants', 'ozoneDepletion', 'reusedRecycledMaterial'],
  'totalEmbodiedCarbon': ['upfrontCarbon', 'refrigerants', 'ozoneDepletion', 'reusedRecycledMaterial'],
  'refrigerants': ['upfrontCarbon', 'totalEmbodiedCarbon', 'ozoneDepletion'],
  'operationalEnergy': ['gasUsage', 'spaceHeatingDemand', 'renewableEnergyGeneration', 'existingBuildingEnergy'],
  'gasUsage': ['operationalEnergy', 'spaceHeatingDemand', 'renewableEnergyGeneration', 'existingBuildingEnergy'],
  'spaceHeatingDemand': ['operationalEnergy', 'gasUsage', 'renewableEnergyGeneration', 'existingBuildingEnergy'],
  'renewableEnergyGeneration': ['operationalEnergy', 'gasUsage', 'spaceHeatingDemand', 'existingBuildingEnergy'],
  'existingBuildingEnergy': ['operationalEnergy', 'gasUsage', 'spaceHeatingDemand', 'renewableEnergyGeneration'],
  'breeam': ['leed', 'well', 'nabers', 'passivhaus'],
  'leed': ['breeam', 'well', 'nabers', 'passivhaus'],
  'well': ['breeam', 'leed', 'nabers', 'passivhaus', 'pmv', 'daylightFactor'],
  'nabers': ['breeam', 'leed', 'well', 'passivhaus'],
  'passivhaus': ['breeam', 'leed', 'well', 'nabers'],
  'pmv': ['well', 'daylightFactor'],
  'daylightFactor': ['well', 'pmv'],
  'biodiversityNetGain': ['habitatUnits', 'urbanGreeningFactor'],
  'habitatUnits': ['biodiversityNetGain', 'urbanGreeningFactor'],
  'urbanGreeningFactor': ['biodiversityNetGain', 'habitatUnits'],
  'ozoneDepletion': ['upfrontCarbon', 'totalEmbodiedCarbon', 'refrigerants'],
  'reusedRecycledMaterial': ['upfrontCarbon', 'totalEmbodiedCarbon']
};
export const ChartTypeSelector = ({
  chartType,
  selectedKPI1,
  selectedKPI2,
  embodiedCarbonBreakdown,
  valueType,
  onChartTypeChange,
  onKPI1Change,
  onKPI2Change,
  onEmbodiedCarbonBreakdownChange,
  onValueTypeChange
}: ChartTypeSelectorProps) => {
  const showKPI2 = chartType === 'compare-bubble';
  const showEmbodiedCarbonBreakdown = chartType === 'single-bar' && selectedKPI1 === 'totalEmbodiedCarbon';

  // Get compatible KPI2 options based on selected KPI1
  const compatibleKPI2Options = showKPI2 ? availableKPIs.filter(kpi => kpiCompatibilityMatrix[selectedKPI1]?.includes(kpi.key)) : [];
  return <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="chart-type" className="text-sm font-medium text-gray-700 mb-2 block">
            Chart Type
          </Label>
          <Select value={chartType} onValueChange={onChartTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compare-bubble">Compare two KPIs (bubble)</SelectItem>
              <SelectItem value="single-bar">Single KPI across projects (bar chart)</SelectItem>
              <SelectItem value="single-timeline">Single KPI over time (timeline)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="value-type" className="text-sm font-medium text-gray-700 mb-2 block">
            Value Type
          </Label>
          <Select value={valueType} onValueChange={onValueTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select value type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Total Values</SelectItem>
              <SelectItem value="per-sqm">Per sqm GIA</SelectItem>
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
              {availableKPIs.map(kpi => <SelectItem key={kpi.key} value={kpi.key}>
                  {kpi.label} ({kpi.unit})
                </SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {showKPI2 && <div>
            <Label htmlFor="kpi2" className="text-sm font-medium text-gray-700 mb-2 block">
              KPI 2
            </Label>
            <Select value={selectedKPI2} onValueChange={onKPI2Change}>
              <SelectTrigger>
                <SelectValue placeholder="Select second KPI" />
              </SelectTrigger>
              <SelectContent>
                {compatibleKPI2Options.map(kpi => <SelectItem key={kpi.key} value={kpi.key}>
                    {kpi.label} ({kpi.unit})
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>}
      </div>

      {showEmbodiedCarbonBreakdown}
    </Card>;
};