import { FileText, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { KPIOptionsFiltered } from '@/components/Key/KeyKPI';
import { chartColors } from '../Key/KeyColor';

interface SectorSelectorProps {
	selectedKPI: string;
	setSelectedKPI: (value: string) => void;
	valueType: 'average' | 'total';
	setValueType: (value: 'average' | 'total') => void;
	yearFilter: string;
	setYearFilter: (value: string) => void;
	availableYears: number[];
	onDownloadCSV: () => void;
	onDownloadPNG: () => void;
}

export const SectorSelector = ({ selectedKPI, setSelectedKPI, valueType, setValueType, yearFilter, setYearFilter, availableYears, onDownloadCSV, onDownloadPNG }: SectorSelectorProps) => {
	return (
		<Card className="flex flex-wrap items-center gap-4 shadow-sm-inner p-2 mb-6 ">
			{/* KPI Selector */}
			<div className="flex items-center space-x-2">
				<Select value={selectedKPI} onValueChange={setSelectedKPI}>
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

			{/* Value Type Selector */}
			{!['Biodiversity Net Gain', 'Urban Greening Factor'].includes(selectedKPI) && (
				<div className="flex items-center space-x-2">
					<div style={{ backgroundColor: chartColors.pink }} className="flex rounded-full p-1 bg-slate-100 gap-2">
						<Button
							className={`transition-colors ${valueType === 'average' ? 'bg-white shadow-sm' : 'hover:opacity-80'}`}
							size="sm"
							style={{
								color: chartColors.dark,
								backgroundColor: valueType === 'average' ? 'white' : 'transparent',
							}}
							onClick={() => setValueType('average')}
						>
							Per m²
						</Button>
						<Button
							className={`transition-colors ${valueType === 'total' ? 'bg-white shadow-sm' : 'hover:opacity-80'}`}
							size="sm"
							style={{
								color: chartColors.dark,
								backgroundColor: valueType === 'total' ? 'white' : 'transparent',
							}}
							onClick={() => setValueType('total')}
						>
							Total
						</Button>
					</div>
				</div>
			)}

			{/* Year Selector */}
			<div className="flex items-center space-x-2">
				<Select value={yearFilter} onValueChange={setYearFilter}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All years</SelectItem>
						{availableYears.map((year) => (
							<SelectItem key={year} value={`${year}`}>
								{year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* CSV PNG */}
			<div className="flex items-center space-x-2 ml-auto pr-1">
				<Button variant="outline" size="sm" onClick={onDownloadCSV}>
					<FileText className="h-4 w-4" />
					CSV
				</Button>
				<Button variant="outline" size="sm" onClick={onDownloadPNG}>
					<Download className="h-4 w-4" />
					PNG
				</Button>
			</div>
		</Card>
	);
};
