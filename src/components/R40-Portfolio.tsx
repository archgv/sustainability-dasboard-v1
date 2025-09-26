import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Zap, Leaf, FileText } from 'lucide-react';
import { Project } from '@/components/Key/project';

interface PortfolioProps {
	projects: Project[];
	isComparingToSelf?: boolean;
	selectedRibaStages?: string[];
	primaryProject?: string;
}

export const Portfolio = ({ projects, isComparingToSelf = false, selectedRibaStages = [], primaryProject = '' }: PortfolioProps) => {
	// Format numbers with commas
	const formatNumber = (num: number) => {
		return num.toLocaleString();
	};

	return (
		<Card className="shadow-inner rounded-tl-[40px] rounded-tr-[40px] rounded-bl-none rounded-br-none pb-20">
			<div className="flex items-center justify-between mb-2">
				<h2 className="">{isComparingToSelf ? 'Project RIBA Stages' : 'Project Portfolio'}</h2>
				<div className="text-sm text-gray-300 pr-10">
					Showing {formatNumber(projects.length)} {isComparingToSelf ? 'stages' : 'projects'}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{projects.map((project, index) => {
					return (
						<Card key={project.id} className="px-8 pb-8 hover:shadow-lg transition-shadow duration-200">
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{project['Project Name'] || 'ERROR'}</h3>
								<span className="ml-2 capitalize text-sm text-gray-600">{project['Primary Sector'] || 'ERROR'}</span>
							</div>

							<div className="space-y-3 mb-4">
								<div className="flex items-center text-sm text-gray-600">
									<MapPin className="h-4 w-4 mr-2" />
									{project['Project Location']}
								</div>
								<div className="flex items-center text-sm text-gray-600">
									<Calendar className="h-4 w-4 mr-2" />
									{project['Current RIBA Stage'] === '7' ? `PC date ${new Date(project['PC Date']).getFullYear()}` : `PC date ${new Date(project['PC Date']).getFullYear()}`}
								</div>
								<div className="flex items-center text-sm text-gray-600">
									<FileText className="h-4 w-4 mr-2" />
									<span className="text-sm text-gray-600">{project['Current RIBA Stage']}</span>
								</div>
								<div className="text-sm text-gray-600">
									<span className="font-medium">Project Type:</span> {project['Project Type'] === 'New Build' ? 'New Build' : 'Retrofit'}
								</div>

								<div className="text-sm text-gray-600">
									<span className="font-medium">GIA:</span> {formatNumber(project['GIA'] || 0)} m²
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<Leaf className="h-4 w-4 mr-2 text-green-600" />
										<span className="text-sm text-gray-600">Embodied Carbon</span>
									</div>
									<span className="text-sm text-gray-600">{formatNumber(project['Total Embodied Carbon'])} kgCO2e/m²</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<Zap className="h-4 w-4 mr-2 text-blue-600" />
										<span className="text-sm text-gray-600">Operational Energy</span>
									</div>
									<span className="text-sm text-gray-600">{formatNumber(project['Operational Energy Total'])} kWh/m²/yr</span>
								</div>

								{project['Project Type'] === 'Retrofit' && project['Operational Energy Existing Building'] && (
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<Zap className="h-4 w-4 mr-2 text-orange-600" />
											<span className="text-sm text-gray-600">Existing Building Energy</span>
										</div>
										<span className="text-sm text-gray-600">{formatNumber(project['Operational Energy Existing Building'])} kWh/m²/yr</span>
									</div>
								)}
							</div>
						</Card>
					);
				})}
			</div>
		</Card>
	);
};
