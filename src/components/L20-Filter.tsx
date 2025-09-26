import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface FilterProps {
	filters: {
		'Primary Sector': string;
		dateRange: string;
		carbonRange: number[];
		energyRange: number[];
		'Project Type': string;
		'Current RIBA Stage': string;
	};
	onFilterChange: (filters: FilterProps['filters']) => void;
	onClearFilters: () => void;
}

export const FilterPanel = ({ filters, onFilterChange, onClearFilters }: FilterProps) => {
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
		<Card className="p-3 rounded-tl-[40px] rounded-tr-[40px] rounded-bl-[66px] rounded-br-[66px] ">
			<Card className="rounded-tl-[80px] rounded-tr-[80px] rounded-bl-[60px] rounded-br-[60px] p-0 shadow-md">
				<Card className="rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[60px] rounded-br-[60px] p-6 pb-4 sticky shadow-inner">
					<div className="flex items-center space-x-2">
						<h2 className="pl-6">Filters</h2>
						<Filter className="h-4 w-4 text-rose-400" />
					</div>

					<p className="text-pink-200 mt-0 mb-4 text-xs pl-6">For Project Comparison Only</p>

					<div className="space-y-4">
						{/* Typology Filter */}
						<div>
							<Label htmlFor="typology" className="text-sm font-medium text-gray-700 mb-1 block pl-6">
								Sector
							</Label>
							<Select value={filters['Primary Sector']} onValueChange={handlePrimarySectorChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select sector" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Sectors</SelectItem>
									<SelectItem value="Residential">Residential</SelectItem>
									<SelectItem value="Education">Education</SelectItem>
									<SelectItem value="Healthcare">Healthcare</SelectItem>
									<SelectItem value="Infrastructure">Infrastructure</SelectItem>
									<SelectItem value="CCC">CCC</SelectItem>
									<SelectItem value="Workplace">Workplace</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Project Type Filter */}
						<div>
							<Label htmlFor="projectType" className="text-sm font-medium text-gray-700 mb-2 block pl-6">
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
							<Label htmlFor="ribaStage" className="text-sm font-medium text-gray-700 mb-2 block pl-6">
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
							<Label htmlFor="dateRange" className="text-sm font-medium text-gray-700 mb-2 block pl-6">
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
					<div className="flex items-center justify-center mt-6">
						<Button variant="outline" size="default" onClick={onClearFilters} className="flex items-center gap-2 text-rose-400">
							<X className="h-4 w-4 text-rose-400" />
							Clear
						</Button>
					</div>
				</Card>
			</Card>
		</Card>
	);
};
