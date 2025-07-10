
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/types/project';

interface CertificationAnalysisProps {
  projects: Project[];
}

const certificationRatings = {
  breeam: ['Outstanding', 'Excellent', 'Very Good', 'Good', 'Pass'],
  leed: ['Platinum', 'Gold', 'Silver', 'Certified'],
  well: ['Platinum', 'Gold', 'Silver', 'Bronze'],
  nabers: ['6 Star', '5.5 Star', '5 Star', '4.5 Star', '4 Star', '3.5 Star', '3 Star'],
  passivhaus: ['Certified'],
  enerphit: ['Certified'],
  uknzcbs: ['Net Zero', 'Near Zero', 'Low Carbon']
};

export const CertificationAnalysis = ({ projects }: CertificationAnalysisProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<string>('breeam');

  const getCertificationData = (certification: string) => {
    const ratings = certificationRatings[certification as keyof typeof certificationRatings] || [];
    const data: { [key: string]: Project[] } = {};
    
    ratings.forEach(rating => {
      data[rating] = [];
    });

    projects.forEach(project => {
      let projectRating = '';
      
      switch (certification) {
        case 'breeam':
          projectRating = project.breeam;
          break;
        case 'leed':
          projectRating = project.leed;
          break;
        case 'well':
          projectRating = project.well;
          break;
        case 'nabers':
          projectRating = project.nabers;
          break;
        case 'passivhaus':
          if (project.passivhaus) projectRating = 'Certified';
          break;
        case 'enerphit':
          if (project.certifications?.includes('EnerPHit')) projectRating = 'Certified';
          break;
        case 'uknzcbs':
          // Assuming this would be in certifications array
          const uknzcbsCert = project.certifications?.find(cert => cert.includes('UKNZCBS'));
          if (uknzcbsCert) {
            if (uknzcbsCert.includes('Net Zero')) projectRating = 'Net Zero';
            else if (uknzcbsCert.includes('Near Zero')) projectRating = 'Near Zero';
            else if (uknzcbsCert.includes('Low Carbon')) projectRating = 'Low Carbon';
          }
          break;
      }
      
      if (projectRating && projectRating !== 'N/A' && data[projectRating]) {
        data[projectRating].push(project);
      }
    });

    return data;
  };

  const certificationData = getCertificationData(selectedCertification);
  const totalCertifiedProjects = Object.values(certificationData).reduce((sum, projects) => sum + projects.length, 0);

  const getRatingColor = (rating: string) => {
    const colors = {
      'Outstanding': 'bg-green-100 text-green-800',
      'Excellent': 'bg-blue-100 text-blue-800',
      'Very Good': 'bg-purple-100 text-purple-800',
      'Good': 'bg-yellow-100 text-yellow-800',
      'Pass': 'bg-gray-100 text-gray-800',
      'Platinum': 'bg-slate-100 text-slate-800',
      'Gold': 'bg-yellow-100 text-yellow-800',
      'Silver': 'bg-gray-100 text-gray-800',
      'Bronze': 'bg-orange-100 text-orange-800',
      'Certified': 'bg-green-100 text-green-800',
      'Net Zero': 'bg-green-100 text-green-800',
      'Near Zero': 'bg-blue-100 text-blue-800',
      'Low Carbon': 'bg-yellow-100 text-yellow-800'
    };
    return colors[rating as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-900">Certification Analysis</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {totalCertifiedProjects} certified projects
          </span>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Select Certification:
            </label>
            <Select value={selectedCertification} onValueChange={setSelectedCertification}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breeam">BREEAM</SelectItem>
                <SelectItem value="leed">LEED</SelectItem>
                <SelectItem value="well">WELL</SelectItem>
                <SelectItem value="nabers">NABERS</SelectItem>
                <SelectItem value="passivhaus">Passivhaus</SelectItem>
                <SelectItem value="enerphit">EnerPHit</SelectItem>
                <SelectItem value="uknzcbs">UKNZCBS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {Object.entries(certificationData).map(([rating, projectsWithRating]) => (
              projectsWithRating.length > 0 && (
                <div key={rating} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge className={getRatingColor(rating)}>
                        {rating}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {projectsWithRating.length} project{projectsWithRating.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {projectsWithRating.map((project) => (
                      <div key={project.id} className="text-sm text-gray-700 bg-gray-50 rounded px-3 py-2">
                        {project.name}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
            
            {totalCertifiedProjects === 0 && (
              <div className="text-center py-8 text-gray-500">
                No projects found with {selectedCertification.toUpperCase()} certification
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
