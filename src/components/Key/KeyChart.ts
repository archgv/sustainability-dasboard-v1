// Mock building area data for demonstration
export const getProjectArea = (projectId: string): number => {
	const areas: Record<string, number> = {
		'1': 15000, // Green Office Tower
		'2': 8500, // Sustainable Housing Complex
		'3': 22000, // Innovation Campus
		'4': 12000, // Community Health Center
		'5': 18000, // Urban Retail Hub
	};
	return areas[projectId] || 10000;
};
