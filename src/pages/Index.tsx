
import { useState } from 'react';
import { FilterPanel } from '@/components/FilterPanel';
import { ChartSection } from '@/components/ChartSection';
import { ProjectGrid } from '@/components/ProjectGrid';
import { DashboardHeader } from '@/components/DashboardHeader';
import { sampleProjects } from '@/data/sampleData';

const Index = () => {
  const [filteredProjects, setFilteredProjects] = useState(sampleProjects);
  const [filters, setFilters] = useState({
    typology: 'all',
    dateRange: 'all',
    carbonRange: [0, 100],
    energyRange: [0, 200]
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // Apply filters to projects
    const filtered = sampleProjects.filter(project => {
      const typologyMatch = newFilters.typology === 'all' || project.typology === newFilters.typology;
      const carbonMatch = project.carbonIntensity >= newFilters.carbonRange[0] && 
                         project.carbonIntensity <= newFilters.carbonRange[1];
      const energyMatch = project.operationalEnergy >= newFilters.energyRange[0] && 
                         project.operationalEnergy <= newFilters.energyRange[1];
      
      let dateMatch = true;
      if (newFilters.dateRange !== 'all') {
        const projectYear = new Date(project.completionDate).getFullYear();
        const currentYear = new Date().getFullYear();
        
        switch (newFilters.dateRange) {
          case 'recent':
            dateMatch = currentYear - projectYear <= 2;
            break;
          case 'older':
            dateMatch = currentYear - projectYear > 2;
            break;
        }
      }
      
      return typologyMatch && carbonMatch && energyMatch && dateMatch;
    });
    
    setFilteredProjects(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Charts Section */}
            <ChartSection projects={filteredProjects} />
            
            {/* Projects Grid */}
            <ProjectGrid projects={filteredProjects} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
