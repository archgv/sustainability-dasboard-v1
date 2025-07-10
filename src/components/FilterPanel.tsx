
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    typology: string;
    dateRange: string;
    carbonRange: number[];
    energyRange: number[];
    projectType: string;
    ribaStage: string;
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

  const handleProjectTypeChange = (value: string) => {
    onFilterChange({ ...filters, projectType: value });
  };

  const handleRibaStageChange = (value: string) => {
    onFilterChange({ ...filters, ribaStage: value });
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

        {/* Project Type Filter */}
        <div>
          <Label htmlFor="projectType" className="text-sm font-medium text-gray-700 mb-2 block">
            Project Type
          </Label>
          <Select value={filters.projectType || 'all'} onValueChange={handleProjectTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="new-build">New Build</SelectItem>
              <SelectItem value="retrofit">Retrofit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* RIBA Stage Filter */}
        <div>
          <Label htmlFor="ribaStage" className="text-sm font-medium text-gray-700 mb-2 block">
            RIBA Stage
          </Label>
          <Select value={filters.ribaStage || 'all'} onValueChange={handleRibaStageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select RIBA stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="stage-1">Stage 1</SelectItem>
              <SelectItem value="stage-2">Stage 2</SelectItem>
              <SelectItem value="stage-3">Stage 3</SelectItem>
              <SelectItem value="stage-4">Stage 4</SelectItem>
              <SelectItem value="stage-5">Stage 5</SelectItem>
              <SelectItem value="stage-6">Stage 6</SelectItem>
              <SelectItem value="stage-7">Stage 7</SelectItem>
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
      </div>
    </Card>
  );
};
