import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/components/Utils/project';
import { certificationRatings } from './Utils/UtilCertification';
import { certificationColors } from './Utils/UtilColor';

export const Certification = ({ projects }: { projects: Project[] }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [selectedCertification, setSelectedCertification] = useState<string>('BREEAM');
	const [expandedRatings, setExpandedRatings] = useState<Record<string, boolean>>({});
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

	const getBarColor = (rating: string, selectedCertification: string) => {
		if (rating === 'Certified' && selectedCertification === 'LEED') {
			return '#E9E8D3'; // LEED special case
		}
		return certificationColors[rating] || '#E9E8D3';
	};
	const getDisplayName = (project: Project) => {
		const baseId = project.id.split('-')[0];
		const projectNumber = `250${parseInt(baseId) + 116}`;
		return `${projectNumber}_${project['Project Name']}`;
	};

	const toggleRatingExpansion = (rating: string) => {
		setExpandedRatings(prev => ({
			...prev,
			[rating]: !prev[rating]
		}));
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
									<div className="flex items-center gap-4">
										<div className="w-24 flex-shrink-0">
											<span className="text-sm font-medium text-black">{rating}</span>
										</div>
										
										<div className="flex-1 relative">
											<div className="w-full rounded-full h-6 bg-gray-50">
												{count > 0 && (
													<div
														className="h-6 rounded-full transition-all duration-300"
														style={{
															width: `${barWidth}%`,
															backgroundColor: getBarColor(rating, selectedCertification),
														}}
													/>
												)}
											</div>
										</div>
										
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium text-gray-700">{count}</span>
											{count > 0 && (
												<button
													onClick={() => toggleRatingExpansion(rating)}
													className="p-1 hover:bg-gray-100 rounded transition-colors"
													aria-label={expandedRatings[rating] ? 'Hide projects' : 'Show projects'}
												>
													<ChevronDown 
														className={`h-4 w-4 text-gray-400 transition-transform ${
															expandedRatings[rating] ? 'rotate-180' : ''
														}`} 
													/>
												</button>
											)}
										</div>
									</div>

									{count > 0 && expandedRatings[rating] && (
										<div className="ml-28 space-y-1">
											{projectsWithRating.map((project) => (
												<div key={project.id} className="text-sm text-gray-600">
													{getDisplayName(project)}
												</div>
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</Card>
	);
};
