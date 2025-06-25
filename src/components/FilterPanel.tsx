
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    typology: string;
    dateRange: string;
    carbonRange: number[];
    energyRange: number[];
  };
  onFilterChange: (filters: any) => void;
}

export const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const handleTypologyChange = (value: string) => {
    onFilterChange({ ...filters, typology: value });
  };

  const handleDateRangeChange = (value: string) => {
    onFilterChange({ ...filters, dateRange: value });
  };

  const handleCarbonRangeChange = (value: number[]) => {
    onFilterChange({ ...filters, carbonRange: value });
  };

  const handleEnergyRangeChange = (value: number[]) => {
    onFilterChange({ ...filters, energyRange: value });
  };

  return (
    <Card className="p-6 sticky top-8">
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>
      
      <div className="space-y-6">
        {/* Typology Filter */}
        <div>
          <Label htmlFor="typology" className="text-sm font-medium text-gray-700 mb-2 block">
            Building Typology
          </Label>
          <Select value={filters.typology} onValueChange={handleTypologyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select typology" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="mixed-use">Mixed Use</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div>
          <Label htmlFor="dateRange" className="text-sm font-medium text-gray-700 mb-2 block">
            Project Timeline
          </Label>
          <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="recent">Recent (2+ years)</SelectItem>
              <SelectItem value="older">Older Projects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Carbon Intensity Range */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Carbon Intensity (kgCO2e/m²/yr)
          </Label>
          <div className="px-2">
            <Slider
              value={filters.carbonRange}
              onValueChange={handleCarbonRangeChange}
              min={0}
              max={100}
              step={5}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{filters.carbonRange[0]}</span>
              <span>{filters.carbonRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Energy Range */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Operational Energy (kWh/m²/yr)
          </Label>
          <div className="px-2">
            <Slider
              value={filters.energyRange}
              onValueChange={handleEnergyRangeChange}
              min={0}
              max={200}
              step={10}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{filters.energyRange[0]}</span>
              <span>{filters.energyRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
