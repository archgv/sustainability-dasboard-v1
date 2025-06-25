
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { availableKPIs } from '@/types/project';

interface KPISelectorProps {
  selectedKPI1: string;
  selectedKPI2: string;
  onKPI1Change: (value: string) => void;
  onKPI2Change: (value: string) => void;
}

export const KPISelector = ({ selectedKPI1, selectedKPI2, onKPI1Change, onKPI2Change }: KPISelectorProps) => {
  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="kpi1" className="text-sm font-medium text-gray-700 mb-2 block">
            X-Axis KPI
          </Label>
          <Select value={selectedKPI1} onValueChange={onKPI1Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select KPI for X-axis" />
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

        <div>
          <Label htmlFor="kpi2" className="text-sm font-medium text-gray-700 mb-2 block">
            Y-Axis KPI
          </Label>
          <Select value={selectedKPI2} onValueChange={onKPI2Change}>
            <SelectTrigger>
              <SelectValue placeholder="Select KPI for Y-axis" />
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
      </div>
    </Card>
  );
};
