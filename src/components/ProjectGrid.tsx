
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Zap, Leaf } from 'lucide-react';
import { Project } from '@/types/project';

interface ProjectGridProps {
  projects: Project[];
}

export const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const getPerformanceColor = (value: number, type: 'carbon' | 'energy') => {
    if (type === 'carbon') {
      if (value <= 30) return 'bg-green-100 text-green-800';
      if (value <= 50) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    } else {
      if (value <= 80) return 'bg-green-100 text-green-800';
      if (value <= 120) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Project Portfolio</h2>
        <div className="text-sm text-gray-500">
          Showing {projects.length} projects
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {project.name}
              </h3>
              <Badge variant="outline" className="ml-2 capitalize">
                {project.typology}
              </Badge>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {project.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Completed {new Date(project.completionDate).getFullYear()}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Leaf className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm text-gray-600">Carbon Intensity</span>
                </div>
                <Badge className={getPerformanceColor(project.carbonIntensity, 'carbon')}>
                  {project.carbonIntensity} kgCO2e/m²/yr
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm text-gray-600">Operational Energy</span>
                </div>
                <Badge className={getPerformanceColor(project.operationalEnergy, 'energy')}>
                  {project.operationalEnergy} kWh/m²/yr
                </Badge>
              </div>
            </div>
            
            {project.certifications && project.certifications.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-1">
                  {project.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
