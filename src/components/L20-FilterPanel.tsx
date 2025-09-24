import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
	filters: {
		'Primary Sector': string;
		dateRange: string;
		carbonRange: number[];
		energyRange: number[];
		'Project Type': string;
		'Current RIBA Stage': string;
	};
	onFilterChange: (filters: FilterPanelProps['filters']) => void;
	onClearFilters: () => void;
}

export const FilterPanel = ({ filters, onFilterChange, onClearFilters }: FilterPanelProps) => {
	const handlePrimarySectorChange = (value: string) => {
		onFilterChange({
			...filters,
			'Primary Sector': value,
		});
	};
	const handleDateRangeChange = (value: string) => {
		onFilterChange({
			...filters,
			dateRange: value,
		});
	};
	const handleProjectTypeChange = (value: string) => {
		onFilterChange({
			...filters,
			'Project Type': value,
		});
	};
	const handleRibaStageChange = (value: string) => {
		onFilterChange({
			...filters,
			'Current RIBA Stage': value,
		});
	};
	return (
		<Card className="p-6 sticky top-8">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-2">
					<Filter className="h-5 w-5 text-blue-600" />
					<h3 className="text-lg font-semibold text-gray-900">Filters</h3>
				</div>
				<Button variant="outline" size="sm" onClick={onClearFilters} className="flex items-center gap-2">
					<X className="h-4 w-4" />
					Clear
				</Button>
			</div>

			<p className="text-gray-600 mb-4 italic text-xs">Filters apply to project comparison only</p>

			<div className="space-y-6">
				{/* Typology Filter */}
				<div>
					<Label htmlFor="typology" className="text-sm font-medium text-gray-700 mb-2 block">
						Sector
					</Label>
					<Select value={filters['Primary Sector']} onValueChange={handlePrimarySectorChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select sector" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Sectors</SelectItem>
							<SelectItem value="Workplace">Workplace</SelectItem>
							<SelectItem value="Residential">Residential</SelectItem>
							<SelectItem value="Education">Education</SelectItem>
							<SelectItem value="Healthcare">Healthcare</SelectItem>
							<SelectItem value="Infrastructure">Infrastructure</SelectItem>
							<SelectItem value="CCC">CCC</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Project Type Filter */}
				<div>
					<Label htmlFor="projectType" className="text-sm font-medium text-gray-700 mb-2 block">
						Project Type
					</Label>
					<Select value={filters['Project Type'] || 'all'} onValueChange={handleProjectTypeChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select project type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Projects</SelectItem>
							<SelectItem value="New Build">New Build</SelectItem>
							<SelectItem value="Retrofit">Retrofit</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* RIBA Stage Filter */}
				<div>
					<Label htmlFor="ribaStage" className="text-sm font-medium text-gray-700 mb-2 block">
						RIBA Stage
					</Label>
					<Select value={filters['Current RIBA Stage'] || 'all'} onValueChange={handleRibaStageChange}>
						<SelectTrigger>
							<SelectValue placeholder="Select RIBA stage" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Stages</SelectItem>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
							<SelectItem value="4">4</SelectItem>
							<SelectItem value="5">5</SelectItem>
							<SelectItem value="6">6</SelectItem>
							<SelectItem value="7">7</SelectItem>
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
