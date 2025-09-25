export const DashboardHeader = () => {
	return (
		<header className="bg-white shadow-sm border-b sticky top-0 z-50">
			<div className="container mx-auto px-6 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="bg-white p-3 rounded-lg">
							<img src="/lovable-uploads/4ce0bfd4-e09c-45a3-bb7c-0a84df6eca91.png" alt="Hawkins Brown" className="h-12 w-auto" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Sustainability Performance Dashboard</h1>
							<p className="text-gray-600 mt-1">Track environmental KPIs across all architectural projects</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
