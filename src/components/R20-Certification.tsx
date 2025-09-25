import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types/project';
import { certificationRatings } from './Utils/UtilCertification';

export const Certification = ({ projects }: { projects: Project[] }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [selectedCertification, setSelectedCertification] = useState<string>('BREEAM');
	const getCertificationData = (certification: string) => {
		const ratings = certificationRatings[certification as keyof typeof certificationRatings] || [];
		const data: {
			[key: string]: Project[];
		} = {};

		// Initialize all ratings with empty arrays
		ratings.forEach((rating) => {
			data[rating] = [];
		});
		projects.forEach((project) => {
			const projectRating = project[certification];
			if (projectRating && projectRating !== 'N/A' && data[projectRating]) {
				data[projectRating].push(project);
			}
		});
		return data;
	};
	const certificationData = getCertificationData(selectedCertification);
	const maxCount = Math.max(...Object.values(certificationData).map((projects) => projects.length), 4);

	const getBarColor = (rating: string) => {
		const colors = {
			'Outstanding': '#253E2C',
			'Excellent': '#2D9B4D',
			'Very Good': '#39FF8D',
			'Good': '#C2FF39',
			'Pass': '#E9E8D3',
			'Platinum': '#253E2C',
			'Gold': '#2D9B4D',
			'Silver': '#39FF8D',
			'Bronze': '#C2FF39',
			'Certified': selectedCertification === 'LEED' ? '#E9E8D3' : '#253E2C',
			'Net Zero': '#253E2C',
			'6 Star': '#253E2C',
			'5 Star': '#2D9B4D',
			'4 Star': '#39FF8D',
			'3 Star': '#C2FF39',
			'2 Star': '#E9E8D3',
			'1 Star': '#F5F5F5',
		};
		return colors[rating as keyof typeof colors] || '#E9E8D3';
	};
	const getDisplayName = (project: Project) => {
		const baseId = project.id.split('-')[0];
		const projectNumber = `250${parseInt(baseId) + 116}`;
		return `${projectNumber}_${project['Project Name']}`;
	};
	return (
		<Card className="p-6">
			<div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
				<h2 className="text-xl font-semibold text-gray-900">Certification Analysis</h2>
				<ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
			</div>

			{isExpanded && (
				<div className="mt-6 space-y-4">
					<div className="flex items-center space-x-4">
						<Select value={selectedCertification} onValueChange={setSelectedCertification}>
							<SelectTrigger className="w-48 rounded-full px-6">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="BREEAM">BREEAM</SelectItem>
								<SelectItem value="LEED">LEED</SelectItem>
								<SelectItem value="WELL">WELL</SelectItem>
								<SelectItem value="Fitwell">Fitwell</SelectItem>
								<SelectItem value="Passivhaus">Passivhaus</SelectItem>
								<SelectItem value="EnerPHit">EnerPHit</SelectItem>
								<SelectItem value="NABERS">NABERS</SelectItem>
								<SelectItem value="UKNZCBS">UKNZCBS</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-4">
						{Object.entries(certificationData).map(([rating, projectsWithRating]) => {
							const count = projectsWithRating.length;
							const baseWidth = 25; // Base width percentage for empty bars
							const barWidth = count === 0 ? baseWidth : Math.max(baseWidth, (count / maxCount) * 100);
							return (
								<div key={rating} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<span className="text-sm font-medium text-black">{rating}</span>
										</div>
										<span className="text-sm font-medium text-gray-700">{count}</span>
									</div>

									<div className="relative">
										<div className="w-full rounded-full h-6 bg-gray-50">
											{count > 0 && (
												<div
													className="h-6 rounded-full transition-all duration-300"
													style={{
														width: `${barWidth}%`,
														backgroundColor: getBarColor(rating),
													}}
												/>
											)}
										</div>

										{count > 0 && (
											<div className="mt-2 space-y-1">
												{projectsWithRating.map((project) => (
													<div key={project.id} className="text-sm text-gray-600 pl-2">
														{getDisplayName(project)}
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</Card>
	);
};
