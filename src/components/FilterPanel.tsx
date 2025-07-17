import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

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
  onClearFilters: () => void;
  anonymizeProjects: boolean;
  onAnonymizeChange: (anonymize: boolean) => void;
}

export const FilterPanel = ({
  filters,
  onFilterChange,
  onClearFilters,
  anonymizeProjects,
  onAnonymizeChange
}: FilterPanelProps) => {
  const handleTypologyChange = (value: string) => {
    onFilterChange({
      ...filters,
      typology: value
    });
  };
  const handleDateRangeChange = (value: string) => {
    onFilterChange({
      ...filters,
      dateRange: value
    });
  };
  const handleProjectTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      projectType: value
    });
  };
  const handleRibaStageChange = (value: string) => {
    onFilterChange({
      ...filters,
      ribaStage: value
    });
  };

  return <Card className="p-6 sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 italic">
        Filters apply to project comparison only
      </p>
      
      <div className="space-y-6">
        {/* Typology Filter */}
        <div>
          <Label htmlFor="typology" className="text-sm font-medium text-gray-700 mb-2 block">Sector</Label>
          <Select value={filters.typology} onValueChange={handleTypologyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="educational">Education</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="ccc">CCC</SelectItem>
              <SelectItem value="office">Commercial</SelectItem>
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

        {/* Anonymize Projects Toggle */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label htmlFor="anonymize-toggle" className="text-sm font-medium text-gray-700">
              Anonymise projects
            </Label>
            <Switch id="anonymize-toggle" checked={anonymizeProjects} onCheckedChange={onAnonymizeChange} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Hide project names except primary project
          </p>
        </div>
      </div>
    </Card>;
};
